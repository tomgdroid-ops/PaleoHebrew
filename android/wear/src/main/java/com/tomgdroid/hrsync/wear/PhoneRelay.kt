package com.tomgdroid.hrsync.wear

import android.content.Context
import android.util.Log
import com.google.android.gms.wearable.Wearable
import com.tomgdroid.hrsync.shared.LiveHrProtocol
import com.tomgdroid.hrsync.shared.LiveHrSample
import kotlinx.coroutines.tasks.await

/**
 * Pushes samples to whatever phone is currently paired.
 *
 * Sends go to every connected node rather than a single resolved one: a watch has at most a
 * handful of peers, and broadcasting avoids a class of bug where a stale cached node id
 * silently swallows the stream after a re-pair.
 */
class PhoneRelay(private val context: Context) {

    private val messageClient by lazy { Wearable.getMessageClient(context) }
    private val nodeClient by lazy { Wearable.getNodeClient(context) }

    suspend fun sendSample(sample: LiveHrSample) {
        broadcast(LiveHrProtocol.PATH_SAMPLE, LiveHrProtocol.encodeSample(sample))
    }

    suspend fun sendSessionState(active: Boolean) {
        broadcast(LiveHrProtocol.PATH_SESSION_STATE, LiveHrProtocol.encodeSessionState(active))
    }

    private suspend fun broadcast(path: String, payload: ByteArray) {
        try {
            val nodes = nodeClient.connectedNodes.await()
            for (node in nodes) {
                // Failing to reach one peer must not stop the others.
                runCatching { messageClient.sendMessage(node.id, path, payload).await() }
                    .onFailure { Log.w(TAG, "send to ${node.displayName} failed: ${it.message}") }
            }
        } catch (e: Exception) {
            Log.w(TAG, "no reachable nodes: ${e.message}")
        }
    }

    private companion object {
        const val TAG = "PhoneRelay"
    }
}
