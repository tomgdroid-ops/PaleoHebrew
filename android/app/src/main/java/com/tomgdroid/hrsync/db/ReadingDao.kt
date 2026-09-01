package com.tomgdroid.hrsync.db

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface ReadingDao {

    /**
     * Ignores samples already stored, so overlapping re-reads are free. Returns the row ids of
     * the rows actually written (-1 for each row that collided), which the caller counts to
     * report how much genuinely new data a sync found.
     */
    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertAll(rows: List<ReadingEntity>): List<Long>

    @Query("SELECT DISTINCT day FROM reading WHERE uploaded = 0 ORDER BY day")
    suspend fun daysNeedingUpload(): List<String>

    @Query("SELECT * FROM reading WHERE day = :day ORDER BY timeEpochMillis")
    suspend fun readingsForDay(day: String): List<ReadingEntity>

    @Query("UPDATE reading SET uploaded = 1 WHERE day = :day")
    suspend fun markDayUploaded(day: String)

    @Query("SELECT * FROM reading ORDER BY timeEpochMillis DESC LIMIT :limit")
    fun recent(limit: Int): Flow<List<ReadingEntity>>

    @Query("SELECT COUNT(*) FROM reading")
    fun totalCount(): Flow<Int>

    @Query("SELECT COUNT(*) FROM reading WHERE uploaded = 0")
    fun pendingUploadCount(): Flow<Int>

    @Query("SELECT MAX(timeEpochMillis) FROM reading")
    suspend fun newestSampleTime(): Long?

    @Query("DELETE FROM reading")
    suspend fun deleteAll()
}
