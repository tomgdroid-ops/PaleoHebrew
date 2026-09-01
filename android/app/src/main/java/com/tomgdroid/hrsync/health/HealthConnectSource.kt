package com.tomgdroid.hrsync.health

import android.content.Context
import androidx.activity.result.contract.ActivityResultContract
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.changes.UpsertionChange
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.HeartRateVariabilityRmssdRecord
import androidx.health.connect.client.records.Record
import androidx.health.connect.client.records.RestingHeartRateRecord
import androidx.health.connect.client.request.ChangesTokenRequest
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import com.tomgdroid.hrsync.model.HeartRateReading
import com.tomgdroid.hrsync.model.ReadingKind
import com.tomgdroid.hrsync.model.ReadingSource
import java.time.Instant

/** Whether Health Connect can be used on this device at all. */
enum class HealthConnectAvailability { AVAILABLE, UPDATE_REQUIRED, NOT_INSTALLED }

/** Outcome of an incremental pull. */
data class ChangePull(
    val readings: List<HeartRateReading>,
    val nextToken: String?,
    /** True when the stored token had expired and the caller should fall back to a backfill. */
    val tokenExpired: Boolean,
)

/**
 * Reads heart rate out of Android's Health Connect store, which is where Samsung Health
 * deposits its data once the user turns the integration on in
 * Samsung Health > Settings > Health Connect.
 */
class HealthConnectSource(private val context: Context) {

    private val client: HealthConnectClient? by lazy {
        if (availability() == HealthConnectAvailability.AVAILABLE) {
            HealthConnectClient.getOrCreate(context)
        } else {
            null
        }
    }

    fun availability(): HealthConnectAvailability =
        when (HealthConnectClient.getSdkStatus(context)) {
            HealthConnectClient.SDK_AVAILABLE -> HealthConnectAvailability.AVAILABLE
            HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED ->
                HealthConnectAvailability.UPDATE_REQUIRED
            else -> HealthConnectAvailability.NOT_INSTALLED
        }

    suspend fun grantedPermissions(): Set<String> =
        client?.permissionController?.getGrantedPermissions() ?: emptySet()

    /** Read access to the heart rate types; background read is tracked separately. */
    suspend fun hasReadPermissions(): Boolean = grantedPermissions().containsAll(READ_PERMISSIONS)

    /** Without this the WorkManager job can only read while the app is on screen. */
    suspend fun hasBackgroundPermission(): Boolean =
        grantedPermissions().contains(BACKGROUND_PERMISSION)

    fun permissionRequestContract(): ActivityResultContract<Set<String>, Set<String>> =
        PermissionController.createRequestPermissionResultContract()

    /**
     * Obtains a change token marking "now" in the Health Connect log. Take this *before* a
     * backfill, never after: a sample written between the two calls would otherwise fall in
     * the gap and never be seen again.
     */
    suspend fun changesToken(): String? = client?.getChangesToken(
        ChangesTokenRequest(recordTypes = setOf(
            HeartRateRecord::class,
            RestingHeartRateRecord::class,
            HeartRateVariabilityRmssdRecord::class,
        ))
    )

    /** Reads every heart rate sample in a window, following pagination to the end. */
    suspend fun readWindow(start: Instant, end: Instant): List<HeartRateReading> {
        val hc = client ?: return emptyList()
        return readAllPages<HeartRateRecord>(hc, start, end) +
            readAllPages<RestingHeartRateRecord>(hc, start, end) +
            readAllPages<HeartRateVariabilityRmssdRecord>(hc, start, end)
    }

    private suspend inline fun <reified T : Record> readAllPages(
        hc: HealthConnectClient,
        start: Instant,
        end: Instant,
    ): List<HeartRateReading> {
        val out = mutableListOf<HeartRateReading>()
        var pageToken: String? = null
        do {
            val response = hc.readRecords(
                ReadRecordsRequest(
                    recordType = T::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end),
                    pageSize = PAGE_SIZE,
                    pageToken = pageToken,
                )
            )
            response.records.forEach { out += toReadings(it) }
            pageToken = response.pageToken
        } while (pageToken != null)
        return out
    }

    /** Pulls only what changed since [token]. */
    suspend fun pullChanges(token: String): ChangePull {
        val hc = client ?: return ChangePull(emptyList(), null, tokenExpired = false)
        val readings = mutableListOf<HeartRateReading>()
        var cursor = token
        while (true) {
            val response = hc.getChanges(cursor)
            if (response.changesTokenExpired) {
                return ChangePull(emptyList(), null, tokenExpired = true)
            }
            response.changes.forEach { change ->
                // Deletions are ignored on purpose: this app is an append-only archive of what
                // the watch measured, so a sample removed upstream stays in the record here.
                if (change is UpsertionChange) readings += toReadings(change.record)
            }
            cursor = response.nextChangesToken
            if (!response.hasMore) break
        }
        return ChangePull(readings, cursor, tokenExpired = false)
    }

    companion object {
        private const val PAGE_SIZE = 1000

        val READ_PERMISSIONS: Set<String> = setOf(
            HealthPermission.getReadPermission(HeartRateRecord::class),
            HealthPermission.getReadPermission(RestingHeartRateRecord::class),
            HealthPermission.getReadPermission(HeartRateVariabilityRmssdRecord::class),
        )

        const val BACKGROUND_PERMISSION: String =
            HealthPermission.PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND

        val ALL_PERMISSIONS: Set<String> = READ_PERMISSIONS + BACKGROUND_PERMISSION

        /** Flattens a Health Connect record into zero or more normalised samples. */
        fun toReadings(record: Record): List<HeartRateReading> {
            val origin = record.metadata.dataOrigin.packageName
            return when (record) {
                is HeartRateRecord -> record.samples.map { sample ->
                    HeartRateReading(
                        timeEpochMillis = sample.time.toEpochMilli(),
                        kind = ReadingKind.INSTANT,
                        value = sample.beatsPerMinute.toDouble(),
                        source = ReadingSource.HEALTH_CONNECT,
                        originPackage = origin,
                    )
                }

                is RestingHeartRateRecord -> listOf(
                    HeartRateReading(
                        timeEpochMillis = record.time.toEpochMilli(),
                        kind = ReadingKind.RESTING,
                        value = record.beatsPerMinute.toDouble(),
                        source = ReadingSource.HEALTH_CONNECT,
                        originPackage = origin,
                    )
                )

                is HeartRateVariabilityRmssdRecord -> listOf(
                    HeartRateReading(
                        timeEpochMillis = record.time.toEpochMilli(),
                        kind = ReadingKind.HRV_RMSSD,
                        value = record.heartRateVariabilityMillis,
                        source = ReadingSource.HEALTH_CONNECT,
                        originPackage = origin,
                    )
                )

                else -> emptyList()
            }
        }
    }
}
