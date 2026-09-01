# Heart Rate Sync

A two-part Android app that shows your Galaxy Watch heart rate **live** on your phone during
a workout, and archives every reading to Google Drive so it can be read back later.

- `wear/` — a Wear OS app for the watch. Measures heart rate and streams it to the phone.
- `app/` — the phone app. The live workout display, plus the archive and Drive upload.
- `shared/` — the wire format the two speak.

## Why there is a watch app

Health Connect (the obvious route — Samsung Health syncs into it) **cannot** drive a live
display. Samsung batches the watch-to-phone sync, updating roughly every 10 minutes unless
you are actively moving, and only workout and manual heart rate cross over at all; resting
HR and HRV are [known not to sync](https://forum.developer.samsung.com/t/heart-rate-sync-with-google-health-connect/24632).
A phone app polling Health Connect would show you a number from ten minutes ago.

The watch app instead reads the sensor directly through Wear OS **Health Services**
(`MeasureClient`), which delivers roughly one sample per second, and pushes each one to the
phone over the Wearable Data Layer. This uses Google's Wear OS APIs, not Samsung's, so it
needs **no Samsung partner approval** — you only need to be able to install the app on the
watch.

Health Connect is still used, as a background job, to backfill history that predates the app
and to pick up anything measured while the watch app was not running.

## The live screen

Built to be read at arm's length, mid-effort, possibly in sunlight:

- A 150sp heart rate number filling the screen.
- The whole background is the **training zone colour** — readable peripherally, before you
  focus on the digits.
- **Screen stays on** for the duration of a workout, and only then.
- A **trend sparkline** of the last ~10 minutes, auto-scaled to the range you are actually
  working in, with your target zone drawn as dashed guides.
- **Session stats**: elapsed, average, max, min.
- A **time-in-zone** bar showing the shape of the session so far.
- **Haptic and audible alerts** when you drift out of your target zone (debounced, so
  hovering on a boundary does not buzz continuously).
- Honest **staleness handling**: if the watch loses skin contact or the link drops, the
  colour drains and the status line says so, rather than leaving a dead number looking live.

## Building

CI builds both APKs on every push — see the *Android build* workflow, and download the
`phone-apk` and `watch-apk` artifacts from the run.

To build locally you need the Android SDK (Android Studio, or the command line tools):

```bash
cd android
./gradlew :app:assembleDebug :wear:assembleDebug
```

## Installing

The phone and the watch are two different devices with two different menus, and Samsung
names the tap-target differently on each. Read the right section.

### Phone (Galaxy S22)

**No developer mode needed.** Sideloading the phone APK does not require it:

1. Download `phone-apk` from the CI run and unzip it to get `app-debug.apk`.
2. Tap the APK in **My Files**. Android will offer to let the Files app install unknown
   apps — allow it, then confirm the install.

You only need developer mode on the phone if you want to install over USB from a computer.
In that case: **Settings → About phone → Software information → tap "Build number" 7 times**
(it prompts for your PIN partway through), then **Settings → Developer options → USB
debugging**, and:

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Note the phone says **Build number**, under **Software information**. It does *not* say
"Software version" — that is the watch's wording, below.

### Watch (Galaxy Watch 4 or later)

The watch does need developer mode, and there is no way to sideload to it from the phone
alone — you need a computer with `adb` on the same Wi-Fi network.

1. On the **watch**: **Settings → About watch → Software information → tap "Software
   version" repeatedly** until it says *Developer mode turned on*.
2. **Settings → Developer options → ADB debugging** on. If the menu offers you
   *"Disable ADB debugging"*, it is **already on** — that wording is the enabled state.
   Leave it alone.
3. Still in Developer options, turn on **Turn off automatic Wi-Fi**. Without this the watch
   defers to the phone over Bluetooth instead of joining Wi-Fi, and the debugging option
   stays greyed out or missing.
4. Put the watch on the **same Wi-Fi network as your computer**.
5. Turn on **Wireless debugging** (older watches call this **Debug over Wi-Fi**).

Then pair. Newer watches use a pairing code; older ones connect directly.

**Newer (Wireless debugging with pairing):** tap **Pair new device** on the watch. It shows
an IP, a *pairing* port, and a six-digit code. Note that the pairing port and the connect
port are different numbers — the Wireless debugging main screen shows the connect port.

```bash
adb pair <watch-ip>:<pairing-port>     # enter the six-digit code when prompted
adb connect <watch-ip>:<connect-port>
adb devices                            # confirm the watch is listed
adb -s <watch-ip>:<connect-port> install -r wear/build/outputs/apk/debug/wear-debug.apk
```

**Older (Debug over Wi-Fi, no pairing):**

```bash
adb connect <watch-ip>:5555
adb -s <watch-ip>:5555 install -r wear/build/outputs/apk/debug/wear-debug.apk
```

Grant the watch app the **Sensors / heart rate** permission the first time it runs.

## Google Drive upload setup

Uploads use the `drive.file` scope, so the app can only touch files it created itself — it
gets no access to the rest of your Drive. The files it writes are ordinary visible files in a
`HeartRateSync` folder, one NDJSON file per day (`heart-rate-2026-09-01.ndjson`).

Google requires an OAuth client tied to the app's signing certificate, so this part needs a
one-time setup in your own Google Cloud project:

1. Create a project at <https://console.cloud.google.com>.
2. **APIs & Services → Library →** enable the **Google Drive API**.
3. **APIs & Services → OAuth consent screen →** External, add yourself as a test user.
4. **Credentials → Create credentials → OAuth client ID → Android**.
   - Package name: `com.tomgdroid.hrsync`
   - SHA-1: the fingerprint of the certificate the APK was signed with. For a debug build
     from CI, get it from the APK itself:
     ```bash
     keytool -printcert -jarfile app-debug.apk
     ```

No client ID goes in the app source — Google matches the request by package name and
signature at runtime.

If you skip this, everything except Drive upload still works; readings accumulate on the
phone and the Data tab reports that Drive needs sign-in.

## Data format

One JSON object per line:

```json
{"time":"2026-09-01T14:22:31Z","epoch_millis":1788358951000,"kind":"instant_bpm","value":142.0,"unit":"bpm","source":"samsung_health","origin_package":"wear.measure"}
```

`kind` is one of `instant_bpm`, `resting_bpm`, `hrv_rmssd`. `source` distinguishes readings
measured by the watch app from those imported out of Health Connect.

## Known limits

- **Bluetooth range.** The watch streams to the phone directly; walk away from the phone and
  the display goes stale (and says so). Samples are not buffered on the watch for later
  replay — a reconnect resumes the live stream but the gap stays a gap.
- **Battery.** Continuous 1 Hz heart rate measurement is the most expensive thing a watch can
  do. Expect a noticeable drain over a long session.
- **Estimated max HR.** Zones default to a 220-minus-age style estimate (185). If you know
  your real max, set it on the Data tab — every zone boundary derives from it.
- **Health Connect background reads** require the permission of the same name, which the
  system grants separately from the read permissions. Without it the periodic archive job
  only works while the app is open.
