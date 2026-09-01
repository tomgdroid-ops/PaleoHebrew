package com.tomgdroid.hrsync.live

/**
 * The five classic training zones, expressed as a fraction of maximum heart rate.
 *
 * Colour is part of the model rather than the UI because the zone colour is the primary
 * signal during a workout: at arm's length, mid-effort, the wash of colour is readable a
 * second before the digits are.
 */
enum class HrZone(
    val number: Int,
    val label: String,
    val purpose: String,
    val lowerFraction: Double,
    val upperFraction: Double,
) {
    RECOVERY(1, "Recovery", "Warm-up and cool-down", 0.00, 0.60),
    ENDURANCE(2, "Endurance", "Fat burn, conversational", 0.60, 0.70),
    AEROBIC(3, "Aerobic", "Cardio fitness", 0.70, 0.80),
    THRESHOLD(4, "Threshold", "Hard, sustainable for minutes", 0.80, 0.90),
    MAXIMUM(5, "Maximum", "All-out, short bursts", 0.90, 2.00);

    fun lowerBpm(maxHr: Int): Int = Math.round(lowerFraction * maxHr).toInt()

    fun upperBpm(maxHr: Int): Int = if (this == MAXIMUM) maxHr else Math.round(upperFraction * maxHr).toInt()

    companion object {
        /**
         * The zone a reading falls in. Values above max HR stay in zone 5 rather than falling
         * off the end -- exceeding your estimated max is common and must not blank the display.
         */
        fun forBpm(bpm: Double, maxHr: Int): HrZone {
            if (maxHr <= 0) return RECOVERY
            val fraction = bpm / maxHr
            return entries.lastOrNull { fraction >= it.lowerFraction } ?: RECOVERY
        }

        /** The usual age-based estimate; a measured max is better if the user knows theirs. */
        fun estimateMaxHr(age: Int): Int = (220 - age).coerceIn(100, 220)

        const val DEFAULT_MAX_HR = 185
    }
}
