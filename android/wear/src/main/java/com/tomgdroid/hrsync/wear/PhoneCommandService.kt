package com.tomgdroid.hrsync.wear

import com.google.android.gms.wearable.MessageEvent
import com.google.android.gms.wearable.WearableListenerService
import com.tomgdroid.hrsync.shared.LiveHrProtocol

/** Lets the phone start and stop measurement without the user touching the watch. */
class PhoneCommandService : WearableListenerService() {

    override fun onMessageReceived(messageEvent: MessageEvent) {
        if (messageEvent.path != LiveHrProtocol.PATH_CONTROL) return
        val start = messageEvent.data.firstOrNull() == LiveHrProtocol.CONTROL_START
        if (start) HeartRateService.start(this) else HeartRateService.stop(this)
    }
}
