# Wayfarer Build Kit

A prompt-driven plan for building **Wayfarer**, a cinematic hybrid synthesizer plugin
modelled on the feature set of KeySolutions Sounds *Traveler*, in C++ with JUCE 8.
Target: Windows 10/11, VST3 + Standalone, loading in Studio One, Fender Studio Pro
and Gig Performer.

Everything here is text. Nothing has been compiled yet. You feed the prompts in
`prompts/` to Claude Code on your Windows machine, one at a time, and it writes,
compiles and tests each layer of the synth. `SPEC.md` is the design the prompts
implement and `PARAMETERS.md` is the parameter map that keeps every prompt
consistent with the ones before it.

> Naming: the working name is **Wayfarer**. Do not ship it as "Traveler" or use
> KeySolutions branding. The architecture is a clean-room re-implementation from
> public feature descriptions. No KeySolutions code, presets or wavetables are used.

---

## 1. What you need installed (once)

| Tool | Version | Notes |
|---|---|---|
| Visual Studio 2022 Community | 17.x | Select the **Desktop development with C++** workload. This gives you MSVC, the Windows SDK and CMake integration. |
| CMake | 3.28 or newer | https://cmake.org/download/ , tick "Add to PATH". |
| Git for Windows | latest | Enable long paths: `git config --global core.longpaths true` |
| Ninja (optional) | latest | Faster builds. `winget install Ninja-build.Ninja` |
| Claude Code | latest | Run it from **Windows Terminal opened as Administrator** for the build steps, so the VST3 can be copied into `C:\Program Files\Common Files\VST3`. |
| pluginval (optional, recommended) | latest | https://github.com/Tracktion/pluginval/releases . Validates the plugin the way a host would. |

Also enable Windows long paths once (PowerShell as admin):

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

JUCE 8 is pulled by CMake automatically (prompt 01 sets that up). No VST3 SDK
download is needed. JUCE bundles it. JUCE's free tier covers personal use.
Check the current JUCE licence page for any splash screen or revenue conditions.

---

## 2. How to run the prompts

