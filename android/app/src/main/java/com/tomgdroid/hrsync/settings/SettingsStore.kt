package com.tomgdroid.hrsync.settings

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.tomgdroid.hrsync.live.HrZone
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "settings")

data class Settings(
    val maxHr: Int = HrZone.DEFAULT_MAX_HR,
    /** Zone numbers the user wants to stay inside; empty means no alerting. */
    val targetZoneLow: Int = 2,
    val targetZoneHigh: Int = 4,
    val alertsEnabled: Boolean = true,
    val keepScreenOn: Boolean = true,
    val syncIntervalMinutes: Int = 60,
    val backfillDays: Int = 30,
    val driveUploadEnabled: Boolean = true,
    val healthConnectChangesToken: String? = null,
    val lastSyncEpochMillis: Long = 0L,
    val lastSyncMessage: String = "Not run yet",
)

class SettingsStore(private val context: Context) {

    val settings: Flow<Settings> = context.dataStore.data.map { prefs ->
        Settings(
            maxHr = prefs[MAX_HR] ?: HrZone.DEFAULT_MAX_HR,
            targetZoneLow = prefs[TARGET_LOW] ?: 2,
            targetZoneHigh = prefs[TARGET_HIGH] ?: 4,
            alertsEnabled = prefs[ALERTS] ?: true,
            keepScreenOn = prefs[KEEP_SCREEN_ON] ?: true,
            syncIntervalMinutes = prefs[SYNC_INTERVAL] ?: 60,
            backfillDays = prefs[BACKFILL_DAYS] ?: 30,
            driveUploadEnabled = prefs[DRIVE_ENABLED] ?: true,
            healthConnectChangesToken = prefs[CHANGES_TOKEN],
            lastSyncEpochMillis = prefs[LAST_SYNC] ?: 0L,
            lastSyncMessage = prefs[LAST_SYNC_MESSAGE] ?: "Not run yet",
        )
    }

    suspend fun setMaxHr(value: Int) = edit { it[MAX_HR] = value.coerceIn(100, 230) }
    suspend fun setTargetZones(low: Int, high: Int) = edit {
        it[TARGET_LOW] = low.coerceIn(1, 5)
        it[TARGET_HIGH] = high.coerceIn(low.coerceIn(1, 5), 5)
    }
    suspend fun setAlertsEnabled(value: Boolean) = edit { it[ALERTS] = value }
    suspend fun setKeepScreenOn(value: Boolean) = edit { it[KEEP_SCREEN_ON] = value }
    suspend fun setSyncIntervalMinutes(value: Int) = edit { it[SYNC_INTERVAL] = value }
    suspend fun setDriveUploadEnabled(value: Boolean) = edit { it[DRIVE_ENABLED] = value }
    suspend fun setChangesToken(token: String?) = edit {
        if (token == null) it.remove(CHANGES_TOKEN) else it[CHANGES_TOKEN] = token
    }
    suspend fun recordSync(epochMillis: Long, message: String) = edit {
        it[LAST_SYNC] = epochMillis
        it[LAST_SYNC_MESSAGE] = message
    }

    private suspend fun edit(block: (androidx.datastore.preferences.core.MutablePreferences) -> Unit) {
        context.dataStore.edit(block)
    }

    private companion object {
        val MAX_HR = intPreferencesKey("max_hr")
        val TARGET_LOW = intPreferencesKey("target_zone_low")
        val TARGET_HIGH = intPreferencesKey("target_zone_high")
        val ALERTS = booleanPreferencesKey("alerts_enabled")
        val KEEP_SCREEN_ON = booleanPreferencesKey("keep_screen_on")
        val SYNC_INTERVAL = intPreferencesKey("sync_interval_minutes")
        val BACKFILL_DAYS = intPreferencesKey("backfill_days")
        val DRIVE_ENABLED = booleanPreferencesKey("drive_enabled")
        val CHANGES_TOKEN = stringPreferencesKey("hc_changes_token")
        val LAST_SYNC = longPreferencesKey("last_sync")
        val LAST_SYNC_MESSAGE = stringPreferencesKey("last_sync_message")
    }
}
