package com.tomgdroid.hrsync

import android.app.Application
import com.tomgdroid.hrsync.sync.SyncScheduler

class HrSyncApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Idempotent: re-enqueuing the same unique work keeps one schedule across launches.
        SyncScheduler.ensureScheduled(this)
    }
}