1. Create an empty folder, e.g. `C:\dev\wayfarer`, and `git init` it.
2. Open Windows Terminal **as Administrator**, `cd C:\dev\wayfarer`, run `claude`.
3. Copy `SPEC.md` and `PARAMETERS.md` from this kit into `C:\dev\wayfarer\docs\`
   before prompt 01. Prompt 01 tells Claude to read them and write `CLAUDE.md`
   so every later session carries the design without you re-pasting it.
4. Paste `prompts/01-scaffold.md`. Let it finish. Confirm the build passes and
   the plugin appears in Studio One. Commit.
5. Run `/clear` (or start a new session) and paste the next prompt. Repeat.
6. Each prompt ends with a **Done when** list. If any item is not met, reply
   with the failing item or the error text and let Claude fix it before you move on.
7. Commit after every prompt. If a later prompt breaks something, `git diff`
   against the last good commit is your safety net.

Order matters. Each prompt assumes the previous ones are complete:

| # | Prompt | Builds |
|---|---|---|
| 01 | Scaffold | CMake + JUCE project, empty plugin that passes audio, CLAUDE.md |
| 02 | Parameters and state | Full parameter tree, save/load, preset file format |
| 03 | Oscillators | 3 oscillators, sync, FM, Super stack, wavetable, noise, Vintage drift |
| 04 | Voices | 16-voice poly, mono, legato, unison, glide, bend, aftertouch, CC learn |
| 05 | Filters | Ladder 6/12/18/24, NJM2069-style 12/24, stereo/dual routing |
| 06 | Envelopes | 3 envelopes, ADSR / ADBSSR, stage curves, retrigger |
| 07 | LFOs and mod matrix | 3 poly LFOs, 21 shapes, 21-slot matrix, 100+ destinations |
| 08 | Control Tracks | Dual 16-step modulation sequencers |
| 09 | Arpeggiator | 20 modes, oscillator targeting, per-step envelope |
| 10 | Effects | EQ, BBD chorus, modulated delay, modulated reverb, plus standalone FX plugins |
| 11 | GUI | Resizable editor, all panels, preset browser |
| 12 | Presets | Factory bank, categories, embedded via BinaryData |
| 13 | QA and release | pluginval, host testing, installer, performance pass |

Expect prompts 03, 05, 07, 10 and 11 to take the longest. Budget one sitting per prompt.

---

## 3. Compiling by hand

Claude does this for you inside each prompt, but you should know the commands.

```bat
:: from C:\dev\wayfarer, in a terminal opened as Administrator
cmake -B build -G "Visual Studio 17 2022" -A x64
cmake --build build --config Release --target Wayfarer_VST3 Wayfarer_Standalone
```

Faster incremental builds with Ninja (run from "x64 Native Tools Command Prompt for VS 2022"):

```bat
cmake -B build-ninja -G Ninja -DCMAKE_BUILD_TYPE=Release
cmake --build build-ninja --target Wayfarer_VST3
```

Outputs:

```
build\Wayfarer_artefacts\Release\VST3\Wayfarer.vst3\        (bundle folder)
build\Wayfarer_artefacts\Release\Standalone\Wayfarer.exe
```

With `COPY_PLUGIN_AFTER_BUILD TRUE` in CMake (prompt 01 sets it), the VST3 is
copied to `C:\Program Files\Common Files\VST3\Wayfarer.vst3` after each build.
That copy needs an admin terminal. If you would rather not run as admin, set
`-DJUCE_VST3_COPY_DIR=C:\Users\<you>\VST3` when configuring and add that folder
to each DAW's plugin search path.

Run tests:

```bat
cmake --build build --config Release --target WayfarerTests
build\tests\Release\WayfarerTests.exe
```

Validate like a host:

```bat
pluginval --strictness-level 5 --validate "C:\Program Files\Common Files\VST3\Wayfarer.vst3"
```

---

## 4. Getting it into your DAWs

**Studio One**
Studio One > Options > Locations > VST Plug-Ins. Make sure
`C:\Program Files\Common Files\VST3` is listed (it is by default) or add your custom
folder. Tick "Scan at startup", then restart. If the plugin was blocklisted
after a crash during development: Options > Locations > VST Plug-Ins > Reset Blocklist.

**Gig Performer**
Options > Plugin Manager. Under the VST3 tab confirm the search path, then
"Manage Plugins" > "Scan for new plugins" (or "Rescan all plugins" after a rebuild).
Gig Performer caches plugin scans, so after every rebuild that changes parameters
you need a rescan. For live use, Wayfarer's parameters are exposed as VST3
parameters, so Gig Performer widget-to-parameter mapping and Predictive Loading work.

**Fender Studio Pro**
Open the application's plugin or preferences settings, confirm the VST3 search
folder includes `C:\Program Files\Common Files\VST3`, and trigger a rescan. The
exact menu path could not be verified from this environment. If the plugin does
not appear, check the host's plugin blocklist first.

After a rebuild while a DAW is open, the DAW usually has the old `.vst3` file
locked. Close the DAW before building, or build with `JUCE_VST3_COPY_DIR` pointing
at a scratch folder and copy manually.

---

## 5. Troubleshooting

| Symptom | Fix |
|---|---|
| `cmake` not found | Reopen the terminal after installing CMake, or use the "x64 Native Tools Command Prompt for VS 2022" which has it. |
| FetchContent fails to download JUCE | Corporate proxy or offline. `git clone --depth 1 --branch 8.0.9 https://github.com/juce-framework/JUCE.git external/JUCE` and configure with `-DFETCHCONTENT_SOURCE_DIR_JUCE=%CD%\external\JUCE`. |
| Copy to Common Files fails with access denied | Terminal is not elevated, or the DAW has the plugin loaded. Close DAW, re-run as admin. |
| Plugin not visible in DAW | Rescan. Check it is 64-bit Release build. Check blocklist. Run pluginval to see if it crashes on load. |
| Crackles at low buffer sizes | Report the CPU meter reading and buffer size to Claude in prompt 13. Usually oversampling or the reverb needs tuning. |
| Standalone shows no audio device | Use the Standalone's Options > Audio Settings, pick Windows Audio (WASAPI) exclusive mode or your ASIO device if the ASIO SDK was enabled. |
| `error C1128: number of sections exceeded` | Add `/bigobj` to MSVC flags (prompt 01's CMake already includes it). |
| Path too long errors | Enable long paths (section 1) and keep the repo at a short path like `C:\dev\wayfarer`. |

---

## 6. Files in this kit

```
README.md          this file
SPEC.md            architecture and behaviour spec (what Wayfarer is)
PARAMETERS.md      parameter IDs, ranges, mod sources and destinations
prompts/01..13     the build prompts, in order
```
