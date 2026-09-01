package com.tomgdroid.hrsync.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.tomgdroid.hrsync.db.HrDatabase
import com.tomgdroid.hrsync.db.toEntity
import com.tomgdroid.hrsync.live.HrZone
import com.tomgdroid.hrsync.live.LiveHrRepository
import com.tomgdroid.hrsync.live.LiveSession
import com.tomgdroid.hrsync.live.WatchControl
import com.tomgdroid.hrsync.live.ZoneAlerts
import com.tomgdroid.hrsync.settings.Settings
import com.tomgdroid.hrsync.settings.SettingsStore
import com.tomgdroid.hrsync.sync.SyncScheduler
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

class LiveViewModel(application: Application) : AndroidViewModel(application) {

    private val settingsStore = SettingsStore(application)
    private val watchControl = WatchControl(application)
    private val alerts = ZoneAlerts(application)
    private val dao = HrDatabase.get(application).readingDao()

    val session: StateFlow<LiveSession> = LiveHrRepository.session

    val settings: StateFlow<Settings> = settingsStore.settings
        .stateIn(viewModelScope, SharingStarted.Eagerly, Settings())

    private val _watchConnected = MutableStateFlow(false)
    val watchConnected: StateFlow<Boolean> = _watchConnected

    val recentReadings = dao.recent(limit = 50)
    val storedCount = dao.totalCount()
    val pendingUploadCount = dao.pendingUploadCount()

    init {
        // Keep zone maths in sync with the user's configured maximum.
        settingsStore.settings
            .map { it.maxHr }
            .onEach { LiveHrRepository.maxHr = it }
            .launchIn(viewModelScope)

        // One ticker drives both staleness and the elapsed clock, so the display keeps moving
        // between samples and visibly stops trusting a stream that has died.
        viewModelScope.launch {
            while (isActive) {
                LiveHrRepository.refreshStaleness()
                _watchConnected.value = watchControl.isWatchConnected()
                delay(TICK_MILLIS)
            }
        }

        // Alerting is a side effect of the sample stream, not of recomposition.
        viewModelScope.launch {
            LiveHrRepository.session.collect { current ->
                val config = settings.value
                if (!config.alertsEnabled || !current.active || current.stale) return@collect
                alerts.evaluate(
                    bpm = current.lastSample?.bpm?.takeIf { it > 0 },
                    maxHr = config.maxHr,
                    low = HrZone.entries.firstOrNull { it.number == config.targetZoneLow },
                    high = HrZone.entries.firstOrNull { it.number == config.targetZoneHigh },
                    soundEnabled = true,
                )
            }
        }
    }

    fun toggleWorkout() {
        val starting = !session.value.active
        viewModelScope.launch {
            if (starting) {
                LiveHrRepository.reset()
                alerts.reset()
                LiveHrRepository.onSessionState(active = true)
                watchControl.setMeasuring(true)
            } else {
                watchControl.setMeasuring(false)
                LiveHrRepository.onSessionState(active = false)
                persistSession()
            }
        }
    }

    /** Writes the finished workout into the archive so it reaches Drive on the next sync. */
    private suspend fun persistSession() {
        val recorded = LiveHrRepository.drainRecorded()
        if (recorded.isEmpty()) return
        dao.insertAll(recorded.map { it.toEntity() })
        SyncScheduler.runNow(getApplication())
    }

    fun setMaxHr(value: Int) = viewModelScope.launch { settingsStore.setMaxHr(value) }
    fun setTargetZones(low: Int, high: Int) = viewModelScope.launch { settingsStore.setTargetZones(low, high) }
    fun setAlertsEnabled(value: Boolean) = viewModelScope.launch { settingsStore.setAlertsEnabled(value) }
    fun setKeepScreenOn(value: Boolean) = viewModelScope.launch { settingsStore.setKeepScreenOn(value) }
    fun syncNow() = SyncScheduler.runNow(getApplication())

    private companion object {
        const val TICK_MILLIS = 1_000L
    }
}
