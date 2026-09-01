package com.tomgdroid.hrsync.ui

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import com.tomgdroid.hrsync.live.HrZone

/**
 * Zone colours run cool to hot and are picked for separation at a glance rather than for
 * subtlety: mid-workout the wash of colour is read before the digits are.
 */
val HrZone.color: Color
    get() = when (this) {
        HrZone.RECOVERY -> Color(0xFF3A7BD5)
        HrZone.ENDURANCE -> Color(0xFF1B9E77)
        HrZone.AEROBIC -> Color(0xFFD9A400)
        HrZone.THRESHOLD -> Color(0xFFE2711D)
        HrZone.MAXIMUM -> Color(0xFFCC2936)
    }

/** Text that stays legible on top of [color]. */
val HrZone.onColor: Color
    get() = if (this == HrZone.AEROBIC) Color(0xFF1A1300) else Color.White

@Composable
fun HrSyncTheme(content: @Composable () -> Unit) {
    val dark = isSystemInDarkTheme()
    MaterialTheme(
        colorScheme = if (dark) {
            darkColorScheme(background = Color(0xFF0E1013), surface = Color(0xFF171A1F))
        } else {
            lightColorScheme()
        },
        content = content,
    )
}
