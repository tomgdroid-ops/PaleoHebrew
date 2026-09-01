package com.tomgdroid.hrsync.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [ReadingEntity::class], version = 1, exportSchema = true)
abstract class HrDatabase : RoomDatabase() {
    abstract fun readingDao(): ReadingDao

    companion object {
        @Volatile
        private var instance: HrDatabase? = null

        fun get(context: Context): HrDatabase = instance ?: synchronized(this) {
            instance ?: Room.databaseBuilder(
                context.applicationContext,
                HrDatabase::class.java,
                "heart-rate.db",
            ).build().also { instance = it }
        }
    }
}
