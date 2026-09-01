package com.tomgdroid.hrsync

import android.Manifest
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalView
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.tomgdroid.hrsync.live.HrZone
import com.tomgdroid.hrsync.ui.DataScreen
import com.tomgdroid.hrsync.ui.HrSyncTheme
import com.tomgdroid.hrsync.ui.LiveScreen
import com.tomgdroid.hrsync.ui.LiveViewModel

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent { HrSyncTheme { AppRoot() } }
    }
}

private enum class Tab(val label: String) { LIVE("Live"), DATA("Data") }

@Composable
private fun AppRoot(viewModel: LiveViewModel = viewModel()) {
    val session by viewModel.session.collectAsStateWithLifecycle()
    val settings by viewModel.settings.collectAsStateWithLifecycle()
    val watchConnected by viewModel.watchConnected.collectAsStateWithLifecycle()
    var tab by remember { mutableStateOf(Tab.LIVE) }

    // Notifications carry the watch's ongoing-measurement state; ask once, non-blocking.
    val notificationPermission = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { }
    LaunchedEffect(Unit) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            notificationPermission.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
    }

    // Holding the screen awake is the whole point during a workout, but only while one is
    // running -- otherwise the app would sit burning the display in the user's pocket.
    val view = LocalView.current
    val keepAwake = settings.keepScreenOn && session.active
    LaunchedEffect(keepAwake) { view.keepScreenOn = keepAwake }

    Scaffold(
        bottomBar = {
            NavigationBar {
                Tab.entries.forEach { entry ->
                    NavigationBarItem(
                        selected = tab == entry,
                        onClick = { tab = entry },
                        icon = {},
                        label = { Text(entry.label) },
                    )
                }
            }
        }
    ) { padding ->
        when (tab) {
            Tab.LIVE -> LiveScreen(
                session = session,
                maxHr = settings.maxHr,
                targetLow = HrZone.entries.firstOrNull { it.number == settings.targetZoneLow },
                targetHigh = HrZone.entries.firstOrNull { it.number == settings.targetZoneHigh },
                watchConnected = watchConnected,
                onStartStop = viewModel::toggleWorkout,
                modifier = Modifier.padding(padding),
            )

            Tab.DATA -> DataScreen(
                viewModel = viewModel,
                settings = settings,
                modifier = Modifier.padding(padding),
            )
        }
    }
}
