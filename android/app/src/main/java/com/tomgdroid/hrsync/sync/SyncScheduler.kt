package com.tomgdroid.hrsync.sync

import android.content.Context
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

object SyncScheduler {

    private const val PERIODIC_WORK = "hr-sync-periodic"
    private const val ONE_SHOT_WORK = "hr-sync-now"

    /** WorkManager's floor; anything shorter is silently rounded up to this anyway. */
    const val MIN_INTERVAL_MINUTES = 15L

    fun ensureScheduled(context: Context, intervalMinutes: Long = 60L) {
        val request = PeriodicWorkRequestBuilder<SyncWorker>(
            intervalMinutes.coerceAtLeast(MIN_INTERVAL_MINUTES), TimeUnit.MINUTES
        ).setConstraints(networkConstraints()).build()

        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            PERIODIC_WORK,
            // KEEP so an app restart does not reset the interval clock and delay the next run.
            ExistingPeriodicWorkPolicy.KEEP,
            request,
        )
    }

    /** Reschedules immediately, used when the user changes the interval. */
    fun reschedule(context: Context, intervalMinutes: Long) {
        val request = PeriodicWorkRequestBuilder<SyncWorker>(
            intervalMinutes.coerceAtLeast(MIN_INTERVAL_MINUTES), TimeUnit.MINUTES
        ).setConstraints(networkConstraints()).build()

        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            PERIODIC_WORK, ExistingPeriodicWorkPolicy.UPDATE, request,
        )
    }

    fun runNow(context: Context) {
        val request = OneTimeWorkRequestBuilder<SyncWorker>()
            .setConstraints(networkConstraints())
            .build()
        WorkManager.getInstance(context)
            .enqueueUniqueWork(ONE_SHOT_WORK, ExistingWorkPolicy.REPLACE, request)
    }

    private fun networkConstraints() = Constraints.Builder()
        .setRequiredNetworkType(NetworkType.CONNECTED)
        .build()
}
