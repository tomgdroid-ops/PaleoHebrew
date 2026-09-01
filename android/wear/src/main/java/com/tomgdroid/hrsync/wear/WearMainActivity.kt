package com.tomgdroid.hrsync.wear

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.wear.compose.material.Button
import androidx.wear.compose.material.MaterialTheme
import androidx.wear.compose.material.Text
import com.tomgdroid.hrsync.shared.HrAccuracy

/**
 * Deliberately minimal: the watch screen is a control surface and a fallback readout, while
 * the phone is where the workout is actually watched.
 */
class WearMainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { MaterialTheme { WearScreen() } }
    }
}

/** The permission that gates the heart rate sensor differs across Wear OS versions. */
private val sensorPermission: String
    get() = if (Build.VERSION.SDK_INT >= 35) {
        "android.permission.health.READ_HEART_RATE"
    } else {
        Manifest.permission.BODY_SENSORS
    }

@Composable
private fun WearScreen() {
    val context = LocalContext.current
    val state by HeartRateService.state.collectAsStateWithLifecycle()
    val sample by HeartRateService.lastSample.collectAsStateWithLifecycle()
    val accuracy by HeartRateService.accuracy.collectAsStateWithLifecycle()

    var hasPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(context, sensorPermission) ==
                PackageManager.PERMISSION_GRANTED
        )
    }
    val requestPermission = androidx.activity.compose.rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        hasPermission = granted
        if (granted) HeartRateService.start(context)
    }

    val measuring = state is HeartRateService.MeasureState.Measuring

    Column(
        modifier = Modifier.fillMaxSize().padding(12.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text(
            text = sample?.bpm?.takeIf { it > 0 }?.toInt()?.toString() ?: "--",
            fontSize = 56.sp,
            fontWeight = FontWeight.Bold,
        )
        Text(text = "BPM", fontSize = 12.sp)

        val status = when {
            state is HeartRateService.MeasureState.Error ->
                (state as HeartRateService.MeasureState.Error).message
            !measuring -> "Stopped"
            accuracy == HrAccuracy.NO_CONTACT -> "Tighten the watch"
            accuracy == HrAccuracy.UNKNOWN -> "Acquiring…"
            else -> "Streaming to phone"
        }
        Text(
            text = status,
            fontSize = 11.sp,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = 6.dp, bottom = 10.dp),
        )

        Button(onClick = {
            when {
                measuring -> HeartRateService.stop(context)
                !hasPermission -> requestPermission.launch(sensorPermission)
                else -> HeartRateService.start(context)
            }
        }) {
            Text(if (measuring) "Stop" else "Start")
        }
    }
}
