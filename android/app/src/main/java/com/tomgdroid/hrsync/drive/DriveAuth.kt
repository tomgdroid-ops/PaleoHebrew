package com.tomgdroid.hrsync.drive

import android.app.PendingIntent
import android.content.Context
import com.google.android.gms.auth.api.identity.AuthorizationRequest
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.common.api.Scope
import kotlinx.coroutines.tasks.await

/** Either a usable token, or the consent screen the user still has to pass through. */
sealed interface DriveAuthResult {
    data class Authorized(val accessToken: String) : DriveAuthResult
    data class NeedsConsent(val pendingIntent: PendingIntent) : DriveAuthResult
    data class Failed(val message: String) : DriveAuthResult
}

/**
 * Obtains OAuth access tokens for Drive.
 *
 * Uses the `drive.file` scope, which grants access only to files this app itself creates.
 * That is the whole requirement here and avoids asking the user to hand over their entire
 * Drive; the files it writes are still ordinary, fully visible files in their account.
 */
class DriveAuth(private val context: Context) {

    suspend fun authorize(): DriveAuthResult = try {
        val request = AuthorizationRequest.builder()
            .setRequestedScopes(listOf(Scope(DRIVE_FILE_SCOPE)))
            .build()
        val result = Identity.getAuthorizationClient(context).authorize(request).await()
        val pendingIntent = result.pendingIntent
        when {
            // Consent already given: this path returns a fresh token with no UI, which is
            // what lets the background sync run unattended.
            result.accessToken != null -> DriveAuthResult.Authorized(result.accessToken!!)
            pendingIntent != null -> DriveAuthResult.NeedsConsent(pendingIntent)
            else -> DriveAuthResult.Failed("Google returned neither a token nor a consent prompt")
        }
    } catch (e: Exception) {
        DriveAuthResult.Failed(e.message ?: "Authorization failed")
    }

    private companion object {
        const val DRIVE_FILE_SCOPE = "https://www.googleapis.com/auth/drive.file"
    }
}
