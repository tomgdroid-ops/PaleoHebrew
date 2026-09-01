package com.tomgdroid.hrsync.db

import androidx.room.Entity
import androidx.room.Index
import com.tomgdroid.hrsync.model.HeartRateReading
import com.tomgdroid.hrsync.model.ReadingKind
import com.tomgdroid.hrsync.model.ReadingSource

@Entity(
    tableName = "reading",
    primaryKeys = ["timeEpochMillis", "kind", "source"],
    indices = [Index(value = ["day", "uploaded"]), Index(value = ["timeEpochMillis"])],
)
data class ReadingEntity(
    val timeEpochMillis: Long,
    val kind: String,
    val source: String,
    val value: Double,
    val unit: String,
    val originPackage: String?,
    /** Local calendar day (yyyy-MM-dd); the unit of upload to Drive. */
    val day: String,
    val uploaded: Boolean = false,
) {
    fun toReading(): HeartRateReading? {
        val readingKind = ReadingKind.fromWireName(kind) ?: return null
        val readingSource = ReadingSource.fromWireName(source) ?: return null
        return HeartRateReading(timeEpochMillis, readingKind, value, readingSource, originPackage)
    }
}

fun HeartRateReading.toEntity(): ReadingEntity = ReadingEntity(
    timeEpochMillis = timeEpochMillis,
    kind = kind.wireName,
    source = source.wireName,
    value = value,
    unit = kind.unit,
    originPackage = originPackage,
    day = localDay(),
    uploaded = false,
)
