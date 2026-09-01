package com.tomgdroid.hrsync.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.tomgdroid.hrsync.db.ReadingEntity
import com.tomgdroid.hrsync.live.HrZone
import com.tomgdroid.hrsync.settings.Settings
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale
import kotlin.math.roundToInt

private val TIME_FORMAT: DateTimeFormatter =
    DateTimeFormatter.ofPattern("MMM d  HH:mm:ss").withZone(ZoneId.systemDefault())

/** Settings plus a window onto the archive that gets uploaded to Drive. */
@Composable
fun DataScreen(
    viewModel: LiveViewModel,
    settings: Settings,
    modifier: Modifier = Modifier,
) {
    val readings by viewModel.recentReadings.collectAsStateWithLifecycle(initialValue = emptyList())
    val stored by viewModel.storedCount.collectAsStateWithLifecycle(initialValue = 0)
    val pending by viewModel.pendingUploadCount.collectAsStateWithLifecycle(initialValue = 0)

    LazyColumn(
        modifier = modifier.fillMaxSize().padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Card(Modifier.fillMaxWidth().padding(top = 12.dp)) {
                Column(Modifier.padding(16.dp)) {
                    Text("Archive", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text("$stored readings stored · $pending awaiting upload")
                    Text(settings.lastSyncMessage, fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Button(onClick = { viewModel.syncNow() }, modifier = Modifier.padding(top = 8.dp)) {
                        Text("Sync now")
                    }
                }
            }
        }

        item {
            Card(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Text("Maximum heart rate", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text(
                        "${settings.maxHr} bpm — every zone below is a percentage of this",
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Slider(
                        value = settings.maxHr.toFloat(),
                        onValueChange = { viewModel.setMaxHr(it.roundToInt()) },
                        valueRange = 120f..220f,
                    )
                    HrZone.entries.forEach { zone ->
                        Row(
                            Modifier.fillMaxWidth().padding(vertical = 2.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                        ) {
                            Text("Z${zone.number} ${zone.label}", fontSize = 13.sp)
                            Text(
                                "${zone.lowerBpm(settings.maxHr)}–${zone.upperBpm(settings.maxHr)}",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium,
                            )
                        }
                    }
                }
            }
        }

        item {
            Card(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Text("Target zone", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text(
                        "Alerts when you leave Z${settings.targetZoneLow}–Z${settings.targetZoneHigh}",
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Slider(
                        value = settings.targetZoneLow.toFloat(),
                        onValueChange = {
                            viewModel.setTargetZones(it.roundToInt(), settings.targetZoneHigh)
                        },
                        valueRange = 1f..5f,
                        steps = 3,
                    )
                    Slider(
                        value = settings.targetZoneHigh.toFloat(),
                        onValueChange = {
                            viewModel.setTargetZones(settings.targetZoneLow, it.roundToInt())
                        },
                        valueRange = 1f..5f,
                        steps = 3,
                    )
                    ToggleRow("Buzz and beep on zone change", settings.alertsEnabled,
                        viewModel::setAlertsEnabled)
                    ToggleRow("Keep screen on during a workout", settings.keepScreenOn,
                        viewModel::setKeepScreenOn)
                }
            }
        }

        item {
            Text("Recent readings", fontWeight = FontWeight.Bold, fontSize = 16.sp,
                modifier = Modifier.padding(top = 4.dp))
        }

        if (readings.isEmpty()) {
            item {
                Text(
                    "Nothing recorded yet. Start a workout, or run a sync to pull history " +
                        "from Health Connect.",
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(bottom = 24.dp),
                )
            }
        } else {
            items(readings, key = { "${it.timeEpochMillis}-${it.kind}-${it.source}" }) { reading ->
                ReadingRow(reading)
                HorizontalDivider()
            }
        }
    }
}

@Composable
private fun ToggleRow(label: String, checked: Boolean, onChange: (Boolean) -> Unit) {
    Row(
        Modifier.fillMaxWidth().padding(top = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(label, fontSize = 14.sp)
        Switch(checked = checked, onCheckedChange = onChange)
    }
}

@Composable
private fun ReadingRow(reading: ReadingEntity) {
    Row(
        Modifier.fillMaxWidth().padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column {
            Text(TIME_FORMAT.format(Instant.ofEpochMilli(reading.timeEpochMillis)), fontSize = 14.sp)
            Text(
                "${reading.kind} · ${reading.source}${if (reading.uploaded) "" else " · pending"}",
                fontSize = 11.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        Text(
            String.format(Locale.US, "%.0f %s", reading.value, reading.unit),
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
        )
    }
}
