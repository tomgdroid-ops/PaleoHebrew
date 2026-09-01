package com.tomgdroid.hrsync.ui

import androidx.compose.foundation.Canvas
import androidx.compose.ui.Modifier
import androidx.compose.runtime.Composable
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.PathEffect
import com.tomgdroid.hrsync.live.TrendPoint
import kotlin.math.max
import kotlin.math.min

/**
 * A sparkline of the recent session.
 *
 * The y-axis is padded around the observed range rather than pinned to 0..max: a workout
 * spends its whole time in a narrow band, and a zero-based axis would flatten every
 * meaningful change into a straight line.
 */
@Composable
fun TrendChart(
    points: List<TrendPoint>,
    lineColor: Color,
    targetLowBpm: Int?,
    targetHighBpm: Int?,
    modifier: Modifier = Modifier,
) {
    Canvas(modifier = modifier) {
        if (points.size < 2) return@Canvas

        val values = points.map { it.bpm }
        var low = values.min()
        var high = values.max()
        targetLowBpm?.let { low = min(low, it.toDouble()) }
        targetHighBpm?.let { high = max(high, it.toDouble()) }

        val padding = max((high - low) * 0.15, 5.0)
        low -= padding
        high += padding
        val span = (high - low).takeIf { it > 0.0 } ?: 1.0

        fun yFor(bpm: Double): Float =
            (size.height * (1.0 - (bpm - low) / span)).toFloat().coerceIn(0f, size.height)

        val dash = PathEffect.dashPathEffect(floatArrayOf(8f, 8f))
        targetLowBpm?.let {
            drawLine(lineColor.copy(alpha = 0.35f), Offset(0f, yFor(it.toDouble())),
                Offset(size.width, yFor(it.toDouble())), strokeWidth = 2f, pathEffect = dash)
        }
        targetHighBpm?.let {
            drawLine(lineColor.copy(alpha = 0.35f), Offset(0f, yFor(it.toDouble())),
                Offset(size.width, yFor(it.toDouble())), strokeWidth = 2f, pathEffect = dash)
        }

        // Plot against sample index, not timestamp: dropped samples should compress the
        // trace rather than tear a gap across the chart.
        val stepX = size.width / (points.size - 1).toFloat()
        val path = Path().apply {
            points.forEachIndexed { index, point ->
                val x = index * stepX
                val y = yFor(point.bpm)
                if (index == 0) moveTo(x, y) else lineTo(x, y)
            }
        }
        drawPath(path, color = lineColor, style = Stroke(width = 4f))
    }
}
