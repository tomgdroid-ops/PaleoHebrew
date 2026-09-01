package com.tomgdroid.hrsync.shared

import java.nio.ByteBuffer
import java.nio.ByteOrder

/** How confident the watch is in a given sample. Mirrors Health Services' availability. */
enum class HrAccuracy(val code: Byte) {
    /** Sensor is reporting a value it considers reliable. */
    GOOD(0),
    /** Value is being reported but the sensor is unsure -- usually a loose or moving watch. */
    LOW(1),
    /** No contact with skin; the number is stale, not live. */
    NO_CONTACT(2),
    /** Sensor is warming up or the state is not known yet. */
    UNKNOWN(3);

    companion object {
        fun fromCode(code: Byte): HrAccuracy = entries.firstOrNull { it.code == code } ?: UNKNOWN
    }
}

/** A single live heart rate sample as it travels from the watch to the phone. */
data class LiveHrSample(
    val timeEpochMillis: Long,
    val bpm: Double,
    val accuracy: HrAccuracy,
)

/**
 * Wire format for the watch-to-phone link.
 *
 * Samples arrive around once a second, so they are packed into a fixed 17-byte frame rather
 * than JSON: it keeps the Bluetooth link quiet and avoids pulling a serialization library
 * into the watch app, where battery and APK size matter most.
 */
object LiveHrProtocol {

    /** A single live sample, sent via MessageClient for lowest latency. */
    const val PATH_SAMPLE = "/hr/sample"

    /** Watch tells the phone that measurement started or stopped. */
    const val PATH_SESSION_STATE = "/hr/session-state"

    /** Phone asks the watch to start or stop measuring. */
    const val PATH_CONTROL = "/hr/control"

    /** Capability the phone advertises so the watch can find it. */
    const val CAPABILITY_PHONE = "hrsync_phone"

    /** Capability the watch advertises so the phone can find it. */
    const val CAPABILITY_WATCH = "hrsync_watch"

    const val CONTROL_START: Byte = 1
    const val CONTROL_STOP: Byte = 0

    private const val FRAME_VERSION: Byte = 1
    private const val FRAME_BYTES = 1 + 8 + 8 // version + epoch millis + bpm

    fun encodeSample(sample: LiveHrSample): ByteArray =
        ByteBuffer.allocate(FRAME_BYTES + 1).order(ByteOrder.BIG_ENDIAN).apply {
            put(FRAME_VERSION)
            putLong(sample.timeEpochMillis)
            putDouble(sample.bpm)
            put(sample.accuracy.code)
        }.array()

    /** Returns null for a frame this build does not understand, rather than throwing. */
    fun decodeSample(bytes: ByteArray): LiveHrSample? {
        if (bytes.size < FRAME_BYTES + 1) return null
        val buffer = ByteBuffer.wrap(bytes).order(ByteOrder.BIG_ENDIAN)
        if (buffer.get() != FRAME_VERSION) return null
        return LiveHrSample(
            timeEpochMillis = buffer.long,
            bpm = buffer.double,
            accuracy = HrAccuracy.fromCode(buffer.get()),
        )
    }

    fun encodeSessionState(active: Boolean): ByteArray =
        byteArrayOf(if (active) CONTROL_START else CONTROL_STOP)

    fun decodeSessionState(bytes: ByteArray): Boolean =
        bytes.isNotEmpty() && bytes[0] == CONTROL_START
}
