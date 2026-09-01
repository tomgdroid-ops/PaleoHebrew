package com.tomgdroid.hrsync.live

import com.google.android.gms.wearable.MessageEvent
import com.google.android.gms.wearable.WearableListenerService
import com.tomgdroid.hrsync.shared.LiveHrProtocol

/** Receives the watch's live stream. Started by the system whenever a message arrives. */
class PhoneMessageService : WearableListenerService() {

    override fun onMessageReceived(messageEvent: MessageEvent) {
        when (messageEvent.path) {
            LiveHrProtocol.PATH_SAMPLE ->
                LiveHrProtocol.decodeSample(messageEvent.data)?.let(LiveHrRepository::onSample)

            LiveHrProtocol.PATH_SESSION_STATE ->
                LiveHrRepository.onSessionState(LiveHrProtocol.decodeSessionState(messageEvent.data))
        }
    }
}
