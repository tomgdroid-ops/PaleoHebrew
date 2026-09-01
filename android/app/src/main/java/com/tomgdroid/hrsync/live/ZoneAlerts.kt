package com.tomgdroid.hrsync.live

import android.content.Context
import android.media.AudioAttributes
import android.media.ToneGenerator
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager

/**
 * Tells the user they have drifted out of the target zone without them having to look.
 *
 * Alerts fire on transitions only, and no more than once every [MIN_INTERVAL_MILLIS]: heart
 * rate hovers right on a zone boundary for minutes at a time, and an alert on every sample
 * would be unbearable.
 */
class ZoneAlerts(context: Context) {

    private val appContext = context.applicationContext

    private val vibrator: Vibrator? by lazy {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            (appContext.getSystemService(VibratorManager::class.java))?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            appContext.getSystemService(Vibrator::class.java)
        }
    }

    private var lastAlertAtMillis = 0L
    private var lastDirection: Direction = Direction.INSIDE

    private enum class Direction { BELOW, INSIDE, ABOVE }

    fun evaluate(bpm: Double?, maxHr: Int, low: HrZone?, high: HrZone?, soundEnabled: Boolean) {
        if (bpm == null || low == null || high == null) return
        val direction = when {
            bpm < low.lowerBpm(maxHr) -> Direction.BELOW
            bpm > high.upperBpm(maxHr) -> Direction.ABOVE
            else -> Direction.INSIDE
        }
        if (direction == lastDirection) return
        val previous = lastDirection
        lastDirection = direction
        // Entering the zone is good news and gets one short buzz; leaving it gets the pattern.
        if (previous == Direction.INSIDE || direction == Direction.INSIDE) {
            fire(entering = direction == Direction.INSIDE, soundEnabled = soundEnabled)
        }
    }

    fun reset() {
        lastDirection = Direction.INSIDE
        lastAlertAtMillis = 0L
    }

    private fun fire(entering: Boolean, soundEnabled: Boolean) {
        val now = System.currentTimeMillis()
        if (now - lastAlertAtMillis < MIN_INTERVAL_MILLIS) return
        lastAlertAtMillis = now

        val pattern = if (entering) longArrayOf(0, 120) else longArrayOf(0, 250, 120, 250)
        vibrator?.let { v ->
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                v.vibrate(VibrationEffect.createWaveform(pattern, -1))
            } else {
                @Suppress("DEPRECATION")
                v.vibrate(pattern, -1)
            }
        }

        if (!soundEnabled) return
        // A fresh generator per alert: holding one open for a whole workout keeps the audio
        // path active and needlessly ducks the user's music.
        runCatching {
            ToneGenerator(AudioAttributes.CONTENT_TYPE_SONIFICATION, TONE_VOLUME).use { tone ->
                tone.startTone(
                    if (entering) ToneGenerator.TONE_PROP_ACK else ToneGenerator.TONE_PROP_NACK,
                    if (entering) 150 else 400,
                )
                Thread.sleep(if (entering) 200L else 450L)
            }
        }
    }

    private inline fun <T : ToneGenerator, R> T.use(block: (T) -> R): R =
        try { block(this) } finally { release() }

    private companion object {
        const val MIN_INTERVAL_MILLIS = 8_000L
        const val TONE_VOLUME = 80
    }
}
