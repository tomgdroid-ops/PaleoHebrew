package com.tomgdroid.hrsync.drive

import android.util.Log
import com.tomgdroid.hrsync.db.ReadingEntity
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException
import java.net.URLEncoder
import java.util.concurrent.TimeUnit

/**
 * A minimal Drive v3 client over the REST API.
 *
 * Deliberately not the official Drive Java client: that library pulls a large, largely
 * desktop-oriented dependency tree into the APK for what amounts to three HTTP calls.
 */
class DriveClient(private val accessToken: String) {

    private val http = OkHttpClient.Builder()
        .callTimeout(60, TimeUnit.SECONDS)
        .build()

    /** Finds the sync folder, creating it on first use. Returns its file id. */
    fun ensureFolder(name: String = FOLDER_NAME): String {
        val query = "name = '$name' and mimeType = '$FOLDER_MIME' and trashed = false"
        find(query)?.let { return it }

        val metadata = JSONObject()
            .put("name", name)
            .put("mimeType", FOLDER_MIME)
            .toString()
        val request = Request.Builder()
            .url("$API/files?fields=id")
            .addHeader("Authorization", "Bearer $accessToken")
            .post(metadata.toRequestBody(JSON))
            .build()
        return http.newCall(request).execute().use { response ->
            val body = response.body?.string().orEmpty()
            if (!response.isSuccessful) throw IOException("Create folder failed: ${response.code} $body")
            JSONObject(body).getString("id")
        }
    }

    /**
     * Writes one day's readings, replacing the file if it already exists.
     *
     * Rewriting the whole day rather than appending keeps the operation idempotent: a sync
     * that dies halfway leaves the previous complete file in place, and the retry produces
     * exactly the same result as if it had never failed.
     */
    fun writeDay(folderId: String, day: String, readings: List<ReadingEntity>) {
        val fileName = "heart-rate-$day.ndjson"
        val content = readings.joinToString("\n") { it.toNdjson() } + "\n"
        val existing = find("name = '$fileName' and '$folderId' in parents and trashed = false")

        val request = if (existing != null) {
            Request.Builder()
                .url("$UPLOAD/files/$existing?uploadType=media")
                .addHeader("Authorization", "Bearer $accessToken")
                .patch(content.toRequestBody(NDJSON))
                .build()
        } else {
            val metadata = JSONObject()
                .put("name", fileName)
                .put("parents", org.json.JSONArray().put(folderId))
                .toString()
            val multipart = MultipartBody.Builder().setType(RELATED)
                .addPart(metadata.toRequestBody(JSON))
                .addPart(content.toRequestBody(NDJSON))
                .build()
            Request.Builder()
                .url("$UPLOAD/files?uploadType=multipart&fields=id")
                .addHeader("Authorization", "Bearer $accessToken")
                .post(multipart)
                .build()
        }

        http.newCall(request).execute().use { response ->
            if (!response.isSuccessful) {
                throw IOException("Upload of $fileName failed: ${response.code} ${response.body?.string()}")
            }
        }
        Log.i(TAG, "uploaded $fileName (${readings.size} readings)")
    }

    private fun find(query: String): String? {
        val encoded = URLEncoder.encode(query, "UTF-8")
        val request = Request.Builder()
            .url("$API/files?q=$encoded&spaces=drive&fields=files(id)&pageSize=1")
            .addHeader("Authorization", "Bearer $accessToken")
            .get()
            .build()
        return http.newCall(request).execute().use { response ->
            val body = response.body?.string().orEmpty()
            if (!response.isSuccessful) throw IOException("Drive query failed: ${response.code} $body")
            JSONObject(body).optJSONArray("files")
                ?.takeIf { it.length() > 0 }
                ?.getJSONObject(0)
                ?.getString("id")
        }
    }

    private fun ReadingEntity.toNdjson(): String = JSONObject()
        .put("time", java.time.Instant.ofEpochMilli(timeEpochMillis).toString())
        .put("epoch_millis", timeEpochMillis)
        .put("kind", kind)
        .put("value", value)
        .put("unit", unit)
        .put("source", source)
        .put("origin_package", originPackage ?: JSONObject.NULL)
        .toString()

    private companion object {
        const val TAG = "DriveClient"
        const val API = "https://www.googleapis.com/drive/v3"
        const val UPLOAD = "https://www.googleapis.com/upload/drive/v3"
        const val FOLDER_MIME = "application/vnd.google-apps.folder"
        const val FOLDER_NAME = "HeartRateSync"
        val JSON = "application/json; charset=utf-8".toMediaType()
        val NDJSON = "application/x-ndjson; charset=utf-8".toMediaType()
        val RELATED = "multipart/related".toMediaType()
    }
}
