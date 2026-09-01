package com.tomgdroid.hrsync.wear

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.os.SystemClock
import android.util.Log
import androidx.concurrent.futures.await
import androidx.health.services.client.HealthServices
import androidx.health.services.client.MeasureCallback
import androidx.health.services.client.data.Availability
import androidx.health.services.client.data.DataPointContainer
import androidx.health.services.client.data.DataType
import androidx.health.services.client.data.DataTypeAvailability
import androidx.health.services.client.data.DeltaDataType
import com.tomgdroid.hrsync.shared.HrAccuracy
import com.tomgdroid.hrsync.shared.LiveHrSample
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.time.Instant

/**
 * Runs the watch's heart rate sensor for the duration of a workout and relays every sample
 * to the phone.
 *
 * This is a foreground service because Health Services stops delivering measurements to a
 * backgrounded app: without it, the stream would die the moment the watch screen turned off,
 * which is most of a workout.
 */
class HeartRateService : Service() {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private val relay by lazy { PhoneRelay(this) }
    private val measureClient by lazy { HealthServices.getClient(this).measureClient }

    /**
     * Health Services reports sample times as a duration since boot, so wall-clock time needs
     * this anchor. It is captured once per session: recomputing it per sample would make
     * timestamps jitter by however long the calculation drifted.
     */
    private val bootInstant: Instant =
        Instant.now().minusMillis(SystemClock.elapsedRealtime())

    private val callback = object : MeasureCallback {
        override fun onRegistered() {
            Log.i(TAG, "measure callback registered")
        }

        override fun onRegistrationFailed(throwable: Throwable) {
            Log.e(TAG, "measure registration failed", throwable)
            _state.value = MeasureState.Error(throwable.message ?: "Sensor unavailable")
        }

        override fun onAvailabilityChanged(dataType: DeltaDataType<*, *>, availability: Availability) {
            if (availability !is DataTypeAvailability) return
            _accuracy.value = when (availability) {
                DataTypeAvailability.AVAILABLE -> HrAccuracy.GOOD
                DataTypeAvailability.ACQUIRING -> HrAccuracy.UNKNOWN
                DataTypeAvailability.UNAVAILABLE -> HrAccuracy.NO_CONTACT
                else -> HrAccuracy.UNKNOWN
            }
        }

        override fun onDataReceived(data: DataPointContainer) {
            val points = data.getData(DataType.HEART_RATE_BPM)
            if (points.isEmpty()) return
            val accuracy = _accuracy.value
            for (point in points) {
                val sample = LiveHrSample(
                    timeEpochMillis = point.getTimeInstant(bootInstant).toEpochMilli(),
                    bpm = point.value,
                    accuracy = accuracy,
                )
                _lastSample.value = sample
                scope.launch { relay.sendSample(sample) }
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP -> {
                stopMeasuring()
                return START_NOT_STICKY
            }
            else -> startMeasuring()
        }
        // START_STICKY so a workout survives the system reclaiming memory mid-session.
        return START_STICKY
    }

    private fun startMeasuring() {
        if (_state.value == MeasureState.Measuring) return
        startForegroundCompat()
        _state.value = MeasureState.Measuring
        scope.launch {
            val supported = runCatching {
                val capabilities = measureClient.getCapabilitiesAsync().await()
                DataType.HEART_RATE_BPM in capabilities.supportedDataTypesMeasure
            }.getOrDefault(false)

            if (!supported) {
                _state.value = MeasureState.Error("This watch cannot measure heart rate on demand")
                stopSelf()
                return@launch
            }
            measureClient.registerMeasureCallback(DataType.HEART_RATE_BPM, callback)
            relay.sendSessionState(active = true)
        }
    }

    private fun stopMeasuring() {
        scope.launch {
            runCatching {
                measureClient.unregisterMeasureCallbackAsync(DataType.HEART_RATE_BPM, callback).await()
            }
            relay.sendSessionState(active = false)
            _state.value = MeasureState.Idle
            _lastSample.value = null
            stopForeground(STOP_FOREGROUND_REMOVE)
            stopSelf()
        }
    }

    private fun startForegroundCompat() {
        val manager = getSystemService(NotificationManager::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            manager.createNotificationChannel(
                NotificationChannel(
                    CHANNEL_ID,
                    getString(R.string.notification_channel_name),
                    NotificationManager.IMPORTANCE_LOW,
                )
            )
        }
        val open = PendingIntent.getActivity(
            this,
            0,
            Intent(this, WearMainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE,
        )
        val notification: Notification = Notification.Builder(this, CHANNEL_ID)
            .setContentTitle(getString(R.string.notification_title))
            .setContentText(getString(R.string.notification_text))
            .setSmallIcon(android.R.drawable.ic_menu_compass)
            .setContentIntent(open)
            .setOngoing(true)
            .build()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_HEALTH)
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }
    }

    override fun onDestroy() {
        scope.cancel()
        super.onDestroy()
    }

    sealed interface MeasureState {
        data object Idle : MeasureState
        data object Measuring : MeasureState
        data class Error(val message: String) : MeasureState
    }

    companion object {
        private const val TAG = "HeartRateService"
        private const val CHANNEL_ID = "hr_measure"
        private const val NOTIFICATION_ID = 1
        const val ACTION_STOP = "com.tomgdroid.hrsync.wear.STOP"

        private val _state = MutableStateFlow<MeasureState>(MeasureState.Idle)
        val state: StateFlow<MeasureState> = _state

        private val _lastSample = MutableStateFlow<LiveHrSample?>(null)
        val lastSample: StateFlow<LiveHrSample?> = _lastSample

        private val _accuracy = MutableStateFlow(HrAccuracy.UNKNOWN)
        val accuracy: StateFlow<HrAccuracy> = _accuracy

        fun start(context: Context) {
            context.startForegroundService(Intent(context, HeartRateService::class.java))
        }

        fun stop(context: Context) {
            context.startService(
                Intent(context, HeartRateService::class.java).setAction(ACTION_STOP)
            )
        }
    }
}
