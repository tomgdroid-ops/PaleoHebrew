package com.tomgdroid.hrsync.model

import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

/** What a single stored sample measures. */
enum class ReadingKind(val wireName: String, val unit: String) {
    INSTANT("instant_bpm", "bpm"),
    RESTING("resting_bpm", "bpm"),
    HRV_RMSSD("hrv_rmssd", "ms");

    companion object {
        fun fromWireName(name: String): ReadingKind? = entries.firstOrNull { it.wireName == name }
    }
}

/** Where a sample was read from. */
enum class ReadingSource(val wireName: String) {
    HEALTH_CONNECT("health_connect"),
    SAMSUNG_HEALTH("samsung_health");

    companion object {
        fun fromWireName(name: String): ReadingSource? = entries.firstOrNull { it.wireName == name }
    }
}

/**
 * One heart rate sample, normalised across readers.
 *
 * [timeEpochMillis], [kind] and [source] together form the identity of a sample: the same
 * measurement arriving twice (a re-read of an overlapping window, or the same watch reading
 * surfacing through both Health Connect and the Samsung SDK) collapses onto one row.
 */
data class HeartRateReading(
    val timeEpochMillis: Long,
    val kind: ReadingKind,
    val value: Double,
    val source: ReadingSource,
    /** Package that originally wrote the sample, when the reader exposes it. */
    val originPackage: String? = null,
) {
    val instant: Instant get() = Instant.ofEpochMilli(timeEpochMillis)

    /** Local calendar day, used to group samples into one file per day in Drive. */
    fun localDay(zone: ZoneId = ZoneId.systemDefault()): String =
        DAY_FORMAT.format(instant.atZone(zone))

    companion object {
        private val DAY_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
    }
}
