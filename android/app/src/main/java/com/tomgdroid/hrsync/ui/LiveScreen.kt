package com.tomgdroid.hrsync.ui

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tomgdroid.hrsync.live.HrZone
import com.tomgdroid.hrsync.live.LiveSession
import com.tomgdroid.hrsync.shared.HrAccuracy
import java.util.Locale
import kotlin.math.roundToInt

/**
 * The workout view: one enormous number on a full-bleed zone colour, with everything else
 * sized so it can be ignored. Designed to be read at arm's length, in motion, in sunlight.
 */
@Composable
fun LiveScreen(
    session: LiveSession,
    maxHr: Int,
    targetLow: HrZone?,
    targetHigh: HrZone?,
    watchConnected: Boolean,
    onStartStop: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val bpm = session.lastSample?.bpm?.takeIf { it > 0 }
    val zone = bpm?.let { HrZone.forBpm(it, maxHr) }

    // Grey out rather than keep glowing when the number can no longer be trusted: a stale
    // reading that still looks live is worse than no reading.
    val trustworthy = bpm != null && !session.stale && session.accuracy != HrAccuracy.NO_CONTACT
    val background by animateColorAsState(
        targetValue = if (trustworthy && zone != null) zone.color else Color(0xFF23262B),
        animationSpec = tween(600),
        label = "zoneBackground",
    )
    val contentColor = if (trustworthy && zone != null) zone.onColor else Color(0xFFE6E8EB)

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(background)
            .padding(20.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            StatusLine(session, watchConnected, contentColor)

            Spacer(Modifier.weight(1f))

            BigReadout(bpm, zone, trustworthy, contentColor)

            Spacer(Modifier.height(12.dp))

            if (session.trend.size > 1) {
                TrendChart(
                    points = session.trend,
                    lineColor = contentColor.copy(alpha = 0.9f),
                    targetLowBpm = targetLow?.lowerBpm(maxHr),
                    targetHighBpm = targetHigh?.upperBpm(maxHr),
                    modifier = Modifier.fillMaxWidth().height(84.dp),
                )
            }

            Spacer(Modifier.weight(1f))

            StatsRow(session, contentColor)
            Spacer(Modifier.height(14.dp))
            ZoneBar(session, maxHr, contentColor)
            Spacer(Modifier.height(18.dp))

            Button(
                onClick = onStartStop,
                modifier = Modifier.fillMaxWidth().height(60.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = contentColor.copy(alpha = 0.16f),
                    contentColor = contentColor,
                ),
            ) {
                Text(
                    text = if (session.active) "Stop workout" else "Start workout",
                    fontSize = 19.sp,
                    fontWeight = FontWeight.SemiBold,
                )
            }
        }
    }
}

@Composable
private fun BigReadout(bpm: Double?, zone: HrZone?, trustworthy: Boolean, contentColor: Color) {
    // A gentle pulse keyed to the reading itself, so "is this still updating?" is answerable
    // without reading the digits.
    val pulse by animateFloatAsState(
        targetValue = if (trustworthy) 1f else 0.55f,
        animationSpec = tween(400),
        label = "pulse",
    )
    Text(
        text = bpm?.roundToInt()?.toString() ?: "--",
        fontSize = 150.sp,
        fontWeight = FontWeight.Black,
        color = contentColor.copy(alpha = pulse),
        fontFamily = FontFamily.SansSerif,
        textAlign = TextAlign.Center,
    )
    Text(
        text = if (zone != null && trustworthy) {
            "BPM  ·  ZONE ${zone.number} ${zone.label.uppercase(Locale.US)}"
        } else {
            "BPM"
        },
        fontSize = 15.sp,
        fontWeight = FontWeight.Bold,
        color = contentColor.copy(alpha = 0.85f),
    )
    if (zone != null && trustworthy) {
        Text(
            text = zone.purpose,
            fontSize = 13.sp,
            color = contentColor.copy(alpha = 0.7f),
            modifier = Modifier.padding(top = 2.dp),
        )
    }
}

@Composable
private fun StatusLine(session: LiveSession, watchConnected: Boolean, contentColor: Color) {
    val message = when {
        !watchConnected -> "Watch not connected"
        session.accuracy == HrAccuracy.NO_CONTACT -> "No skin contact — tighten the strap"
        session.stale -> "Signal lost — showing last reading"
        !session.active -> "Ready"
        session.accuracy == HrAccuracy.UNKNOWN -> "Acquiring signal…"
        session.accuracy == HrAccuracy.LOW -> "Weak signal — hold still"
        else -> "Live"
    }
    Text(
        text = message.uppercase(Locale.US),
        fontSize = 12.sp,
        fontWeight = FontWeight.Bold,
        color = contentColor.copy(alpha = 0.8f),
        textAlign = TextAlign.Center,
        modifier = Modifier.fillMaxWidth(),
    )
}

@Composable
private fun StatsRow(session: LiveSession, contentColor: Color) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly,
    ) {
        Stat("TIME", formatElapsed(session.elapsedMillis), contentColor)
        Stat("AVG", session.averageBpm?.roundToInt()?.toString() ?: "--", contentColor)
        Stat("MAX", session.maxBpm?.roundToInt()?.toString() ?: "--", contentColor)
        Stat("MIN", session.minBpm?.roundToInt()?.toString() ?: "--", contentColor)
    }
}

@Composable
private fun Stat(label: String, value: String, contentColor: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(value, fontSize = 26.sp, fontWeight = FontWeight.Bold, color = contentColor)
        Text(label, fontSize = 11.sp, color = contentColor.copy(alpha = 0.7f))
    }
}

/** Proportional time-in-zone bar; the shape of the workout in one glance. */
@Composable
private fun ZoneBar(session: LiveSession, maxHr: Int, contentColor: Color) {
    val total = session.millisInZone.values.sum()
    if (total <= 0L) return
    Column(Modifier.fillMaxWidth()) {
        Text(
            "TIME IN ZONE",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = contentColor.copy(alpha = 0.7f),
            modifier = Modifier.padding(bottom = 4.dp),
        )
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(16.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(contentColor.copy(alpha = 0.15f))
        ) {
            HrZone.entries.forEach { zone ->
                val millis = session.millisInZone[zone.number] ?: 0L
                if (millis <= 0L) return@forEach
                Box(
                    Modifier
                        .weight(millis.toFloat() / total)
                        .fillMaxHeight()
                        .background(zone.color)
                )
            }
        }
    }
}

private fun formatElapsed(millis: Long?): String {
    if (millis == null || millis < 0) return "--"
    val totalSeconds = millis / 1000
    val hours = totalSeconds / 3600
    val minutes = (totalSeconds % 3600) / 60
    val seconds = totalSeconds % 60
    return if (hours > 0) {
        String.format(Locale.US, "%d:%02d:%02d", hours, minutes, seconds)
    } else {
        String.format(Locale.US, "%d:%02d", minutes, seconds)
    }
}
