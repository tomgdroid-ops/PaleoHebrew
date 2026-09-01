package com.tomgdroid.hrsync.live

import com.tomgdroid.hrsync.shared.HrAccuracy
import com.tomgdroid.hrsync.shared.LiveHrSample

/** One point on the live trend chart. */
data class TrendPoint(val timeEpochMillis: Long, val bpm: Double)

/**
 * Everything the live screen renders, recomputed as samples arrive.
 *
 * Statistics are folded in incrementally instead of being derived from [trend] on each frame:
 * [trend] is deliberately a bounded window, so the running average and maximum would silently
 * start drifting once a workout outgrew it.
 */
data class LiveSession(
    val active: Boolean = false,
    val startedAtEpochMillis: Long? = null,
    val lastSample: LiveHrSample? = null,
    val accuracy: HrAccuracy = HrAccuracy.UNKNOWN,
    val sampleCount: Int = 0,
    val sumBpm: Double = 0.0,
    val maxBpm: Double? = null,
    val minBpm: Double? = null,
    /** Milliseconds spent in each zone, keyed by zone number. */
    val millisInZone: Map<Int, Long> = emptyMap(),
    /** Bounded recent history for the chart, oldest first. */
    val trend: List<TrendPoint> = emptyList(),
    /** True when the watch has gone quiet and the displayed number is no longer live. */
    val stale: Boolean = false,
) {
    val averageBpm: Double? get() = if (sampleCount > 0) sumBpm / sampleCount else null

    val elapsedMillis: Long?
        get() = startedAtEpochMillis?.let { (lastSample?.timeEpochMillis ?: System.currentTimeMillis()) - it }

    fun accept(sample: LiveHrSample, maxHr: Int): LiveSession {
        // A zero or negative reading means "no value yet", not a real measurement.
        if (sample.bpm <= 0) return copy(lastSample = sample, accuracy = sample.accuracy, stale = false)

        val previous = lastSample
        val zone = HrZone.forBpm(sample.bpm, maxHr)
        val delta = previous
            ?.let { (sample.timeEpochMillis - it.timeEpochMillis).coerceIn(0, MAX_ZONE_STEP_MILLIS) }
            ?: 0L
        val zoneTotals = millisInZone.toMutableMap().apply {
            if (delta > 0) this[zone.number] = (this[zone.number] ?: 0L) + delta
        }

        val newTrend = (trend + TrendPoint(sample.timeEpochMillis, sample.bpm))
            .takeLast(TREND_CAPACITY)

        return copy(
            active = true,
            startedAtEpochMillis = startedAtEpochMillis ?: sample.timeEpochMillis,
            lastSample = sample,
            accuracy = sample.accuracy,
            sampleCount = sampleCount + 1,
            sumBpm = sumBpm + sample.bpm,
            maxBpm = maxOf(maxBpm ?: sample.bpm, sample.bpm),
            minBpm = minOf(minBpm ?: sample.bpm, sample.bpm),
            millisInZone = zoneTotals,
            trend = newTrend,
            stale = false,
        )
    }

    companion object {
        /** ~10 minutes of once-a-second samples. */
        const val TREND_CAPACITY = 600

        /**
         * Caps the time credited to a zone from a single gap, so a dropped Bluetooth link does
         * not book ten silent minutes into whichever zone happened to be showing.
         */
        private const val MAX_ZONE_STEP_MILLIS = 5_000L

        /** After this long without a sample the reading is shown as stale. */
        const val STALE_AFTER_MILLIS = 8_000L
    }
}
