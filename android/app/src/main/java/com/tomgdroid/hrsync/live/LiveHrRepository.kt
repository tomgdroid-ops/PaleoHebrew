package com.tomgdroid.hrsync.live

import com.tomgdroid.hrsync.model.HeartRateReading
import com.tomgdroid.hrsync.model.ReadingKind
import com.tomgdroid.hrsync.model.ReadingSource
import com.tomgdroid.hrsync.shared.LiveHrSample
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update

/**
 * The single place live samples land, whoever consumes them.
 *
 * A process-wide singleton rather than a scoped object because the producer is a
 * WearableListenerService the system starts on its own schedule: it must be able to deliver a
 * sample whether or not any Activity currently exists.
 */
object LiveHrRepository {

    private val _session = MutableStateFlow(LiveSession())
    val session: StateFlow<LiveSession> = _session

    /** Set by the UI so zone maths uses the user's own maximum. */
    @Volatile
    var maxHr: Int = HrZone.DEFAULT_MAX_HR

    /** Samples recorded this session, drained by the archiver once the session ends. */
    private val recorded = mutableListOf<HeartRateReading>()

    fun onSample(sample: LiveHrSample) {
        _session.update { it.accept(sample, maxHr) }
        if (sample.bpm > 0) {
            synchronized(recorded) {
                recorded += HeartRateReading(
                    timeEpochMillis = sample.timeEpochMillis,
                    kind = ReadingKind.INSTANT,
                    value = sample.bpm,
                    source = ReadingSource.SAMSUNG_HEALTH,
                    originPackage = "wear.measure",
                )
            }
        }
    }

    fun onSessionState(active: Boolean) {
        if (active) {
            _session.value = LiveSession(active = true)
        } else {
            _session.update { it.copy(active = false) }
        }
    }

    /** Marks the reading stale when the watch has gone quiet; called on a UI-driven tick. */
    fun refreshStaleness(nowMillis: Long = System.currentTimeMillis()) {
        _session.update { current ->
            val last = current.lastSample?.timeEpochMillis ?: return@update current
            val stale = nowMillis - last > LiveSession.STALE_AFTER_MILLIS
            if (stale == current.stale) current else current.copy(stale = stale)
        }
    }

    /** Hands over everything recorded so far and clears the buffer. */
    fun drainRecorded(): List<HeartRateReading> = synchronized(recorded) {
        val copy = recorded.toList()
        recorded.clear()
        copy
    }

    fun reset() {
        _session.value = LiveSession()
        synchronized(recorded) { recorded.clear() }
    }
}
