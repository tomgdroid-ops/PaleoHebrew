package com.tomgdroid.hrsync.sync

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.tomgdroid.hrsync.db.HrDatabase
import com.tomgdroid.hrsync.db.toEntity
import com.tomgdroid.hrsync.drive.DriveAuth
import com.tomgdroid.hrsync.drive.DriveAuthResult
import com.tomgdroid.hrsync.drive.DriveClient
import com.tomgdroid.hrsync.health.HealthConnectAvailability
import com.tomgdroid.hrsync.health.HealthConnectSource
import com.tomgdroid.hrsync.settings.SettingsStore
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.withContext
import java.time.Instant
import java.time.temporal.ChronoUnit

/**
 * Pulls anything new out of Health Connect, then pushes everything unsent to Drive.
 *
 * The two halves are independent on purpose: a Drive outage must not cost us the Health
 * Connect changes token, and a revoked Health Connect permission must not strand readings
 * that are already sitting in the database waiting to be uploaded.
 */
class SyncWorker(
    context: Context,
    params: WorkerParameters,
) : CoroutineWorker(context, params) {

    private val settingsStore = SettingsStore(applicationContext)
    private val dao = HrDatabase.get(applicationContext).readingDao()

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        val settings = settingsStore.settings.first()
        val notes = mutableListOf<String>()

        val imported = runCatching { importFromHealthConnect(settings.backfillDays) }
            .onFailure { Log.w(TAG, "Health Connect import failed", it) }
            .getOrElse { -1 }
        notes += when (imported) {
            -1 -> "Health Connect read failed"
            0 -> "no new readings"
            else -> "$imported new readings"
        }

        var retryable = false
        if (settings.driveUploadEnabled) {
            when (val upload = uploadPending()) {
                is UploadOutcome.Uploaded -> notes += "uploaded ${upload.days} day(s)"
                is UploadOutcome.NothingToDo -> Unit
                is UploadOutcome.NeedsConsent -> notes += "Drive needs sign-in — open the app"
                is UploadOutcome.Failed -> {
                    notes += "Drive upload failed: ${upload.message}"
                    retryable = true
                }
            }
        }

        settingsStore.recordSync(System.currentTimeMillis(), notes.joinToString(" · "))
        // Retry only transient upload trouble; a failed read is retried on the next tick
        // anyway and does not warrant burning WorkManager's backoff budget.
        if (retryable) Result.retry() else Result.success()
    }

    /** Returns the number of genuinely new readings written. */
    private suspend fun importFromHealthConnect(backfillDays: Int): Int {
        val source = HealthConnectSource(applicationContext)
        if (source.availability() != HealthConnectAvailability.AVAILABLE) return 0
        if (!source.hasReadPermissions()) return 0

        val settings = settingsStore.settings.first()
        val storedToken = settings.healthConnectChangesToken

        val readings = if (storedToken == null) {
            // First run: take the token before reading, so a sample written during the
            // backfill is caught by the next incremental pull instead of falling in a gap.
            val freshToken = source.changesToken()
            val end = Instant.now()
            val start = end.minus(backfillDays.toLong(), ChronoUnit.DAYS)
            val backfilled = source.readWindow(start, end)
            settingsStore.setChangesToken(freshToken)
            backfilled
        } else {
            val pull = source.pullChanges(storedToken)
            if (pull.tokenExpired) {
                // Token aged out (Health Connect expires them after 30 days). Drop it and let
                // the next run do a clean backfill.
                settingsStore.setChangesToken(null)
                emptyList()
            } else {
                pull.nextToken?.let { settingsStore.setChangesToken(it) }
                pull.readings
            }
        }

        if (readings.isEmpty()) return 0
        val inserted = dao.insertAll(readings.map { it.toEntity() })
        return inserted.count { it != -1L }
    }

    private sealed interface UploadOutcome {
        data class Uploaded(val days: Int) : UploadOutcome
        data object NothingToDo : UploadOutcome
        data object NeedsConsent : UploadOutcome
        data class Failed(val message: String) : UploadOutcome
    }

    private suspend fun uploadPending(): UploadOutcome {
        val days = dao.daysNeedingUpload()
        if (days.isEmpty()) return UploadOutcome.NothingToDo

        val token = when (val auth = DriveAuth(applicationContext).authorize()) {
            is DriveAuthResult.Authorized -> auth.accessToken
            is DriveAuthResult.NeedsConsent -> return UploadOutcome.NeedsConsent
            is DriveAuthResult.Failed -> return UploadOutcome.Failed(auth.message)
        }

        return try {
            val drive = DriveClient(token)
            val folderId = drive.ensureFolder()
            for (day in days) {
                // Send the whole day, not just the unsent rows, so the file in Drive is always
                // the complete day rather than whichever fragment happened to sync last.
                drive.writeDay(folderId, day, dao.readingsForDay(day))
                dao.markDayUploaded(day)
            }
            UploadOutcome.Uploaded(days.size)
        } catch (e: Exception) {
            Log.w(TAG, "Drive upload failed", e)
            UploadOutcome.Failed(e.message ?: "unknown error")
        }
    }

    private companion object {
        const val TAG = "SyncWorker"
    }
}
