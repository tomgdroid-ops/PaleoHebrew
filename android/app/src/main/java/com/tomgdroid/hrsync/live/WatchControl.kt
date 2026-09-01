package com.tomgdroid.hrsync.live

import android.content.Context
import android.util.Log
import com.google.android.gms.wearable.Wearable
import com.tomgdroid.hrsync.shared.LiveHrProtocol
import kotlinx.coroutines.tasks.await

/** Starts and stops measurement on the watch from the phone. */
class WatchControl(private val context: Context) {

    private val messageClient by lazy { Wearable.getMessageClient(context) }
    private val nodeClient by lazy { Wearable.getNodeClient(context) }

    /** Returns true if at least one watch acknowledged the command. */
    suspend fun setMeasuring(active: Boolean): Boolean {
        val payload = byteArrayOf(
            if (active) LiveHrProtocol.CONTROL_START else LiveHrProtocol.CONTROL_STOP
        )
        return try {
            val nodes = nodeClient.connectedNodes.await()
            var delivered = false
            for (node in nodes) {
                runCatching {
                    messageClient.sendMessage(node.id, LiveHrProtocol.PATH_CONTROL, payload).await()
                    delivered = true
                }.onFailure { Log.w(TAG, "control to ${node.displayName} failed: ${it.message}") }
            }
            delivered
        } catch (e: Exception) {
            Log.w(TAG, "no connected watch: ${e.message}")
            false
        }
    }

    suspend fun isWatchConnected(): Boolean =
        runCatching { nodeClient.connectedNodes.await().isNotEmpty() }.getOrDefault(false)

    private companion object {
        const val TAG = "WatchControl"
    }
}
