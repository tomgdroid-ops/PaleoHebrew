# Wayfarer Build Kit (complete, single file)

Contents: Part 1 README (setup, compiling, DAW install). Part 2 SPEC. Part 3 PARAMETERS. Part 4 PRESETS (22 starter presets). Part 5 the 13 build prompts in order. The UI mockup (ui/UI-MOCKUP.html) is a separate file in the kit; prompt 11 needs it copied into docs/.

Before prompt 01, save Part 2 as `docs/SPEC.md`, Part 3 as `docs/PARAMETERS.md` and Part 4 as `docs/PRESETS.md` inside your new project folder, and copy `ui/UI-MOCKUP.html` to `docs/UI-MOCKUP.html`. Then paste one prompt per Claude Code session, in order, and check each prompt's **Done when** list before moving on.

---

# PART 1: README

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
3. Copy `SPEC.md`, `PARAMETERS.md`, `PRESETS.md` and `ui/UI-MOCKUP.html` from this kit into `C:\dev\wayfarer\docs\`
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
| 11 | GUI | Colour-coded editor matching `ui/UI-MOCKUP.html`, centre oscilloscope, preset browser |
| 12 | Presets | The 22 starter presets from `PRESETS.md`, then a full factory bank, embedded via BinaryData |
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
PRESETS.md         22 starter presets as exact parameter recipes (prompt 12 builds them)
ui/UI-MOCKUP.html  interactive mockup of the editor layout (open in a browser; prompt 11 matches it)
ui/UI-MOCKUP.png   screenshot of the mockup
ALL-PROMPTS.md     everything above plus all prompts, in one file
prompts/01..13     the build prompts, in order
```

---

# PART 2: SPEC.md

# Wayfarer Specification

Wayfarer is a stereo, polyphonic, hybrid virtual-analog / wavetable synthesizer
plugin (VST3 + Standalone, Windows first) with a modulation-sequencer-driven
"motion" workflow. This document is the single source of truth for behaviour.
`PARAMETERS.md` is the source of truth for parameter IDs and ranges.

Reference points (public feature descriptions only): KeySolutions Sounds Traveler
(2026). Where Traveler's exact behaviour is unknown, this spec picks a concrete
behaviour and the implementation follows the spec, not guesses about Traveler.

## 1. Signal flow

```
        +-------+   +-------+   +-------+   +-------+
        | Osc 1 |   | Osc 2 |   | Osc 3 |   | Noise |
        +---+---+   +---+---+   +---+---+   +---+---+
            |           |           |           |
            +-----------+-----+-----+-----------+
                              | per-voice stereo mix (level + pan each)
                       +------+------+
                       |  Filter A   |  <-- routing: Series / Parallel / Split(L=A, R=B)
                       |  Filter B   |
                       +------+------+
                              | Amp (Env 2) x Velocity x Unison sum
                    (voices summed here)
                              |
                 +------------+------------+
                 | EQ > Chorus > Delay > Reverb |  (global, one instance)
                 +------------+------------+
                              |
                        Master volume
```

- Audio path is 32-bit float, stereo from the oscillators onward.
- Internal oversampling: 2x on the oscillator + filter block (user selectable Off/2x/4x).
- Block-based modulation: modulators are evaluated once per 32 samples (control rate)
  and linearly smoothed to audio rate for pitch, cutoff and level. Filter cutoff,
  oscillator pitch and amp are smoothed per sample.

## 2. Oscillators

Three oscillators plus a noise source per voice.

Common to all three:
- **Wave**: a single continuous control that morphs Sine → Triangle → Saw → Square → Pulse.
  Implement as PolyBLEP saw/square with crossfades; Sine and Triangle are direct.
- **Pulse width** applies in the Square/Pulse region and is a mod destination (PWM).
- **Range**: Octave (-3..+3, six octaves), Semitone (-12..+12), Fine (-100..+100 cents).
- **Level** (0..1) and **Pan** (-1..+1), both mod destinations.
- **Key track** on/off (off = fixed pitch, useful as an FM or drone source).
- **Phase**: Free-running or Reset on note-on with a start phase.

Oscillator 1 extras:
- **Hard sync** to Oscillator 2 (Osc 2 is master, Osc 1 resets).
- **Linear FM** and **Exponential FM**, each with its own amount, source selectable
  Osc 2 or Osc 3. Linear FM is through-zero. Both amounts are mod destinations.

Oscillator 2 extras:
- **Super** stack: 7 detuned copies with **Detune** (0..100 cents spread) and
  **Stereo Spread** (0..1) and **Mix** (center vs sides). When Super is off it
  is a single oscillator. Copies use the same waveform.

Oscillator 3 extras:
- **Mode** switch: VA (same as others) or **Wavetable**.
- Wavetable mode: factory bank of 85 tables (generated by the build, see prompt 03),
  **Position** (0..1, mod destination, crossfades between frames), import of
  `.wav` wavetables (Serum-style 2048-sample frames, any frame count; also detect
  the `clm` chunk), band-limited via mip-mapped per-octave tables.
- **Duo**: second copy of Osc 3 with **Detune** and **Stereo Spread**.

Noise: White/Pink with **Level** and **Colour** (low-pass tilt), mod destinations.

**Vintage** (global, 0..1): adds slow, non-periodic drift to every oscillator's pitch
(per-oscillator, per-voice independent random walks, a few cents at max), small
random start-phase and level jitter, and a slight per-voice cutoff offset. At 0
the engine is perfectly stable.

## 3. Filters

Two filter units (A and B), each selectable between:

- **Ladder** low-pass, 6 / 12 / 18 / 24 dB per octave. Zero-delay-feedback
  Moog-style 4-pole with tanh saturation in the feedback path. Slope is selected by
  taking the output from pole 1, 2, 3 or 4 with resonance scaled accordingly.
  Self-oscillates at max resonance. Resonance compensation option keeps bass at
  high resonance.
- **NJM2069-style** 12 / 24 dB per octave, modelled on the character of the Korg
  DW-8000 / DSS-1 filter chip: 4-pole OTA-style cascade with soft clipping in
  each stage, brighter and more aggressive resonance than the ladder, less bass
  loss at high resonance, and a distinct "bark" when driven. Implement as a
  Zavalishin-style OTA cascade with per-stage saturation and a resonance feedback
  path that saturates harder than the ladder.

Per filter: Cutoff (20 Hz..20 kHz, log), Resonance (0..1), Drive (input gain 0..24 dB),
Key Track (0..200 %), Env Amount (bipolar, from Env 1), LFO Amount (bipolar, from LFO 1),
Velocity to cutoff.

**Routing**: Series (A then B), Parallel (mixed with Balance), Split (Filter A on the
left channel, B on the right). **Stereo Offset** detunes cutoff between left and
right channels of each filter for stereo width even in Series/Parallel.

## 4. Envelopes

Three envelopes: Env 1 (Filter), Env 2 (Amp), Env 3 (Mod). Each:

- **Mode**: ADSR or ADBSSR (Attack, Decay, Break level, Slope time, Sustain, Release).
  In ADBSSR the decay goes to Break level, then Slope moves to Sustain.
- Times: 0 ms..20 s (log), curves per stage: Attack curve, Decay curve, Release curve
  each -1..+1 (linear at 0, exponential/logarithmic at extremes).
- Velocity sensitivity (0..1), and an overall Depth (Env 1 and 3 only).
- Env 3 **Trigger**: Note (default), Mod Wheel (retrigger when wheel crosses a
  threshold going up), Aftertouch, LFO 1 / 2 / 3 cycle (retriggers each time the LFO
  wraps). This is what makes Env 3 usable as a rhythmic shaper.
- Legato mode: envelopes do not retrigger on legato notes when glide mode is Legato.

## 5. LFOs

Three LFOs, all **polyphonic** (one instance per voice) with an option to run as
global (shared phase across voices).

- 21 shapes: Sine, Triangle, Saw Up, Saw Down, Square, Pulse 25 %, Pulse 75 %,
  Sample & Hold, Smooth Random, Exp Up, Exp Down, Log Up, Log Down, Stairs 4 Up,
  Stairs 4 Down, Stairs 8, Half Sine, Rectified Sine, Trapezoid, Sine+Saw, Drift (1/f noise).
- Rate 0.01..50 Hz free, or tempo synced (1/64 .. 8 bars, with dotted and triplet).
- Start Phase, Fade In (0..10 s), Key Trigger (reset phase on note), One Shot,
  Polarity (bipolar / unipolar), Smooth (slew on stepped shapes).
- "Random motion": with Drift shape and Smooth this yields organic movement.

## 6. Modulation matrix

21 slots. Each slot: Source, Destination, Amount (-100..+100 %), Via (secondary
source that scales the amount, default None), Curve (linear / exponential).

Sources: Env 1, Env 2, Env 3, LFO 1, LFO 2, LFO 3, Control Track A, Control Track B,
Velocity, Release Velocity, Key Track, Mod Wheel, Aftertouch (channel), Poly Aftertouch,
Pitch Bend, Expression (CC 11), Breath (CC 2), Macro 1-4, Random (per voice, fixed
at note-on), Arp Step Value, Constant (+1), Learn 1-4 (MIDI CC learn slots).

Destinations: every entry marked `M` in `PARAMETERS.md` (over 100).

Per-voice sources modulate per-voice; global sources are applied per voice at
note-on time and continuously thereafter. Amounts sum; destinations clamp to range.

## 7. Control Tracks

Two identical **modulation step sequencers** (A and B). Each writes a repeating
series of values to any destination through the mod matrix (as a source) and also
has one direct destination selector for convenience.

- 16 steps, each a bipolar value (-1..+1). **Length** (1..16).
- Per-step **Step Length** multiplier (x0.5, x1, x2, x3, x4 in steps). 
- **Rate**: tempo synced (1/64 .. 4 bars) or free Hz.
- **Smoothing** (0..1): slew between step values, at 1 the track is a continuous curve.
- **Swing** (0..75 %), **Gate** (0..100 %: fraction of each step the value is held
  before returning to zero; 100 % = hold, no gaps).
- **Randomise** amount (0..1): per cycle, each step's value is offset by a random
  amount scaled by this. Also a "Randomise now" button that rewrites the steps.
- **Direction**: Forward, Reverse, Ping-Pong, Random.
- **Trigger**: Free running (synced to host transport) or Retrigger on note-on.
- Polyphonic option: each voice gets its own track playhead when Retrigger is on.

## 8. Arpeggiator

- On/Off, **Hold/Latch**, **Rate** (1/64 .. 1 bar, dotted/triplet), **Octaves** 1..4,
  **Gate** (1..200 %), **Swing** (0..75 %), **Velocity source** (Played / Step / Fixed).
- **20 playback modes**: Up, Down, Up-Down (inclusive), Up-Down (exclusive),
  Down-Up (inclusive), Down-Up (exclusive), As Played, Reverse Played, Random,
  Random No Repeat, Chord, Converge, Diverge, Converge-Diverge, Pinky Up, Pinky Down,
  Thumb Up, Thumb Down, Up x2, Down x2.
- **Step sequence** (1..16 steps): per step On/Off (rest), Tie, Velocity, Gate,
  Transpose (-12..+12), and **Env Shape** (-1..+1, scales the amp envelope attack
  and decay for that step: negative = plucky, positive = swelling).
- **Oscillator targeting**: choose which oscillators the arp drives (any combination
  of Osc 1/2/3). Non-targeted oscillators are held as sustained notes from the
  played chord. This means one hand can play a pad on Osc 2 while Osc 1 arpeggiates.
- The Arp Step Value (the current step's Env Shape) is a mod matrix source.

## 9. Voicing and MIDI

- Modes: Poly, Mono, Legato. Voices 1..16. Voice stealing: oldest, with a 5 ms fade.
- Unison 1..16 voices (stacked per note) with Detune (0..100 cents) and Stereo Spread.
  Voice count is total voices; unison divides polyphony.
- Glide: time 0..10 s, mode Off / Always / Legato only, **Poly glide** (each voice
  glides from the last voice's pitch that was assigned to it).
- Pitch bend range **Up** and **Down** set separately (0..24 semitones).
- Channel aftertouch and Poly aftertouch as mod sources.
- MIDI CC Learn: right-click any knob → Learn, next CC received is bound. Four
  generic Learn slots also available as mod sources. Bindings saved with the preset
  and, optionally, globally.
- Sustain pedal (CC 64), All Notes Off, transport-synced modulators follow host PPQ.
- MPE: not in scope for v1 (matches Traveler at launch). Leave hooks in the voice
  allocator for per-note channels.

## 10. Effects (global chain, each with On/Off)

1. **EQ**: 3-band. Low shelf (gain, freq), Mid peak (gain, freq, Q), High shelf (gain, freq).
2. **Chorus** "bucket brigade": three modes. Mode I (slow, wide), Mode II (faster,
   deeper), Mode I+II (both, classic Juno-style). Rate, Depth, Mix. Modelled as a
   short modulated delay with BBD-style band limiting and gentle noise.
3. **Delay** (also built as standalone plugin `WayfarerTime`): dual modulated delay.
   Modes Dual (independent L/R times) and Ping Pong. Time L/R (sync or ms),
   Feedback, Mod Rate, Mod Depth (pitch-varies repeats), High cut, Low cut, Mix,
   Ducking. The modulation is applied to delay read position with interpolation so
   repeats drift in pitch.
4. **Reverb** (also built as standalone plugin `WayfarerSpace`): modulated reverb
   with three algorithms. Room (small FDN, early reflections dominant), Hall (8-line
   FDN, Householder mixing, moderate modulation), Space (long-decay 8-line FDN with
   heavier modulation, diffusion and a subtle pitch-drift, tuned to stay clear on
   the source). Size, Decay, Pre-delay, Damping, Mod Rate, Mod Depth, Low cut, Mix.

## 11. GUI

Reference mockup: `ui/UI-MOCKUP.html` (open in a browser). The editor must
match its layout, colour system and proportions. Base size 1280 x 960,
resizable by aspect-locked scaling 60 %..200 %, scale remembered globally.

**Look.** Deep dark blue metallic panel: a vertical gradient from `#13213F`
(top) to `#0B1226` (bottom) with a subtle radial highlight at top centre
(`#182B52`), overlaid with a fine horizontal brushed-metal grain and a soft
vignette. The grain comes from `resources/ui/background.png` (a 2048 x 2048
tileable brushed navy texture, drawn at 35 % opacity) when present, otherwise
a procedural fractal-noise generator produces an equivalent tile at startup.
Section panels are slightly lighter (`#16233F` to `#0F182D`) with a 1 px
`#22304F` border, 5 px radius and a 1 px inner top highlight. Knobs are dark
metal caps with a coloured value arc and a white pointer.

**Colour-coded section headers (Roland style).** Every section has a 22 px
solid header bar in its family colour with dark text (`#0B1020`), the section
name left in the display face, and a live one-line status right in mono (for
example "Ladder 24", "poly · sine · 0.08 Hz"). Knob arcs, tab highlights and
active pills inside a section use the same family colour. Families:

| Family | Colour | Sections |
|---|---|---|
| Oscillators | amber `#F08A24` | Osc 1, Osc 2, Osc 3, Noise |
| Filters | green `#35C26F` | Filter A, Filter B, routing |
| Envelopes | yellow `#E9C440` | Env 1, Env 2, Env 3 |
| LFOs | sky `#4AA8F0` | LFO 1-3 tabs |
| Mod matrix | magenta `#C65CC1` | Matrix tab, amount sliders |
| Control Tracks | teal `#2EC4B6` | Track A, Track B tabs |
| Arpeggiator | coral `#E8574E` | Arp tab |
| Effects | violet `#8F6FEC` | EQ, Chorus, Delay, Reverb |
| System | silver `#B9C5D8` | Top bar, Voice, Monitor, Master |

Macro knobs borrow the colour of what they mostly control: Brightness amber,
Motion teal, Space violet, Character yellow.

**Type.** Rajdhani (600/700) for section titles, tabs and buttons; IBM Plex
Sans for labels; IBM Plex Mono for values and status. Fonts are embedded via
BinaryData. Labels are 9.5 px uppercase with 0.06 em tracking at base scale.

**Layout, top to bottom (signal flow).**
1. Top bar (44 px): logo, prev/next, preset name with category chip and
   author, Save, undo/redo, voice meter, CPU meter, master knob, scale menu.
2. Sources row (226 px): Osc 1 | Osc 2 | Osc 3 | Noise | Voice. Osc 3 shows
   the wavetable name and a small frame view when in wavetable mode.
3. Shaping row (268 px): Filter A | Filter B (with routing strip) |
   **Monitor** (380 px wide, centre) | Env 1 | Env 2 | Env 3. Filters and
   envelopes show a live response / shape graph above their knobs. The Monitor
   holds the oscilloscope with the four macro knobs underneath it.
4. Modulation row (246 px): left panel tabs LFO 1 / LFO 2 / LFO 3 / Matrix
   (LFO tabs sky, Matrix tab magenta); the LFO view shows the shape graph,
   controls, and a compact read-only view of the first matrix rows beside it.
   Right panel tabs Track A / Track B / Arp (teal, teal, coral) with the
   draggable step editors and the row of track controls.
5. Effects row (136 px): EQ | Chorus | Delay | Reverb, left to right in signal
   order, each with an on/off in its header.

**Monitor (oscilloscope).** Centre of the shaping row. Draws the audio as a
glowing amber trace on a near-black screen with a faint 12 x 6 grid and a
centre line. Modes as tabs inside the screen: OUT (post-FX stereo sum,
default), PRE (pre-FX voice sum), OSC1 / OSC2 / OSC3 (the most recently
started voice's oscillator output, pre-filter), SPEC (log-frequency spectrum,
2048-point FFT, 30 dB..-90 dB). Time window ~3 cycles of the lowest sounding
note when a note is held (zero-crossing rising-edge trigger on the tapped
signal, so the display is stable), otherwise a fixed 20 ms window. A readout
in the lower right shows peak dBFS, active voices and host BPM. The audio
thread writes into a lock-free FIFO (`juce::AbstractFifo`, 8192 samples per
tap); the UI reads at 60 Hz. Tapping costs nothing when the editor is closed
(a flag the editor sets on open/close). Trace uses `Path` with a 2 px stroke
and a drop-shadow glow in the amber colour.

**Interaction.** Every knob: double-click resets, Ctrl-drag fine, mouse-wheel,
right-click menu with MIDI Learn / Unlearn / Add to mod matrix. A thin
mod-ring around a knob shows the summed modulation range in the family colour.
Control Track and Arp steps are draggable bars with a playhead. Hovering any
control shows its full name and value in the top bar (no tooltips popping
over the panel). Preset browser opens as an overlay over rows 2-4 with
categories, search, favourites, and user folder in `%APPDATA%\Wayfarer\Presets`.

## 12. Non-goals for v1

MPE, sample playback, per-voice effects, macOS builds (the CMake supports it,
but nothing is tested there), AAX.

## 13. Quality bars

- No allocations, locks or logging on the audio thread after `prepareToPlay`.
- Denormals disabled (`juce::ScopedNoDenormals`).
- Passes `pluginval --strictness-level 5`.
- 16 voices, 16-unison, all FX on, 2x oversampling: under 25 % of one core of a
  modern desktop CPU at 48 kHz / 128 samples. Measured in prompt 13.
- Parameter changes never click. State load is sample-accurate and silent.

---

# PART 3: PARAMETERS.md

# Wayfarer Parameter Map

Parameter IDs are stable strings used in `juce::AudioProcessorValueTreeState`,
preset files and automation. Never rename an ID after prompt 02; add new ones
instead. Column `M` = valid modulation-matrix destination.

Conventions: `N` in an ID means 1..3 for oscillators / envelopes / LFOs, `X` means
A or B for filters and control tracks, `S` means step 1..16, `K` means slot 1..21.
Ranges are the user-facing ranges. Booleans are 0/1. Choice parameters list their
items in order.

## Global

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| masterVolume | float dB | -60..+6 | 0 | M |
| masterPan | float | -1..1 | 0 | M |
| voiceMode | choice | Poly, Mono, Legato | Poly | |
| voices | int | 1..16 | 8 | |
| unisonVoices | int | 1..16 | 1 | |
| unisonDetune | float cents | 0..100 | 12 | M |
| unisonSpread | float | 0..1 | 0.5 | M |
| glideTime | float s | 0..10 (log) | 0 | M |
| glideMode | choice | Off, Always, Legato | Off | |
| polyGlide | bool | | 0 | |
| pbUp | int semi | 0..24 | 2 | |
| pbDown | int semi | 0..24 | 2 | |
| vintage | float | 0..1 | 0.15 | M |
| oversampling | choice | Off, 2x, 4x | 2x | |
| macro1..macro4 | float | 0..1 | 0 | (source) |

## Oscillators (N = 1..3)

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| oscN_on | bool | | osc1 on, others off | |
| oscN_wave | float | 0..1 (Sine→Tri→Saw→Square→Pulse) | 0.5 | M |
| oscN_pw | float | 0.05..0.95 | 0.5 | M |
| oscN_octave | int | -3..3 | 0 | |
| oscN_semi | int | -12..12 | 0 | |
| oscN_fine | float cents | -100..100 | 0 | M |
| oscN_pitch | float semi | -24..24 (mod-only offset, hidden from UI) | 0 | M |
| oscN_level | float | 0..1 | 0.8 | M |
| oscN_pan | float | -1..1 | 0 | M |
| oscN_keytrack | bool | | 1 | |
| oscN_phaseMode | choice | Free, Reset | Free | |
| oscN_phase | float | 0..1 | 0 | |
| osc1_sync | bool | | 0 | |
| osc1_fmSource | choice | Osc2, Osc3 | Osc2 | |
| osc1_fmLin | float | 0..1 | 0 | M |
| osc1_fmExp | float | 0..1 | 0 | M |
| osc2_super | bool | | 0 | |
| osc2_superDetune | float cents | 0..100 | 20 | M |
| osc2_superSpread | float | 0..1 | 0.7 | M |
| osc2_superMix | float | 0..1 | 0.6 | M |
| osc3_mode | choice | VA, Wavetable | VA | |
| osc3_wtIndex | int | 0..(tableCount-1) | 0 | |
| osc3_wtPosition | float | 0..1 | 0 | M |
| osc3_duo | bool | | 0 | |
| osc3_duoDetune | float cents | 0..100 | 10 | M |
| osc3_duoSpread | float | 0..1 | 0.6 | M |
| noise_level | float | 0..1 | 0 | M |
| noise_colour | float | 0..1 (white→dark) | 0.3 | M |

User-imported wavetables are referenced in the preset by file name and stored in
`%APPDATA%\Wayfarer\Wavetables`. `osc3_wtIndex` above the factory count indexes
the user list.

## Filters (X = A, B)

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| fltX_type | choice | Ladder6, Ladder12, Ladder18, Ladder24, NJM12, NJM24 | Ladder24 | |
| fltX_cutoff | float Hz | 20..20000 (log) | 20000 (A), 20000 (B) | M |
| fltX_res | float | 0..1 | 0.1 | M |
| fltX_drive | float dB | 0..24 | 0 | M |
| fltX_keytrack | float | 0..2 | 0.5 | |
| fltX_envAmt | float | -1..1 | 0.5 (A), 0 (B) | M |
| fltX_lfoAmt | float | -1..1 | 0 | M |
| fltX_velAmt | float | 0..1 | 0 | |
| fltX_resComp | bool | | 1 | |
| fltX_on | bool | | A on, B off | |
| filterRouting | choice | Series, Parallel, Split | Series | |
| filterBalance | float | -1..1 (Parallel only) | 0 | M |
| filterStereoOffset | float semi | 0..24 | 0 | M |

## Envelopes (N = 1 Filter, 2 Amp, 3 Mod)

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| envN_mode | choice | ADSR, ADBSSR | ADSR | |
| envN_attack | float s | 0..20 (log) | 0.005 | M |
| envN_decay | float s | 0..20 (log) | 0.3 | M |
| envN_break | float | 0..1 | 0.7 | |
| envN_slope | float s | 0..20 (log) | 0.5 | |
| envN_sustain | float | 0..1 | 1 (amp), 0.5 others | M |
| envN_release | float s | 0..20 (log) | 0.3 | M |
| envN_attackCurve | float | -1..1 | 0 | |
| envN_decayCurve | float | -1..1 | -0.5 | |
| envN_releaseCurve | float | -1..1 | -0.5 | |
| envN_velocity | float | 0..1 | 0.5 (amp), 0 others | |
| envN_depth | float | -1..1 (env 1 and 3) | 1 | M |
| env3_trigger | choice | Note, ModWheel, Aftertouch, LFO1, LFO2, LFO3 | Note | |

## LFOs (N = 1..3)

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| lfoN_shape | choice | Sine, Triangle, SawUp, SawDown, Square, Pulse25, Pulse75, SampleHold, SmoothRandom, ExpUp, ExpDown, LogUp, LogDown, Stairs4Up, Stairs4Down, Stairs8, HalfSine, RectSine, Trapezoid, SineSaw, Drift | Sine | |
| lfoN_rate | float Hz | 0.01..50 (log) | 1 | M |
| lfoN_sync | bool | | 0 | |
| lfoN_div | choice | 1/64, 1/32T, 1/32, 1/16T, 1/16, 1/8T, 1/16D, 1/8, 1/4T, 1/8D, 1/4, 1/2T, 1/4D, 1/2, 1/2D, 1 bar, 2 bars, 4 bars, 8 bars | 1/4 | |
| lfoN_phase | float | 0..1 | 0 | M |
| lfoN_fadeIn | float s | 0..10 | 0 | |
| lfoN_keyTrigger | bool | | 1 | |
| lfoN_oneShot | bool | | 0 | |
| lfoN_polarity | choice | Bipolar, Unipolar | Bipolar | |
| lfoN_smooth | float | 0..1 | 0 | |
| lfoN_global | bool | | 0 | |
| lfoN_depth | float | 0..1 (scales the LFO as a source) | 1 | M |

## Mod matrix (K = 1..21)

| ID | Type | Choices |
|---|---|---|
| modK_source | choice | None, Env1, Env2, Env3, LFO1, LFO2, LFO3, CtrlA, CtrlB, Velocity, RelVelocity, KeyTrack, ModWheel, Aftertouch, PolyAftertouch, PitchBend, Expression, Breath, Macro1, Macro2, Macro3, Macro4, Random, ArpStep, Constant, Learn1, Learn2, Learn3, Learn4 |
| modK_dest | choice | None, then every `M` parameter in this file, in file order |
| modK_amount | float -1..1 |
| modK_via | choice | same list as source |
| modK_curve | choice | Linear, Exp |

The destination list is generated in code from a single table
(`ModDestinations.h`) so the UI, the matrix and the presets agree.

## Control Tracks (X = A, B)

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| ctX_on | bool | | 0 | |
| ctX_length | int | 1..16 | 8 | |
| ctX_sync | bool | | 1 | |
| ctX_rate | float Hz | 0.05..50 (log) | 4 | M |
| ctX_div | choice | same list as lfoN_div | 1/16 | |
| ctX_smooth | float | 0..1 | 0 | M |
| ctX_swing | float | 0..0.75 | 0 | M |
| ctX_gate | float | 0..1 | 1 | M |
| ctX_random | float | 0..1 | 0 | M |
| ctX_direction | choice | Forward, Reverse, PingPong, Random | Forward | |
| ctX_trigger | choice | Free, Retrigger | Free | |
| ctX_poly | bool | | 0 | |
| ctX_depth | float | 0..1 | 1 | M |
| ctX_dest | choice | same as modK_dest (direct destination) | None | |
| ctX_destAmount | float | -1..1 | 0 | |
| ctX_stepS | float | -1..1 | 0 | |
| ctX_lenS | choice | x0.5, x1, x2, x3, x4 | x1 | |

## Arpeggiator

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| arp_on | bool | | 0 | |
| arp_latch | bool | | 0 | |
| arp_mode | choice | Up, Down, UpDownInc, UpDownExc, DownUpInc, DownUpExc, AsPlayed, ReversePlayed, Random, RandomNoRepeat, Chord, Converge, Diverge, ConvergeDiverge, PinkyUp, PinkyDown, ThumbUp, ThumbDown, UpX2, DownX2 | Up | |
| arp_div | choice | same list as lfoN_div | 1/16 | |
| arp_octaves | int | 1..4 | 1 | |
| arp_gate | float | 0.01..2 | 0.8 | M |
| arp_swing | float | 0..0.75 | 0 | M |
| arp_velMode | choice | Played, Step, Fixed | Played | |
| arp_target | choice | All, Osc1, Osc2, Osc3, Osc1+2, Osc1+3, Osc2+3 | All | |
| arp_steps | int | 1..16 | 8 | |
| arp_stepOnS | bool | | 1 | |
| arp_stepTieS | bool | | 0 | |
| arp_stepVelS | float | 0..1 | 0.8 | |
| arp_stepGateS | float | 0.01..2 | 1 | |
| arp_stepTransS | int | -12..12 | 0 | |
| arp_stepEnvS | float | -1..1 | 0 | |

## Effects

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| eq_on | bool | | 0 | |
| eq_lowGain | float dB | -15..15 | 0 | M |
| eq_lowFreq | float Hz | 30..500 (log) | 100 | |
| eq_midGain | float dB | -15..15 | 0 | M |
| eq_midFreq | float Hz | 200..8000 (log) | 1000 | M |
| eq_midQ | float | 0.3..10 (log) | 0.7 | |
| eq_highGain | float dB | -15..15 | 0 | M |
| eq_highFreq | float Hz | 1500..16000 (log) | 6000 | |
| chorus_on | bool | | 0 | |
| chorus_mode | choice | I, II, I+II | I | |
| chorus_rate | float Hz | 0.05..10 (log) | 0.5 | M |
| chorus_depth | float | 0..1 | 0.5 | M |
| chorus_mix | float | 0..1 | 0.5 | M |
| delay_on | bool | | 0 | |
| delay_mode | choice | Dual, PingPong | Dual | |
| delay_sync | bool | | 1 | |
| delay_timeL | float ms | 1..2000 (log) | 375 | M |
| delay_timeR | float ms | 1..2000 (log) | 500 | M |
| delay_divL | choice | same list as lfoN_div | 1/8D | |
| delay_divR | choice | same list as lfoN_div | 1/4 | |
| delay_feedback | float | 0..1.1 | 0.4 | M |
| delay_modRate | float Hz | 0.05..5 (log) | 0.3 | M |
| delay_modDepth | float | 0..1 | 0.2 | M |
| delay_lowCut | float Hz | 20..2000 (log) | 100 | |
| delay_highCut | float Hz | 1000..20000 (log) | 8000 | M |
| delay_duck | float | 0..1 | 0 | |
| delay_mix | float | 0..1 | 0.3 | M |
| reverb_on | bool | | 0 | |
| reverb_algo | choice | Room, Hall, Space | Hall | |
| reverb_size | float | 0..1 | 0.5 | M |
| reverb_decay | float s | 0.1..60 (log) | 3 | M |
| reverb_predelay | float ms | 0..250 | 20 | |
| reverb_damp | float | 0..1 | 0.5 | M |
| reverb_modRate | float Hz | 0.05..5 (log) | 0.4 | M |
| reverb_modDepth | float | 0..1 | 0.3 | M |
| reverb_lowCut | float Hz | 20..1000 (log) | 80 | |
| reverb_mix | float | 0..1 | 0.25 | M |

## Non-parameter state (saved in the preset but not automatable)

- MIDI learn map: list of (CC number, parameter ID) plus Learn slot 1-4 CC numbers.
- Preset metadata: name, author, category, tags, comment.
- User wavetable file name for Osc 3.
- Control Track and Arp step data are ordinary parameters above so they are
  automatable, but the GUI treats them as editors rather than knobs.

---

# PART 4: PRESETS.md

# Wayfarer Starter Presets

Twenty-two presets specified as exact parameter recipes using the IDs from
`PARAMETERS.md`. Prompt 12's `PresetGen` tool implements these first, verbatim,
then extends the bank to 80+. Anything not listed keeps its default from
`PARAMETERS.md`. All presets follow the macro convention:
Macro 1 = Brightness, Macro 2 = Motion, Macro 3 = Space, Macro 4 = Character.

Notation:
- `id = value` sets a parameter. Choice parameters use the choice name.
- `modK = Source > Destination, amount [, via Source]` fills matrix slot K.
- `ctA_steps = [..]` fills `ctA_step1..16`; unlisted steps are 0.
- Wavetables are referenced by factory family name from prompt 03. `PresetGen`
  resolves the name to `osc3_wtIndex`; if the exact name is missing, pick the
  closest table in that family and log it.
- `masterVolume` values are starting points; prompt 12's level-match pass
  overrides them to -6 dBFS peak.

---

## 1. Horizon Bed — Pad (the featured one)

A wide, slowly breathing pad with real depth that can carry a section alone,
yet is voiced to sit behind a lead or vocal: the low end is trimmed, the
900 Hz region is scooped so it does not fight melody instruments, the top is
soft, and all the motion is slow and below 0.3 Hz so nothing draws the ear.
Play it with sustained 3-4 note voicings in the C2-C4 range. Macro 1 opens it
up to the front of the mix, Macro 2 adds motion, Macro 3 pushes it further back.

```
# voicing
voiceMode = Poly
voices = 8
unisonVoices = 2
unisonDetune = 6
unisonSpread = 0.6
vintage = 0.3
oversampling = 2x
masterVolume = -6

# oscillators
osc1_on = 1
osc1_wave = 0.55          # saw with a little square edge
osc1_octave = 0
osc1_level = 0.55
osc1_pan = -0.2
osc1_phaseMode = Free

osc2_on = 1
osc2_wave = 0.42          # between triangle and saw, soft
osc2_octave = -1
osc2_level = 0.7
osc2_super = 1
osc2_superDetune = 18
osc2_superSpread = 0.9
osc2_superMix = 0.5

osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Cinematic Evolve 03"
osc3_wtPosition = 0.2
osc3_duo = 1
osc3_duoDetune = 8
osc3_duoSpread = 0.8
osc3_level = 0.45
osc3_pan = 0.15

noise_level = 0.06
noise_colour = 0.7

# filters: ladder for body, OTA for a brighter parallel layer
fltA_on = 1
fltA_type = Ladder24
fltA_cutoff = 900
fltA_res = 0.15
fltA_drive = 3
fltA_keytrack = 0.3
fltA_envAmt = 0.25
fltB_on = 1
fltB_type = NJM12
fltB_cutoff = 2400
fltB_res = 0.2
fltB_keytrack = 0.5
fltB_envAmt = 0.15
filterRouting = Parallel
filterBalance = -0.2
filterStereoOffset = 3

# envelopes
env1_mode = ADBSSR
env1_attack = 1.2
env1_decay = 2.0
env1_break = 0.6
env1_slope = 4.0
env1_sustain = 0.4
env1_release = 2.5
env1_attackCurve = 0.2

env2_attack = 0.9
env2_decay = 1.0
env2_sustain = 1.0
env2_release = 3.2
env2_attackCurve = 0.3
env2_velocity = 0.3

env3_attack = 3.0
env3_decay = 4.0
env3_sustain = 0.3
env3_release = 3.0
env3_trigger = LFO3

# LFOs (all slow)
lfo1_shape = Sine
lfo1_rate = 0.08
lfo1_fadeIn = 2.0
lfo1_keyTrigger = 0
lfo2_shape = Triangle
lfo2_rate = 0.21
lfo2_keyTrigger = 0
lfo3_shape = SmoothRandom
lfo3_rate = 0.3
lfo3_smooth = 0.6

# control tracks: gentle, smoothed into curves
ctA_on = 1
ctA_length = 8
ctA_sync = 1
ctA_div = 1/2
ctA_smooth = 0.9
ctA_direction = PingPong
ctA_steps = [0.2, 0.5, 0.1, 0.7, 0.3, 0.6, 0.0, 0.4]
ctA_dest = fltA_cutoff
ctA_destAmount = 0.35

ctB_on = 1
ctB_length = 6
ctB_sync = 1
ctB_div = 1 bar
ctB_smooth = 1.0
ctB_direction = Forward
ctB_steps = [0.0, 0.4, 0.8, 0.5, 0.9, 0.2]
ctB_dest = osc3_wtPosition
ctB_destAmount = 0.4

# mod matrix
mod1 = LFO1 > osc3_wtPosition, 0.3
mod2 = LFO2 > osc2_pan, 0.25
mod3 = LFO2 > fltA_cutoff, 0.08, via ModWheel
mod4 = Env3 > fltB_cutoff, 0.2
mod5 = LFO3 > osc3_duoDetune, 0.15
mod6 = Macro1 > fltA_cutoff, 0.6
mod7 = Macro1 > fltB_cutoff, 0.4
mod8 = Macro2 > ctA_depth, 0.5
mod9 = Macro2 > lfo1_depth, 0.5
mod10 = Macro3 > reverb_mix, 0.4
mod11 = Macro3 > delay_mix, 0.2
mod12 = Macro4 > vintage, 0.5
mod13 = Macro4 > fltA_drive, 0.4
mod14 = Aftertouch > fltA_cutoff, 0.3
mod15 = Velocity > fltA_cutoff, 0.15

# effects: EQ is what makes it sit behind
eq_on = 1
eq_lowGain = -2
eq_lowFreq = 120
eq_midGain = -3
eq_midFreq = 900
eq_midQ = 0.8
eq_highGain = -1.5
eq_highFreq = 8000

chorus_on = 1
chorus_mode = I+II
chorus_depth = 0.35
chorus_mix = 0.3

delay_on = 1
delay_mode = Dual
delay_sync = 1
delay_divL = 1/4D
delay_divR = 1/2
delay_feedback = 0.35
delay_modRate = 0.25
delay_modDepth = 0.25
delay_highCut = 4500
delay_duck = 0.4
delay_mix = 0.18

reverb_on = 1
reverb_algo = Space
reverb_size = 0.75
reverb_decay = 9
reverb_predelay = 40
reverb_damp = 0.6
reverb_modRate = 0.3
reverb_modDepth = 0.4
reverb_lowCut = 150
reverb_mix = 0.38
```

Metadata: author "Wayfarer", category Pad, tags "motion, wide, cinematic, background".

---

## 2. Glass Tide — Pad

Brighter, glassier companion to Horizon Bed for when the pad is the feature.

```
voices = 8
unisonVoices = 2
unisonDetune = 9
vintage = 0.2
osc1_on = 1
osc1_wave = 0.25
osc1_octave = 1
osc1_level = 0.4
osc2_on = 1
osc2_wave = 0.5
osc2_super = 1
osc2_superDetune = 24
osc2_superSpread = 1.0
osc2_level = 0.7
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Bell Partials 02"
osc3_wtPosition = 0.35
osc3_level = 0.4
fltA_type = Ladder12
fltA_cutoff = 2200
fltA_res = 0.25
fltA_envAmt = 0.3
fltA_keytrack = 0.7
filterStereoOffset = 2
env1_attack = 2.0
env1_decay = 3.0
env1_sustain = 0.5
env1_release = 3.0
env2_attack = 1.4
env2_sustain = 1
env2_release = 4.0
lfo1_shape = Sine
lfo1_rate = 0.12
lfo1_keyTrigger = 0
mod1 = LFO1 > osc3_wtPosition, 0.4
mod2 = LFO1 > osc1_pan, 0.3
mod3 = Macro1 > fltA_cutoff, 0.6
mod4 = Macro2 > lfo1_depth, 0.6
mod5 = Macro3 > reverb_mix, 0.4
mod6 = Macro4 > vintage, 0.6
chorus_on = 1
chorus_mode = I
chorus_mix = 0.35
reverb_on = 1
reverb_algo = Hall
reverb_decay = 6
reverb_mix = 0.35
masterVolume = -8
```

---

## 3. Low Orbit — Pad

Dark, sub-heavy pad for underscoring. Mono-compatible low end, stereo top.

```
voices = 6
osc1_on = 1
osc1_wave = 0.5
osc1_octave = -2
osc1_level = 0.8
osc2_on = 1
osc2_wave = 0.0          # sine
osc2_octave = -2
osc2_level = 0.6
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Spectral Tilt 01"
osc3_duo = 1
osc3_duoSpread = 1.0
osc3_octave = 0
osc3_level = 0.35
fltA_type = Ladder24
fltA_cutoff = 400
fltA_res = 0.3
fltA_drive = 6
fltA_envAmt = 0.4
env1_attack = 3.0
env1_decay = 5.0
env1_sustain = 0.3
env1_release = 4.0
env2_attack = 2.0
env2_sustain = 1
env2_release = 5.0
ctA_on = 1
ctA_length = 4
ctA_div = 1 bar
ctA_smooth = 1.0
ctA_steps = [0.0, 0.6, 0.3, 0.9]
ctA_dest = fltA_cutoff
ctA_destAmount = 0.3
mod1 = Macro1 > fltA_cutoff, 0.7
mod2 = Macro2 > ctA_depth, 0.7
mod3 = Macro3 > reverb_mix, 0.5
mod4 = Macro4 > fltA_drive, 0.6
reverb_on = 1
reverb_algo = Space
reverb_decay = 12
reverb_lowCut = 200
reverb_mix = 0.3
masterVolume = -6
```

---

## 4. Vapour Choir — Pad

Formant wavetable "voices" with slow vowel motion.

```
voices = 8
unisonVoices = 2
unisonDetune = 7
osc1_on = 0
osc2_on = 1
osc2_wave = 0.35
osc2_super = 1
osc2_superDetune = 12
osc2_superSpread = 0.8
osc2_level = 0.5
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Vowel Sweep 01"
osc3_wtPosition = 0.1
osc3_duo = 1
osc3_duoDetune = 6
osc3_duoSpread = 0.9
osc3_level = 0.8
fltA_type = NJM24
fltA_cutoff = 3000
fltA_res = 0.15
env2_attack = 1.2
env2_release = 3.5
env2_sustain = 1
lfo1_shape = Triangle
lfo1_rate = 0.06
lfo1_keyTrigger = 0
mod1 = LFO1 > osc3_wtPosition, 0.6
mod2 = ModWheel > osc3_wtPosition, 0.5
mod3 = Macro1 > fltA_cutoff, 0.5
mod4 = Macro2 > lfo1_rate, 0.6
mod5 = Macro3 > reverb_mix, 0.4
mod6 = Macro4 > osc3_duoDetune, 0.5
chorus_on = 1
chorus_mode = II
chorus_mix = 0.3
reverb_on = 1
reverb_algo = Hall
reverb_size = 0.8
reverb_decay = 7
reverb_mix = 0.4
masterVolume = -7
```

---

## 5. Sync Bass — Bass

Punchy Osc 1 hard-sync bass with a swept sync envelope.

```
voiceMode = Mono
glideMode = Legato
glideTime = 0.06
osc1_on = 1
osc1_wave = 0.6
osc1_octave = -1
osc1_sync = 1
osc1_level = 0.9
osc2_on = 1
osc2_wave = 0.5
osc2_octave = -2
osc2_level = 0.5
fltA_type = Ladder24
fltA_cutoff = 500
fltA_res = 0.2
fltA_drive = 8
fltA_envAmt = 0.6
env1_attack = 0.002
env1_decay = 0.35
env1_sustain = 0.1
env1_release = 0.2
env2_attack = 0.002
env2_decay = 0.5
env2_sustain = 0.8
env2_release = 0.15
env3_attack = 0.001
env3_decay = 0.25
env3_sustain = 0.0
env3_release = 0.1
mod1 = Env3 > osc1_pitch, 0.7        # sync sweep: master stays, slave pitch sweeps
mod2 = Velocity > fltA_cutoff, 0.4
mod3 = Macro1 > fltA_cutoff, 0.7
mod4 = Macro2 > env3_decay, 0.5
mod5 = Macro4 > fltA_drive, 0.7
eq_on = 1
eq_lowGain = 2
eq_lowFreq = 70
masterVolume = -6
```

---

## 6. Deep Round — Bass

Clean sine-plus-triangle sub for the bottom of a track.

```
voiceMode = Mono
glideMode = Always
glideTime = 0.03
osc1_on = 1
osc1_wave = 0.0
osc1_octave = -2
osc1_level = 1.0
osc2_on = 1
osc2_wave = 0.2
osc2_octave = -1
osc2_level = 0.3
fltA_type = Ladder12
fltA_cutoff = 300
fltA_envAmt = 0.3
env1_decay = 0.2
env1_sustain = 0.2
env2_attack = 0.003
env2_release = 0.12
env2_velocity = 0.6
mod1 = Macro1 > fltA_cutoff, 0.6
mod2 = Macro4 > osc2_level, 0.6
masterVolume = -4
```

---

## 7. Analogue Grit — Bass

OTA filter driven hard, Super stack for width, mono with glide.

```
voiceMode = Mono
glideMode = Legato
glideTime = 0.08
vintage = 0.5
osc1_on = 1
osc1_wave = 0.7
osc1_octave = -1
osc1_level = 0.8
osc2_on = 1
osc2_wave = 0.55
osc2_octave = -1
osc2_super = 1
osc2_superDetune = 15
osc2_superSpread = 0.5
osc2_level = 0.6
noise_level = 0.05
fltA_type = NJM24
fltA_cutoff = 700
fltA_res = 0.45
fltA_drive = 14
fltA_envAmt = 0.5
env1_decay = 0.4
env1_sustain = 0.2
env2_attack = 0.004
env2_decay = 0.4
env2_sustain = 0.9
env2_release = 0.2
mod1 = Velocity > fltA_cutoff, 0.5
mod2 = Macro1 > fltA_cutoff, 0.7
mod3 = Macro4 > fltA_drive, 0.5
mod4 = Macro4 > fltA_res, 0.3
masterVolume = -6
```

---

## 8. Solaris Lead — Lead

Classic detuned lead with vibrato on aftertouch and a delay throw.

```
voiceMode = Legato
glideMode = Legato
glideTime = 0.12
unisonVoices = 3
unisonDetune = 14
unisonSpread = 0.4
vintage = 0.35
osc1_on = 1
osc1_wave = 0.6
osc1_level = 0.8
osc2_on = 1
osc2_wave = 0.6
osc2_fine = 7
osc2_level = 0.8
osc3_on = 1
osc3_wave = 0.6
osc3_octave = -1
osc3_level = 0.4
fltA_type = Ladder24
fltA_cutoff = 1800
fltA_res = 0.2
fltA_drive = 4
fltA_envAmt = 0.4
fltA_keytrack = 0.6
env1_decay = 0.5
env1_sustain = 0.5
env2_attack = 0.01
env2_sustain = 1
env2_release = 0.4
lfo1_shape = Sine
lfo1_rate = 5.5
lfo1_fadeIn = 0.4
mod1 = Aftertouch > lfo1_depth, 1.0
mod2 = LFO1 > osc1_pitch, 0.08
mod3 = LFO1 > osc2_pitch, 0.08
mod4 = LFO1 > osc3_pitch, 0.08
mod5 = ModWheel > fltA_cutoff, 0.4
mod6 = Macro1 > fltA_cutoff, 0.6
mod7 = Macro3 > delay_mix, 0.4
mod8 = Macro4 > unisonDetune, 0.5
delay_on = 1
delay_mode = PingPong
delay_divL = 1/8D
delay_divR = 1/8D
delay_feedback = 0.45
delay_mix = 0.25
reverb_on = 1
reverb_algo = Hall
reverb_decay = 2.5
reverb_mix = 0.2
masterVolume = -8
```

---

## 9. Wire Lead — Lead

Osc 1 exponential FM from Osc 3 for a hard, metallic mono lead.

```
voiceMode = Mono
glideMode = Always
glideTime = 0.05
osc1_on = 1
osc1_wave = 0.0
osc1_fmSource = Osc3
osc1_fmExp = 0.35
osc1_level = 0.9
osc3_on = 1
osc3_wave = 0.0
osc3_octave = 1
osc3_semi = 7
osc3_level = 0.0            # FM source only, not heard
fltA_type = NJM12
fltA_cutoff = 4000
fltA_res = 0.1
env1_decay = 0.3
env1_sustain = 0.4
env2_attack = 0.005
env2_release = 0.3
env3_attack = 0.001
env3_decay = 0.4
env3_sustain = 0.2
mod1 = Env3 > osc1_fmExp, 0.5
mod2 = Velocity > osc1_fmExp, 0.3
mod3 = Macro1 > fltA_cutoff, 0.5
mod4 = Macro4 > osc1_fmExp, 0.5
delay_on = 1
delay_mode = Dual
delay_divL = 1/8
delay_divR = 1/4
delay_feedback = 0.3
delay_mix = 0.2
masterVolume = -8
```

---

## 10. Felt Keys — Keys

Soft electric-piano style keys from wavetable Osc 3 plus a sine.

```
voices = 12
osc1_on = 1
osc1_wave = 0.0
osc1_level = 0.5
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Additive Harmonic 04"
osc3_wtPosition = 0.15
osc3_level = 0.8
fltA_type = Ladder12
fltA_cutoff = 2500
fltA_keytrack = 1.0
fltA_envAmt = 0.35
fltA_velAmt = 0.5
env1_attack = 0.002
env1_decay = 0.9
env1_sustain = 0.1
env1_release = 0.5
env2_attack = 0.002
env2_decay = 2.5
env2_sustain = 0.4
env2_release = 0.6
env2_velocity = 0.7
mod1 = Velocity > osc3_wtPosition, 0.3
mod2 = Macro1 > fltA_cutoff, 0.5
mod3 = Macro3 > reverb_mix, 0.4
chorus_on = 1
chorus_mode = I
chorus_mix = 0.25
reverb_on = 1
reverb_algo = Room
reverb_decay = 1.2
reverb_mix = 0.2
masterVolume = -8
```

---

## 11. Drawbar Glow — Keys

Organ-style additive table with a slow chorus and Vintage wobble.

```
voices = 12
vintage = 0.4
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Organ Drawbars 02"
osc3_wtPosition = 0.3
osc3_level = 0.9
osc1_on = 1
osc1_wave = 0.0
osc1_octave = -1
osc1_level = 0.4
fltA_type = Ladder6
fltA_cutoff = 6000
env2_attack = 0.005
env2_sustain = 1
env2_release = 0.08
mod1 = ModWheel > osc3_wtPosition, 0.6
mod2 = Macro1 > osc3_wtPosition, 0.6
mod3 = Macro3 > reverb_mix, 0.4
chorus_on = 1
chorus_mode = I+II
chorus_mix = 0.4
reverb_on = 1
reverb_algo = Room
reverb_mix = 0.15
masterVolume = -8
```

---

## 12. Rain Pluck — Pluck

Short OTA pluck with ping-pong delay, made for arpeggios.

```
voices = 16
osc1_on = 1
osc1_wave = 0.45
osc1_level = 0.8
osc2_on = 1
osc2_wave = 0.45
osc2_octave = 1
osc2_fine = 5
osc2_level = 0.4
fltA_type = NJM24
fltA_cutoff = 600
fltA_res = 0.3
fltA_envAmt = 0.7
fltA_keytrack = 0.5
fltA_velAmt = 0.4
env1_attack = 0.001
env1_decay = 0.25
env1_sustain = 0.0
env1_release = 0.25
env2_attack = 0.001
env2_decay = 0.6
env2_sustain = 0.0
env2_release = 0.4
mod1 = Macro1 > fltA_cutoff, 0.6
mod2 = Macro3 > delay_mix, 0.5
mod3 = Macro4 > fltA_res, 0.5
delay_on = 1
delay_mode = PingPong
delay_divL = 1/8D
delay_divR = 1/8D
delay_feedback = 0.5
delay_highCut = 5000
delay_mix = 0.3
reverb_on = 1
reverb_algo = Hall
reverb_decay = 3
reverb_mix = 0.2
masterVolume = -8
```

---

## 13. Marimba Wire — Pluck

Linear FM bell-pluck. Velocity controls FM amount so it goes from wood to glass.

```
voices = 16
osc1_on = 1
osc1_wave = 0.0
osc1_fmSource = Osc2
osc1_fmLin = 0.2
osc1_level = 0.9
osc2_on = 1
osc2_wave = 0.0
osc2_octave = 2
osc2_level = 0.0
fltA_type = Ladder12
fltA_cutoff = 8000
env2_attack = 0.001
env2_decay = 1.2
env2_sustain = 0.0
env2_release = 0.8
env3_attack = 0.001
env3_decay = 0.3
env3_sustain = 0.0
mod1 = Env3 > osc1_fmLin, 0.5
mod2 = Velocity > osc1_fmLin, 0.4
mod3 = Macro4 > osc1_fmLin, 0.5
mod4 = Macro3 > reverb_mix, 0.5
reverb_on = 1
reverb_algo = Hall
reverb_decay = 4
reverb_mix = 0.3
masterVolume = -8
```

---

## 14. Nightdrive — Sequence

Arpeggiated 16th sequence with a Control Track filter groove and step envelopes.

```
voices = 8
vintage = 0.25
osc1_on = 1
osc1_wave = 0.6
osc1_octave = -1
osc1_level = 0.8
osc2_on = 1
osc2_wave = 0.7
osc2_octave = -1
osc2_fine = -6
osc2_level = 0.6
fltA_type = Ladder24
fltA_cutoff = 500
fltA_res = 0.3
fltA_drive = 5
fltA_envAmt = 0.5
env1_attack = 0.001
env1_decay = 0.2
env1_sustain = 0.1
env2_attack = 0.001
env2_decay = 0.3
env2_sustain = 0.4
env2_release = 0.15
arp_on = 1
arp_mode = Up
arp_div = 1/16
arp_octaves = 2
arp_gate = 0.6
arp_swing = 0.12
arp_velMode = Step
arp_steps = 8
arp_stepVel1 = 1.0
arp_stepVel2 = 0.6
arp_stepVel3 = 0.8
arp_stepVel4 = 0.6
arp_stepVel5 = 0.9
arp_stepVel6 = 0.6
arp_stepVel7 = 0.7
arp_stepVel8 = 0.5
arp_stepEnv1 = -0.5
arp_stepEnv5 = 0.4
arp_stepTie7 = 1
ctA_on = 1
ctA_length = 16
ctA_div = 1/16
ctA_smooth = 0.15
ctA_swing = 0.12
ctA_steps = [0.8, 0.2, 0.5, 0.1, 0.9, 0.3, 0.6, 0.0, 0.7, 0.2, 0.4, 0.1, 1.0, 0.3, 0.5, 0.2]
ctA_dest = fltA_cutoff
ctA_destAmount = 0.5
mod1 = Velocity > fltA_cutoff, 0.4
mod2 = Macro1 > fltA_cutoff, 0.6
mod3 = Macro2 > ctA_depth, 0.8
mod4 = Macro3 > delay_mix, 0.4
mod5 = Macro4 > fltA_drive, 0.6
delay_on = 1
delay_mode = PingPong
delay_divL = 1/8D
delay_divR = 1/8D
delay_feedback = 0.4
delay_duck = 0.5
delay_mix = 0.2
masterVolume = -8
```

---

## 15. Pad Under, Pulse Over — Sequence

Arp oscillator targeting: Osc 2 holds the chord as a pad while Osc 1 arpeggiates.

```
voices = 16
osc1_on = 1
osc1_wave = 0.5
osc1_level = 0.7
osc2_on = 1
osc2_wave = 0.4
osc2_octave = -1
osc2_super = 1
osc2_superDetune = 16
osc2_superSpread = 0.9
osc2_level = 0.6
fltA_type = Ladder24
fltA_cutoff = 1200
fltA_res = 0.2
fltA_envAmt = 0.3
fltB_on = 1
fltB_type = NJM12
fltB_cutoff = 1500
filterRouting = Split
filterStereoOffset = 2
env1_decay = 0.3
env1_sustain = 0.3
env2_attack = 0.005
env2_decay = 0.5
env2_sustain = 0.7
env2_release = 1.5
arp_on = 1
arp_mode = UpDownExc
arp_div = 1/8
arp_octaves = 2
arp_gate = 0.5
arp_target = Osc1
lfo1_shape = Sine
lfo1_rate = 0.1
lfo1_keyTrigger = 0
mod1 = LFO1 > osc2_pan, 0.3
mod2 = Macro1 > fltA_cutoff, 0.6
mod3 = Macro2 > arp_gate, 0.5
mod4 = Macro3 > reverb_mix, 0.5
delay_on = 1
delay_divL = 1/8D
delay_divR = 1/4
delay_feedback = 0.35
delay_mix = 0.2
reverb_on = 1
reverb_algo = Hall
reverb_decay = 5
reverb_mix = 0.3
masterVolume = -8
```

---

## 16. Tidal Motion — Motion

Both Control Tracks in ping-pong at different lengths driving wavetable position
and pan, so the pattern never repeats exactly. Hold one note.

```
voices = 4
unisonVoices = 3
unisonDetune = 10
unisonSpread = 1.0
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "FM Scan 03"
osc3_duo = 1
osc3_duoSpread = 1.0
osc3_level = 0.9
osc1_on = 1
osc1_wave = 0.0
osc1_octave = -1
osc1_level = 0.4
fltA_type = Ladder12
fltA_cutoff = 1500
fltA_res = 0.2
env2_attack = 0.5
env2_sustain = 1
env2_release = 2.0
ctA_on = 1
ctA_length = 7
ctA_div = 1/8
ctA_smooth = 0.6
ctA_direction = PingPong
ctA_steps = [0.0, 0.3, 0.7, 1.0, 0.5, 0.2, 0.8]
ctA_dest = osc3_wtPosition
ctA_destAmount = 0.8
ctB_on = 1
ctB_length = 5
ctB_div = 1/4
ctB_smooth = 0.8
ctB_direction = PingPong
ctB_steps = [-0.8, 0.4, -0.2, 0.9, -0.6]
ctB_dest = osc3_pan
ctB_destAmount = 0.7
mod1 = CtrlA > fltA_cutoff, 0.3
mod2 = Macro1 > fltA_cutoff, 0.6
mod3 = Macro2 > ctA_smooth, -0.6
mod4 = Macro3 > reverb_mix, 0.5
delay_on = 1
delay_divL = 1/8D
delay_divR = 1/4D
delay_feedback = 0.4
delay_modDepth = 0.4
delay_mix = 0.25
reverb_on = 1
reverb_algo = Space
reverb_decay = 8
reverb_mix = 0.3
masterVolume = -8
```

---

## 17. Breathing Machine — Motion

Env 3 retriggered by LFO 2 shapes the filter rhythmically; random Control Track
adds per-cycle variation.

```
voices = 6
osc1_on = 1
osc1_wave = 0.65
osc1_level = 0.8
osc2_on = 1
osc2_wave = 0.65
osc2_octave = -1
osc2_fine = 4
osc2_level = 0.6
fltA_type = NJM24
fltA_cutoff = 300
fltA_res = 0.4
fltA_drive = 6
env2_attack = 0.3
env2_sustain = 1
env2_release = 1.0
env3_attack = 0.01
env3_decay = 0.35
env3_sustain = 0.0
env3_trigger = LFO2
lfo2_shape = Square
lfo2_sync = 1
lfo2_div = 1/8
lfo2_keyTrigger = 1
ctA_on = 1
ctA_length = 8
ctA_div = 1/8
ctA_random = 0.5
ctA_steps = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
ctA_dest = env3_decay
ctA_destAmount = 0.5
mod1 = Env3 > fltA_cutoff, 0.7
mod2 = Macro1 > fltA_cutoff, 0.5
mod3 = Macro2 > ctA_random, 0.8
mod4 = Macro4 > fltA_drive, 0.6
delay_on = 1
delay_mode = PingPong
delay_divL = 1/16
delay_divR = 1/16
delay_feedback = 0.3
delay_mix = 0.15
masterVolume = -8
```

---

## 18. Ice Sheet — FX

Slow-rising noise and wavetable texture with Space reverb. Sound-design riser.

```
voices = 2
osc1_on = 0
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Noise Shaped 01"
osc3_duo = 1
osc3_duoDetune = 30
osc3_duoSpread = 1.0
osc3_level = 0.7
noise_level = 0.6
noise_colour = 0.4
fltA_type = Ladder24
fltA_cutoff = 200
fltA_res = 0.5
fltA_envAmt = 0.9
env1_attack = 6.0
env1_decay = 2.0
env1_sustain = 1.0
env1_release = 4.0
env2_attack = 4.0
env2_sustain = 1
env2_release = 6.0
lfo1_shape = Drift
lfo1_rate = 0.5
lfo1_smooth = 0.7
mod1 = LFO1 > osc3_wtPosition, 0.6
mod2 = LFO1 > fltA_res, 0.2
mod3 = Macro1 > fltA_cutoff, 0.8
mod4 = Macro2 > env1_attack, -0.7
mod5 = Macro3 > reverb_decay, 0.6
delay_on = 1
delay_mode = Dual
delay_sync = 0
delay_timeL = 410
delay_timeR = 620
delay_feedback = 0.6
delay_modDepth = 0.6
delay_mix = 0.3
reverb_on = 1
reverb_algo = Space
reverb_size = 1.0
reverb_decay = 20
reverb_modDepth = 0.6
reverb_mix = 0.5
masterVolume = -10
```

---

## 19. Drop Tone — FX

Pitch-drop hit with a big sync sweep and reverb tail. Play single notes.

```
voiceMode = Mono
osc1_on = 1
osc1_wave = 0.7
osc1_sync = 1
osc1_level = 1.0
osc2_on = 1
osc2_wave = 0.5
osc2_octave = -1
osc2_level = 0.6
fltA_type = Ladder24
fltA_cutoff = 3000
fltA_res = 0.3
fltA_drive = 10
env2_attack = 0.001
env2_decay = 2.5
env2_sustain = 0.0
env2_release = 1.0
env3_attack = 0.001
env3_decay = 1.8
env3_sustain = 0.0
mod1 = Env3 > osc1_pitch, 1.0
mod2 = Env3 > osc2_pitch, 0.5
mod3 = Env3 > fltA_cutoff, 0.6
mod4 = Macro4 > fltA_drive, 0.6
mod5 = Macro3 > reverb_mix, 0.5
reverb_on = 1
reverb_algo = Hall
reverb_decay = 6
reverb_mix = 0.4
masterVolume = -8
```

---

## 20. Tectonic — Drone

Sub-octave drone with slowly rotating OTA filter and Vintage instability.

```
voiceMode = Mono
unisonVoices = 4
unisonDetune = 5
unisonSpread = 1.0
vintage = 0.6
osc1_on = 1
osc1_wave = 0.6
osc1_octave = -2
osc1_level = 0.8
osc2_on = 1
osc2_wave = 0.6
osc2_octave = -3
osc2_level = 0.6
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Phase Distortion 02"
osc3_octave = -1
osc3_level = 0.4
fltA_type = NJM24
fltA_cutoff = 250
fltA_res = 0.5
fltA_drive = 8
fltB_on = 1
fltB_type = Ladder12
fltB_cutoff = 1200
filterRouting = Parallel
filterBalance = -0.4
filterStereoOffset = 5
env2_attack = 2.0
env2_sustain = 1
env2_release = 6.0
lfo1_shape = Sine
lfo1_rate = 0.03
lfo1_keyTrigger = 0
lfo2_shape = Drift
lfo2_rate = 0.2
lfo2_smooth = 0.8
mod1 = LFO1 > fltA_cutoff, 0.5
mod2 = LFO2 > osc3_wtPosition, 0.5
mod3 = LFO2 > fltB_cutoff, 0.2
mod4 = Macro1 > fltA_cutoff, 0.6
mod5 = Macro2 > lfo1_rate, 0.5
mod6 = Macro3 > reverb_mix, 0.5
mod7 = Macro4 > vintage, 0.4
reverb_on = 1
reverb_algo = Space
reverb_decay = 15
reverb_lowCut = 120
reverb_mix = 0.3
masterVolume = -6
```

---

## 21. Halo Drone — Drone

High, shimmering drone from Duo wavetables and Space reverb pitch drift.

```
voices = 4
unisonVoices = 2
unisonDetune = 4
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Bell Partials 04"
osc3_octave = 1
osc3_duo = 1
osc3_duoDetune = 12
osc3_duoSpread = 1.0
osc3_level = 0.8
osc1_on = 1
osc1_wave = 0.0
osc1_level = 0.3
fltA_type = Ladder6
fltA_cutoff = 5000
env2_attack = 3.0
env2_sustain = 1
env2_release = 8.0
lfo1_shape = SmoothRandom
lfo1_rate = 0.15
lfo1_keyTrigger = 0
mod1 = LFO1 > osc3_wtPosition, 0.5
mod2 = LFO1 > osc3_pan, 0.4
mod3 = Macro2 > lfo1_depth, 0.6
mod4 = Macro3 > reverb_decay, 0.7
chorus_on = 1
chorus_mode = II
chorus_mix = 0.3
reverb_on = 1
reverb_algo = Space
reverb_size = 0.9
reverb_decay = 25
reverb_modDepth = 0.7
reverb_mix = 0.55
masterVolume = -10
```

---

## 22. Init Motion — Template

A clean starting point with the macro routing and both Control Tracks already
wired, so new motion patches start from something musical.

```
osc1_on = 1
osc1_wave = 0.5
osc1_level = 0.8
fltA_type = Ladder24
fltA_cutoff = 2000
fltA_envAmt = 0.3
env1_decay = 0.5
env1_sustain = 0.5
env2_attack = 0.01
env2_sustain = 1
env2_release = 0.4
ctA_on = 1
ctA_length = 8
ctA_div = 1/8
ctA_smooth = 0.3
ctA_dest = fltA_cutoff
ctA_destAmount = 0.0
ctB_on = 1
ctB_length = 8
ctB_div = 1/4
ctB_smooth = 0.5
ctB_dest = osc1_pan
ctB_destAmount = 0.0
mod1 = Macro1 > fltA_cutoff, 0.6
mod2 = Macro2 > ctA_destAmount, 0.6
mod3 = Macro3 > reverb_mix, 0.5
mod4 = Macro4 > vintage, 0.5
reverb_on = 1
reverb_algo = Hall
reverb_mix = 0.2
masterVolume = -6
```

---

## Notes for PresetGen (prompt 12)

- Implement a small parser for this file's `id = value`, `modK = ...`,
  `ctX_steps = [...]` and `osc3_wavetable = "name"` lines so the bank is regenerated
  from this document, and unit-test that all 22 load and render.
- `ctA_destAmount` used as a mod destination in preset 22 is not in the `M` list.
  Add it (and `ctB_destAmount`) to `ModDestinations` in prompt 12 as a documented
  addition; this is allowed because IDs are only added, never renamed.
- Where a preset sets a per-step parameter by explicit ID (`arp_stepVel3`), the
  parser handles it as a normal `id = value`.

---

# PART 5: BUILD PROMPTS

---

# Prompt 01 — Project scaffold

You are building **Wayfarer**, a hybrid VA/wavetable synthesizer plugin in C++20 with
JUCE 8, for Windows (VST3 + Standalone). The design spec is in `docs/SPEC.md` and the
parameter map is in `docs/PARAMETERS.md`. Read both fully before writing anything.

This session creates the project skeleton, gets a clean Release build, and installs
the VST3 so it loads in a DAW. No synthesis yet beyond a test tone.

## Deliverables

1. `CMakeLists.txt` at the root:
   - `cmake_minimum_required(VERSION 3.28)`, project `Wayfarer` VERSION 0.1.0, C++20.
   - JUCE 8.0.9 via `FetchContent` from `https://github.com/juce-framework/JUCE.git`
     tag `8.0.9`. Honour `FETCHCONTENT_SOURCE_DIR_JUCE` so an offline clone works.
   - `juce_add_plugin(Wayfarer ...)` with `COMPANY_NAME "Wayfarer"`,
     `PLUGIN_MANUFACTURER_CODE Wayf`, `PLUGIN_CODE Wyfr`, `IS_SYNTH TRUE`,
     `NEEDS_MIDI_INPUT TRUE`, `FORMATS VST3 Standalone`, `PRODUCT_NAME "Wayfarer"`,
     `COPY_PLUGIN_AFTER_BUILD TRUE`, `VST3_CATEGORIES Instrument Synth`.
   - Link `juce::juce_audio_utils`, `juce::juce_dsp`, `juce::juce_audio_plugin_client`
     and the recommended config/warning flags. Define `JUCE_WEB_BROWSER=0`,
     `JUCE_USE_CURL=0`, `JUCE_VST3_CAN_REPLACE_VST2=0`, `JUCE_DISPLAY_SPLASH_SCREEN=0`.
   - MSVC: add `/bigobj`, `/MP`, and `/fp:fast` for Release. Set
     `CMAKE_MSVC_RUNTIME_LIBRARY` to static (`MultiThreaded$<$<CONFIG:Debug>:Debug>`).
   - A `WayfarerTests` console executable (`add_subdirectory(tests)`) linking the
     same sources via an object/static library `WayfarerCore` so DSP is testable
     without the plugin wrapper. Use a tiny header-only test harness (a `CHECK`
     macro and a registry), no external test framework.
   - `add_subdirectory(src)` and `add_subdirectory(tests)`.
2. Source layout (create empty but compiling files where later prompts will fill in):
   ```
   src/PluginProcessor.h/.cpp
   src/PluginEditor.h/.cpp        (placeholder: a label and a resizable window)
   src/core/Params.h/.cpp         (parameter layout; this prompt: masterVolume only)
   src/core/ModDestinations.h     (empty table for now)
   src/dsp/                       (empty)
   src/engine/                    (empty)
   src/fx/                        (empty)
   src/ui/                        (empty)
   tests/main.cpp, tests/TestHarness.h
   ```
3. `PluginProcessor` must:
   - Own a `juce::AudioProcessorValueTreeState` built from `Params::createLayout()`.
   - In `processBlock`, use `juce::ScopedNoDenormals`, produce a -18 dBFS 220 Hz
     sine while any MIDI note is held (simple gate, no envelope), scaled by
     `masterVolume`. This proves MIDI in, audio out, parameter read.
   - Implement `getStateInformation` / `setStateInformation` with the APVTS tree.
   - Report tail length 0 and be instantiable with any block size.
4. `CLAUDE.md` at the root, containing: what the project is, the file layout, the
   build and test commands below, the rule that `docs/SPEC.md` and `docs/PARAMETERS.md`
   are authoritative, the audio-thread rules (no allocation, locks or logging after
   `prepareToPlay`; `ScopedNoDenormals`; parameters read through cached
   `std::atomic<float>*` pointers), and the coding conventions (C++20, `juce::`
   prefixes, no `using namespace`, one class per file, `[[nodiscard]]` on pure getters).
5. `.gitignore` for `build*/`, `*.user`, `.vs/`, `_deps/`.
6. `README.md` with the same build instructions.

## Build and verify

```bat
cmake -B build -G "Visual Studio 17 2022" -A x64
cmake --build build --config Release --target Wayfarer_VST3 Wayfarer_Standalone WayfarerTests
build\tests\Release\WayfarerTests.exe
```

Run all of it. Fix every warning that comes from our own code. If the copy step to
`C:\Program Files\Common Files\VST3` fails, say so and tell me to re-run the
terminal as Administrator rather than silently skipping it.

## Done when

- Release build of VST3, Standalone and tests completes with zero errors.
- `WayfarerTests.exe` runs and reports at least one passing test (a smoke test that
  instantiates the processor, calls `prepareToPlay(48000, 128)`, sends a note-on and
  gets non-zero output).
- `Wayfarer.vst3` exists in `C:\Program Files\Common Files\VST3`.
- Standalone launches, shows the placeholder window, and plays a tone from a MIDI keyboard.
- `CLAUDE.md` exists and is accurate.
- Everything is committed: `git add -A && git commit -m "Scaffold Wayfarer JUCE project"`.

---

# Prompt 02 — Parameters, state and preset files

Read `CLAUDE.md`, `docs/SPEC.md` and `docs/PARAMETERS.md`. This session defines the
**entire** parameter tree up front so that later sessions never rename IDs, and adds
preset save/load. There is still no real synthesis.

## Deliverables

1. `src/core/Params.h/.cpp`: `Params::createLayout()` returns a
   `ParameterLayout` containing **every** parameter in `docs/PARAMETERS.md`, with the
   exact IDs, ranges, defaults, skew (log ranges use `NormalisableRange` with a
   skew or a lambda mapping) and choice lists. Generate repetitive groups
   (`oscN_`, `fltX_`, `envN_`, `lfoN_`, `modK_`, `ctX_stepS`, `arp_stepS`) with helper
   functions, not copy-paste. Use `juce::AudioProcessorParameterGroup` so hosts show
   sections. Every parameter gets a readable name and, where relevant, a unit label
   and value-to-text function (dB, Hz, ms/s, %, semitones, note divisions).
2. `src/core/ParamIds.h`: `constexpr` string constants and small helpers
   (`oscId(n, "wave")`, `stepId("ctA", s)`) so no ID is ever typed twice.
3. `src/core/ModDestinations.h/.cpp`: a single constexpr table listing every `M`
   parameter from `docs/PARAMETERS.md` in file order with its ID, display name and
   modulation range semantics (bipolar range in parameter units; e.g. cutoff is
   modulated in octaves, pitch in semitones, levels in 0..1). Provide
   `ModDestinations::count()`, `id(i)`, `name(i)`, and a `juce::StringArray` for the
   choice parameters. `modK_dest` and `ctX_dest` must be built from this table.
   Add a static assertion or startup test that the count is at least 92.
4. `src/core/ModSources.h`: enum + names for the source list in the spec.
5. `src/core/PresetManager.h/.cpp`:
   - Preset = the APVTS state plus metadata (name, author, category, tags, comment),
     the MIDI learn map, and the Osc 3 user wavetable file name.
   - File format: JSON via `juce::JSON`, extension `.wayfarer`, version field.
   - Factory presets: read from `BinaryData` (empty list for now, prompt 12 fills it).
   - User presets: `%APPDATA%\Wayfarer\Presets\<Category>\<Name>.wayfarer`.
     Create the folders on first run. Provide list / load / save / delete / rename,
     next / previous, and "init" preset.
   - Loading a preset must be click-free: apply on the message thread via
     `APVTS::replaceState` and have the processor pick up changes through parameter
     listeners / smoothed values, never by touching DSP objects from the UI thread.
6. `PluginProcessor`: state save/load now includes the metadata and learn map
   (use a child `ValueTree` named `Meta` and `MidiLearn`). Keep the test tone.
7. Tests: (a) every parameter ID in `docs/PARAMETERS.md` exists in the layout
   (write the test to parse the markdown tables from the docs folder so drift is
   caught); (b) round-trip a preset to JSON and back gives identical state;
   (c) `ModDestinations::count() >= 92` and no duplicate IDs.

## Build and verify

Same commands as prompt 01. Then load the VST3 in a DAW and confirm the host's
generic parameter view shows the groups and hundreds of parameters with proper
names and units.

## Done when

- All tests pass, including the markdown-vs-layout check.
- Saving and reloading a DAW project restores the exact state.
- A user preset can be saved and loaded through a temporary debug menu in the
  placeholder editor (a `ComboBox` listing presets plus Save button is enough).
- Commit: `"Define full parameter tree, mod destination table and preset manager"`.

---

# Prompt 03 — Oscillator engine

Read `CLAUDE.md`, `docs/SPEC.md` section 2 and `docs/PARAMETERS.md`. This session
builds the oscillator DSP and a minimal single-voice path so it can be heard.
Voice management, filters and envelopes come in later prompts; for now one
monophonic voice with a simple gate is fine.

## Deliverables

1. `src/dsp/PolyBlep.h`: band-limited saw, square/pulse (variable width) and
   triangle (integrated square with leaky integrator) using PolyBLEP with a
   2-sample correction. Sine direct. A `WaveMorph` function that maps `wave` 0..1 to
   crossfades Sine→Tri→Saw→Square→Pulse per the spec (equal-power crossfades,
   pulse region uses `pw`).
2. `src/dsp/Oscillator.h/.cpp`: one VA oscillator: phase accumulator (double),
   frequency from MIDI note + octave/semi/fine + pitch mod (semitones, exponential)
   + linear FM (Hz, through-zero), hard sync input (accept a "master wrapped at
   fractional sample position" signal and reset phase with sub-sample accuracy,
   applying a BLEP at the discontinuity), phase reset mode, and a `renderBlock`
   that writes into a mono buffer.
3. `src/dsp/SuperOscillator.h/.cpp`: 7 `Oscillator` copies with the JP-8000 style
   detune curve (asymmetric offsets: 0, ±0.11, ±0.29, ±0.57 of detune cents range,
   scaled by `osc2_superDetune`), stereo spread panning copies left/right, and
   `superMix` blending centre vs sides. Copies get random start phases.
4. `src/dsp/Wavetable.h/.cpp`:
   - `WavetableSet`: N frames of 2048 samples; for each frame precompute mip levels
     per octave by FFT band-limiting (use `juce::dsp::FFT`), so playback picks the
     level whose highest harmonic stays under Nyquist. Linear interpolation within a
     frame, crossfade between adjacent frames by `position`.
   - `WavetableOscillator`: uses a `WavetableSet`, supports Duo (second read head
     detuned + spread) and the same pitch inputs as `Oscillator`.
   - Loader for `.wav` files: read with `juce::WavAudioFormat`, detect Serum `clm`
     chunk for frame size if present, else assume 2048-sample frames; if the file
     is not a multiple of 2048, resample the whole file into frames.
   - **Factory bank generator**: `tests/tools/GenerateWavetables` (or a CMake custom
     command) that synthesises 85 tables and writes them as `.wav` into
     `resources/wavetables/`, embedded via `juce_add_binary_data`. Families:
     basic analog morphs, additive harmonic series, formant/vowel sweeps, PWM sweeps,
     FM scans, phase-distortion, spectral tilts, "cinematic" evolving mixes, bell
     partials, organ drawbars, noise-shaped. Name them descriptively. Deterministic
     seeds so the bank is reproducible.
5. `src/dsp/Noise.h`: white and pink (Paul Kellet filter) with colour tilt.
6. `src/dsp/Vintage.h`: per-oscillator random-walk drift generator (low-pass
   filtered noise, updated at control rate) producing cents offsets scaled by
   `vintage`, plus level jitter. Deterministic per voice seed.
7. `src/engine/OscillatorSection.h/.cpp`: owns Osc 1/2/3 + noise for one voice,
   reads parameters, applies Osc 1 sync-to-Osc 2, Osc 1 FM from selected source
   (linear: source output scaled to Hz by `fmLin` × 8 × base frequency; exponential:
   source output × `fmExp` × 24 semitones), Super/Duo modes, level, pan, key track,
   and writes a stereo buffer. Process at the oversampled rate; the section is given
   the sample rate by its owner.
8. Oversampling: `juce::dsp::Oversampling` in the processor around the voice render,
   factor from `oversampling` parameter (Off/2x/4x), FIR half-band, latency reported.
9. Temporary mono voice in the processor: note-on sets pitch and a gate, note-off
   releases; output through a 5 ms linear ramp to avoid clicks. This gets replaced
   in prompt 04.
10. Tests:
    - Saw at 1 kHz, 48 kHz, 2x oversampling: aliasing components above 20 kHz folded
      into the band are at least 60 dB below the fundamental (FFT test).
    - Wave morph is continuous: no sample discontinuity when sweeping `wave` slowly.
    - Hard sync produces the expected harmonic at the master frequency.
    - Wavetable mip selection never reads a level whose top harmonic exceeds Nyquist.
    - Wavetable import of a synthetic 4-frame file round-trips.
    - Factory bank generator emits exactly 85 files.

## Build and verify

Build, run tests, open Standalone, and listen: sweep `osc1_wave`, enable Super on
Osc 2, switch Osc 3 to wavetable and sweep `osc3_wtPosition`. Use the generic
parameter editor in the placeholder UI (add one if needed:
`juce::GenericAudioProcessorEditor` is fine for now).

## Done when

- All tests pass. No audible clicks when changing any oscillator parameter.
- The 85 factory wavetables are in `resources/wavetables/` and embedded.
- CPU for one voice with all three oscillators, Super and Duo on, 2x, is under 2 % of
  a core (print a rough measure in the tests using `std::chrono`).
- Commit: `"Add oscillator engine: PolyBLEP VA, Super stack, wavetable, noise, vintage drift"`.

---

# Prompt 04 — Voice manager and MIDI

Read `CLAUDE.md`, `docs/SPEC.md` sections 1 and 9, `docs/PARAMETERS.md` Global
section. This session replaces the temporary mono voice with the real voice
architecture. Filters and envelopes are still stubs (use a fixed 10 ms attack /
100 ms release linear envelope for the amp until prompt 06).

## Deliverables

1. `src/engine/Voice.h/.cpp`: one voice = `OscillatorSection` + stubs for filter
   section, envelopes, LFOs and per-voice modulation state (`VoiceModState` with
   velocity, release velocity, key track, poly aftertouch, random). Interface:
   `startNote(note, velocity, pitchFromGlide, unisonIndex, unisonCount)`,
   `stopNote(releaseVelocity, allowTailOff)`, `isActive()`, `render(stereoBuffer,
   startSample, numSamples)`, `setPitchBend`, `setAftertouch`, `age()`.
2. `src/engine/VoiceManager.h/.cpp`:
   - Pool of 16 voices, allocation per `voiceMode`:
     Poly: round-robin free voice, steal oldest released then oldest held, 5 ms
     fade on steal. Mono: single voice, retrigger on every note, last-note priority
     with note stack so releasing returns to the held note. Legato: like Mono but
     envelopes do not retrigger and glide applies only between overlapping notes.
   - Unison: each note-on claims `unisonVoices` voices (capped by free count),
     each with detune offset from a symmetric spread table and pan spread; unison
     copies of the same note release together.
   - Glide: per-voice pitch smoother (exponential, `glideTime`, constant-time).
     `glideMode` Off/Always/Legato. `polyGlide` off: all voices glide from the last
     played pitch; on: each voice glides from the pitch it last played.
   - Pitch bend with separate up/down ranges; channel aftertouch broadcast; poly
     aftertouch routed to the voice(s) with that note; sustain pedal holds releases;
     CC 120/123 all off.
   - Sample-accurate event handling: split the block at each MIDI event.
3. `src/engine/MidiLearn.h/.cpp`: map CC → parameter ID, plus Learn slots 1-4
   (CC numbers) exposed as mod sources. Learn mode: the processor stores a
   "waiting for CC" target; the next CC binds it. Bindings stored in the
   `MidiLearn` ValueTree (prompt 02). Applying a learned CC sets the parameter via
   `setValueNotifyingHost` on the message thread using an async updater, never from
   the audio thread directly.
4. `src/engine/ModSourcesState.h`: the global mod sources (mod wheel, aftertouch,
   pitch bend, expression, breath, macros 1-4, learn 1-4) as atomics written from
   MIDI handling and read by voices.
5. Processor: replace the temporary voice; mix voices into the oversampled buffer;
   apply `masterVolume` and `masterPan` with smoothing.
6. Tests: poly allocation and stealing order; mono note-stack behaviour; legato
   does not retrigger; unison claims N voices and releases together; glide reaches
   target within `glideTime` ± 5 %; pitch bend ranges; sample-accurate note timing
   (note-on at sample 37 produces output starting at sample 37 ± ramp).

## Build and verify

Build, tests, Standalone with a keyboard: chords, fast trills, unison 8 with
spread, mono with glide, sustain pedal.

## Done when

- All tests pass; no clicks on voice steal; no stuck notes after a panic.
- 16 voices × 16 unison is capped correctly (never more than 16 voices sound).
- Commit: `"Add voice manager: poly/mono/legato, unison, glide, MIDI learn"`.

---

# Prompt 05 — Filters

Read `CLAUDE.md`, `docs/SPEC.md` section 3, `docs/PARAMETERS.md` Filters section.
This session builds the two filter models and the stereo/dual routing.

## Deliverables

1. `src/dsp/LadderFilter.h/.cpp`: zero-delay-feedback 4-pole transistor ladder
   (Zavalishin "The Art of VA Filter Design" topology, or Huovilainen with a
   Newton step). `tanh` saturation in the feedback path with a fast rational
   approximation, input drive stage, resonance 0..1 mapped to k = 0..4.2 so it
   self-oscillates at the top, optional resonance compensation (adds back 0..1 of the
   input at high k), and **slope taps**: output from pole 1/2/3/4 for 6/12/18/24 dB.
   When tapping earlier poles, keep the feedback around all four poles so the
   resonance character stays consistent, but scale the resonance gain so 6 dB does
   not self-oscillate. Stereo: two independent channels sharing coefficients, with a
   per-channel cutoff offset in semitones.
2. `src/dsp/OtaCascadeFilter.h/.cpp` (the NJM2069-style model): 4 one-pole OTA
   stages in a ZDF cascade, soft clip (`x / (1 + |x|)` or `tanh`) after **each**
   stage, resonance feedback taken from the last stage with a harder clip than the
   ladder and a slight high-pass in the feedback (removes the bass-loss hollowness
   and gives the DW-8000 "bark"), 12 dB tap at stage 2 and 24 dB at stage 4. Give it
   a slightly higher resonance ceiling (`k` up to 4.5) and a subtle 2nd-harmonic
   asymmetry in the clip so it sounds brighter and grittier than the ladder.
   Document in comments what is modelled and what is by-ear choice.
3. `src/dsp/FilterModel.h`: a common interface + a coefficient cache so per-sample
   cutoff modulation is cheap: compute `g = tan(pi * fc / fs)` per sample via a
   fast approximation, recompute the rest of the coefficients every 8 samples.
4. `src/engine/FilterSection.h/.cpp`: per voice, holds Filter A and B, applies
   cutoff modulation in octaves (env amount, LFO amount, key track from note
   relative to C4, velocity, mod matrix input), drive, and the routing modes Series
   / Parallel (with balance) / Split (A left, B right), plus `filterStereoOffset`.
   Cutoff and resonance smoothed per sample. Clamp cutoff to 20 Hz .. 0.45 × fs.
5. Hook into `Voice` after the oscillator section. Env 1 is still a stub; use the
   temporary linear envelope for the filter env amount so it can be heard now.
6. Tests: frequency response of Ladder24 at low resonance is within 1.5 dB of the
   ideal 4-pole Butterworth-ish rolloff at 1 and 2 octaves above cutoff; Ladder6/12/18
   slopes measure approximately 6/12/18 dB per octave; both models self-oscillate at
   max resonance (output persists with zero input after an impulse); no NaN/Inf for
   any parameter extreme including cutoff at 20 kHz with 4x drive; stereo offset
   produces the expected cutoff ratio between channels.

## Build and verify

Build, tests, Standalone: sweep cutoff with resonance high on each type; listen for
zipper noise (there must be none), compare ladder vs OTA character at high drive.

## Done when

- Tests pass. Sweeping cutoff at audio rate is smooth.
- One voice with both filters on adds no more than 1.5 % of a core.
- Commit: `"Add ladder and OTA-cascade filters with dual/stereo routing"`.

---

# Prompt 06 — Envelopes

Read `CLAUDE.md`, `docs/SPEC.md` section 4, `docs/PARAMETERS.md` Envelopes section.

## Deliverables

1. `src/dsp/Envelope.h/.cpp`: stage machine Idle → Attack → Decay → (Break → Slope) →
   Sustain → Release, with:
   - ADSR and ADBSSR modes.
   - Per-stage curve (-1..+1): implement each stage as a one-pole toward a target
     with a curvature-dependent overshoot target (the classic analog trick) so
     -1 is exponential, 0 is linear, +1 is logarithmic. Times are the time to reach
     the stage's end value within 0.1 %.
   - Retrigger from any stage without clicks (attack starts from the current level).
   - Release from any stage. Analog-style "fast release" clamp: release times below
     2 ms are still click-free by enforcing a 1 ms minimum ramp.
   - Velocity sensitivity scales the peak (amp) or the depth (filter/mod).
   - Control-rate stepping (every 32 samples) with per-sample linear interpolation,
     since the value is consumed as a smoothed modulator.
2. Env 3 trigger sources: implement in `Voice`: Note (default), Mod Wheel (retrigger
   when the wheel crosses 0.5 upward), Aftertouch (same, on channel or poly AT),
   LFO 1/2/3 cycle (retrigger whenever that voice's LFO phase wraps; LFOs come in
   prompt 07, so add the hook now and a TODO test that prompt 07 enables).
3. Wire Env 1 → filter cutoff (via `fltX_envAmt`), Env 2 → amp, Env 3 → mod source
   (prompt 07 consumes it). Remove the temporary linear envelopes. Legato mode: no
   retrigger on legato notes.
4. Voice lifetime: a voice becomes inactive when Env 2 reaches Idle **and** the
   filter/effects ring-out inside the voice is under -90 dB (a cheap RMS check) so
   self-oscillating filters do not get cut.
5. Tests: attack time accuracy ± 2 %; curve extremes are monotonic; retrigger at
   mid-attack is continuous; ADBSSR reaches break then sustain; release from
   attack is click-free (max sample-to-sample delta bounded); envelope never
   produces NaN when times are 0.

## Build and verify

Build, tests, Standalone: plucks, pads with long ADBSSR shapes, filter envelope
with negative amount.

## Done when

- Tests pass; no clicks on retrigger or fast release.
- Commit: `"Add ADSR/ADBSSR envelopes with stage curves and retrigger sources"`.

---

# Prompt 07 — LFOs and modulation matrix

Read `CLAUDE.md`, `docs/SPEC.md` sections 5 and 6, `docs/PARAMETERS.md` LFO and
Mod matrix sections, `src/core/ModDestinations.*`, `src/core/ModSources.h`.

## Deliverables

1. `src/dsp/Lfo.h/.cpp`: all 21 shapes per the spec (generate each from phase
   0..1; Sample & Hold and Smooth Random use a per-LFO xorshift RNG; Drift is 1/f
   noise via three summed random walks; Stairs quantise a ramp), rate free or
   synced to host PPQ (`AudioPlayHead` position, so it stays locked when the
   transport jumps), start phase, fade-in, key trigger, one-shot, polarity, smooth
   (one-pole slew), `depth`. Output bipolar -1..1 (or 0..1 unipolar). Reports
   `wrappedThisBlock()` for Env 3 retrigger. Control-rate evaluation (every 32
   samples) with linear interpolation to audio rate.
2. Global vs polyphonic: `lfoN_global` on means a single instance in the processor
   whose value is copied to voices; off means each voice has its own.
3. `src/engine/ModMatrix.h/.cpp`:
   - Per-voice evaluation at control rate. For each of 21 slots with a non-None
     source and destination: `value = source × amount × (via == None ? 1 : via)`,
     curve Exp squares the source magnitude keeping sign.
   - Accumulate into a `std::array<float, ModDestinations::count()>` of offsets,
     then a `ModTargets` struct that DSP reads (pitch semitones, cutoff octaves,
     level, pan, wave, pw, fm amounts, super/duo detune, wt position, env times as
     multipliers, LFO rates as multipliers, effect params, etc.). The mapping from
     destination index to how the offset is applied lives in **one** switch in
     `ModDestinations.cpp`; document the unit for each.
   - Global destinations (effects, master) are accumulated across voices by
     summing per-voice contributions divided by active voice count, plus global
     sources applied once. Effects read them from the processor at control rate.
   - Zero cost for unused slots: build a compact active-slot list when parameters
     change (on the audio thread, from a dirty flag set by a parameter listener).
4. Sources: wire every source in `docs/SPEC.md` section 6, including Random
   (fixed per voice at note-on), Arp Step Value (placeholder 0 until prompt 09),
   Control Tracks A/B (placeholder 0 until prompt 08), Learn 1-4.
5. Enable the Env 3 LFO-cycle retrigger test from prompt 06.
6. Remove any remaining direct `fltX_lfoAmt` hack if it bypassed the matrix; keep
   `fltX_lfoAmt` and `fltX_envAmt` as convenience routes implemented on top of the
   same offset accumulation.
7. Tests: each LFO shape is bounded and periodic; synced LFO phase matches PPQ after
   a transport jump; matrix with Env1→cutoff produces the expected octave offset at
   sustain; Via scaling; Exp curve; active-slot list rebuild does not allocate
   (use a custom allocator hook or verify with an allocation counter in tests);
   global vs poly LFO behave as specified.

## Build and verify

Build, tests, Standalone: LFO→pitch vibrato with fade-in, LFO→wt position, Env 3
retriggered by LFO cycle driving cutoff, Mod Wheel via Amount.

## Done when

- Tests pass. With all 21 slots active on 16 voices, CPU increase is under 2 %.
- Commit: `"Add polyphonic LFOs and 21-slot modulation matrix"`.

---

# Prompt 08 — Control Tracks

Read `CLAUDE.md`, `docs/SPEC.md` section 7, `docs/PARAMETERS.md` Control Tracks.
This is the signature "motion" feature: two modulation step sequencers.

## Deliverables

1. `src/dsp/ControlTrack.h/.cpp`:
   - 16 step values (-1..1), per-step length multiplier (x0.5, x1, x2, x3, x4),
     length 1..16, rate free Hz or synced division, swing (delays every second
     step boundary by `swing × step duration`), gate (value held for `gate` fraction
     of the step then returns to 0; at 1 no gaps), direction Forward / Reverse /
     PingPong (endpoints not repeated) / Random, smoothing (0 = stepped; >0 = slew
     with time constant up to one full step at 1, so at 1 it becomes a continuous
     curve), randomise amount (per cycle, each step gets `value + random(-1..1) ×
     random amount`, recomputed at cycle start so the pattern is stable within a
     cycle), depth.
   - Clocking: Free mode follows host PPQ when the transport is playing and free
     runs otherwise; Retrigger mode restarts at step 1 on note-on (per voice when
     `ctX_poly` is on, otherwise on the first note of a phrase).
   - "Randomise now" and "Clear" commands from the UI, applied through parameter
     writes on the message thread.
2. Integration: Control Track A/B become mod matrix sources (replace the
   placeholders). Also implement the direct `ctX_dest` + `ctX_destAmount` route by
   adding a virtual 22nd/23rd matrix slot internally so the code path is shared.
3. Per-voice vs global: like LFOs. Global instances live in the processor.
4. Tests: step timing at 120 BPM 1/16 with x2 lengths; swing offsets; ping-pong
   order for length 5 is 1 2 3 4 5 4 3 2; gate 0.5 returns to zero mid-step;
   smoothing 1 yields a continuous signal (bounded derivative); PPQ jump resync;
   randomise amount 0 leaves values untouched.

## Build and verify

Build, tests, Standalone: Track A → cutoff with smoothing 0.3, Track B → wavetable
position with ping-pong, both synced to the Standalone's internal tempo.

## Done when

- Tests pass; both tracks stay locked to the host after loop restarts in a DAW.
- Commit: `"Add dual 16-step Control Track modulation sequencers"`.

---

# Prompt 09 — Arpeggiator

Read `CLAUDE.md`, `docs/SPEC.md` section 8, `docs/PARAMETERS.md` Arpeggiator.

## Deliverables

1. `src/engine/Arpeggiator.h/.cpp`: sits between MIDI input and the voice
   manager. Maintains the held-note set (with Latch: notes stay until all keys are
   released and a new key is pressed), sorts/permutes per the 20 modes exactly as
   named in the spec (define each mode's ordering in a comment with an example
   for the chord C E G B):
   Up, Down, UpDownInc (C E G B G E, endpoints repeated), UpDownExc (endpoints not
   repeated), DownUpInc, DownUpExc, AsPlayed, ReversePlayed, Random, RandomNoRepeat
   (shuffle without immediate repeats), Chord (all notes each step), Converge
   (C B E G), Diverge (G E B C), ConvergeDiverge, PinkyUp (highest note alternates:
   B C B E B G), PinkyDown, ThumbUp (lowest alternates: C E C G C B), ThumbDown,
   UpX2 (each note twice), DownX2.
   Octaves 1..4 extend the sequence upward by octave. Rate by division with
   dotted/triplet, swing, gate (note length as fraction of step, >1 overlaps), tie
   steps extend the previous note, rests skip, per-step velocity (when `arp_velMode`
   is Step), fixed velocity, transpose per step, and `arp_stepEnv` exposed as the
   Arp Step Value mod source and applied as an attack/decay multiplier on Env 2 for
   notes started in that step (negative shortens, positive lengthens, ×0.25..×4).
2. Oscillator targeting (`arp_target`): non-targeted oscillators receive the held
   chord as sustained notes through a separate "hold" voice path, targeted
   oscillators receive the arpeggiated notes. Implement by tagging each voice with an
   oscillator mask; the `OscillatorSection` renders only oscillators in its mask.
   Voice budget: hold voices and arp voices share the 16-voice pool.
3. Clocking from host PPQ when playing; internal clock when stopped (Standalone
   gets a tempo control). Sample-accurate note events. Reset on transport start.
4. Tests: ordering for every mode with C E G B; octaves 2 produce 8 steps; tie and
   rest handling; gate 1.5 overlap; latch behaviour; swing timing; PPQ lock across
   a loop; targeting mask renders the correct oscillators.

## Build and verify

Build, tests, Standalone and Studio One: arpeggiate a chord in each mode; use Osc 2
as a held pad with Osc 1 arpeggiated.

## Done when

- Tests pass; no stuck notes when disabling the arp mid-pattern or stopping the
  transport.
- Commit: `"Add arpeggiator with 20 modes, step sequence and oscillator targeting"`.

---

# Prompt 10 — Effects, plus standalone WayfarerTime and WayfarerSpace plugins

Read `CLAUDE.md`, `docs/SPEC.md` section 10, `docs/PARAMETERS.md` Effects section.
The delay and reverb DSP must live in `src/fx/` as plain classes with no dependency
on the synth, because they are also built as two separate effect plugins.

## Deliverables

1. `src/fx/Eq3.h/.cpp`: low shelf, mid peak, high shelf using
   `juce::dsp::IIR` coefficients recomputed on parameter change with smoothing
   (crossfade coefficient sets or recompute every 32 samples with smoothed inputs).
2. `src/fx/BbdChorus.h/.cpp`: two modulated delay lines per channel (short, 1..8 ms
   range), triangle LFOs at fixed rates per mode (Mode I ≈ 0.5 Hz shallow, Mode II
   ≈ 0.8 Hz deeper, I+II both summed, left/right LFOs inverted for width), BBD
   flavour: input low-pass at ~10 kHz, output low-pass, gentle soft clip, a tiny
   amount of filtered noise (-80 dB), and companding-like level dependency
   (optional). `rate` and `depth` scale the mode defaults. Mix is equal-power.
3. `src/fx/ModDelay.h/.cpp` (KeyTIME-style):
   - Two delay lines with cubic interpolation, max 2 s, times in ms or synced
     divisions (from host BPM passed in by the owner).
   - Modulation: two LFOs (sine, slightly detuned rates, `modRate`) modulating read
     position by `modDepth` (up to ±8 ms) so repeats vary in pitch; the modulation is
     applied to the read head, not the write head, so pitch variation accumulates
     through feedback.
   - Modes Dual (L and R independent with cross-feed 0) and Ping Pong (mono sum in,
     alternating L/R with feedback crossing).
   - Feedback up to 1.1 with a soft clip in the loop; low cut and high cut inside the
     loop; ducking (sidechain from the dry input with a 50 ms release).
   - Time changes are click-free: crossfade between two read heads over 40 ms
     when the target time changes by more than 1 ms, do not pitch-slide (so synced
     time changes in a DAW do not warble).
4. `src/fx/ModReverb.h/.cpp` (KeySPACE-style):
   - Pre-delay line, input diffusion (4 allpasses), then an 8-line feedback delay
     network with a Householder mixing matrix, per-line delays chosen from mutually
     prime lengths scaled by `size`, damping as a one-pole low-pass in each line,
     decay mapped to per-line feedback gains for the target RT60, modulation of each
     line's read position with independent slow LFOs (`modRate`, `modDepth`).
   - Algorithms: Room (short lines, early reflection tap set mixed in, low
     modulation), Hall (medium lines, moderate modulation, moderate diffusion),
     Space (long lines, decay up to 60 s, heavier modulation, extra diffusion
     stage, and a subtle high-frequency "shimmer" from a slow pitch-drift on two
     lines, kept quiet so the source stays clear).
   - Low cut on the wet path, mix equal-power. Freeze is not required.
   - Denormal-safe, stable at max feedback (verify with a long silent tail).
5. `src/fx/FxChain.h/.cpp`: EQ → Chorus → Delay → Reverb, each bypassable with a
   10 ms crossfade, reads global mod offsets from the mod matrix (prompt 07) for the
   `M` effect parameters.
6. Two new plugin targets in CMake, same company/codes scheme:
   `WayfarerTime` (`PLUGIN_CODE WyfT`, effect, category `Fx Delay`) and
   `WayfarerSpace` (`PLUGIN_CODE WyfS`, effect, category `Fx Reverb`), each with its
   own small APVTS mirroring the delay / reverb parameters (same IDs without the
   `delay_`/`reverb_` prefix is fine), a generic editor for now (prompt 11 gives them
   proper UIs), and state save/load. They must build VST3 and copy to Common Files.
7. Tests: EQ response at band centres; chorus produces a delayed modulated copy
   within the expected ms range; delay time accuracy within 1 sample; ping-pong
   alternates channels; feedback 1.1 stays bounded by the soft clip; reverb RT60
   for Hall at decay 3 s is 3 s ± 20 % measured from an impulse; reverb tail decays
   to silence (no limit cycles) with denormals disabled; bypass crossfades are
   click-free.

## Build and verify

Build all three plugin targets and tests. In Studio One: Wayfarer with the chain
on; WayfarerTime and WayfarerSpace on an audio track.

## Done when

- Tests pass; all three plugins load; no zipper noise on any effect parameter.
- Commit: `"Add EQ, BBD chorus, modulated delay and reverb; WayfarerTime and WayfarerSpace plugins"`.

---

# Prompt 11 — GUI

Read `CLAUDE.md`, `docs/SPEC.md` section 11 in full, and open `docs/UI-MOCKUP.html`
in a browser (it is a static HTML mockup of the finished editor with a live
canvas oscilloscope; take a screenshot of it and keep it beside you). Replace the
placeholder editors of all three plugins with real interfaces that match the
mockup's layout, proportions and colour system. Use plain JUCE components (no
WebView) so it works in every host without extra runtime.

## Design brief (from the spec, summarised)

- Deep dark blue metallic panel with brushed grain and a soft vignette.
- Roland-style colour-coded section headers: a solid 22 px bar per section in
  its family colour with dark text, section name left, live status text right.
  Families and hex values are in the spec table. Knob arcs and active states
  inside a section use the family colour.
- A live oscilloscope Monitor in the centre of the shaping row with the four
  macro knobs under it.
- Signal-flow layout top to bottom: sources, shaping around the monitor,
  modulation (left) and motion (right), effects chain.
- Type: Rajdhani for titles/tabs/buttons, IBM Plex Sans for labels, IBM Plex
  Mono for values. Download the three families from Google Fonts (OFL licence),
  place the `.ttf` files in `resources/fonts/`, embed via `juce_add_binary_data`,
  and load them with `Typeface::createSystemTypefaceFor`.

## Deliverables

1. `resources/ui/background.png`: if a file with this name already exists in
   the repo, use it. If not, write `tools/GenerateBackground` (a small console
   target using `juce::Image` and `juce::Random`) that renders a 2048 x 2048
   tileable brushed-metal tile: horizontal streaks from low-pass-filtered noise,
   dark navy tint, seamless edges via wrap-around blending. Either way, embed it
   with BinaryData. The editor paints: gradient, then the tile at 35 % opacity
   (`Graphics::setTiledImageFill`), then the vignette.
2. `src/ui/Theme.h`: all colours from the spec table as `juce::Colour`
   constants, a `SectionFamily` enum, `familyColour(SectionFamily)`, font
   loaders, and the base size / scale constants. Nothing else hard-codes a colour.
3. `src/ui/LookAndFeel.h/.cpp`: `LookAndFeel_V4` subclass: rotary knob (dark
   metal cap with radial highlight, coloured value arc from 7 o'clock to 5
   o'clock, white pointer, bipolar knobs draw the arc from 12 o'clock), pill
   toggle, combo box, text button, tab button, and a mod-ring painter that
   draws the summed modulation range for a knob's destination (from an atomic
   snapshot the processor updates at control rate, read by a 30 Hz timer).
4. `src/ui/SectionPanel.h/.cpp`: the framed panel with the coloured header bar.
   Constructor takes title, family, and a `std::function<String()>` for the live
   status text, refreshed on a 10 Hz timer. Children are laid out by the owner.
5. `src/ui/Knob.h/.cpp`: knob + label + value readout, `SliderParameterAttachment`,
   double-click reset, Ctrl for fine, mouse-wheel, right-click menu: MIDI Learn,
   Unlearn, "Add to mod matrix →" submenu listing sources. Two sizes (34 px and
   28 px caps at base scale).
6. `src/ui/Scope.h/.cpp` (the Monitor):
   - In the processor: `ScopeTaps` with one `juce::AbstractFifo` per tap
     (post-FX sum, pre-FX sum, osc 1/2/3 of the most recently started voice),
     8192 floats each, written in `processBlock` only when `editorOpen` is true.
     Writing is a plain memcpy into the FIFO; no allocation, no locks.
   - In the editor: a 60 Hz timer drains the selected tap into a display buffer,
     finds a rising zero-crossing trigger, and paints ~3 cycles of the lowest
     sounding note (the processor exposes the lowest active MIDI note) or a
     20 ms window when idle. Grid 12 x 6, centre line, amber trace with glow
     (`DropShadow` on a `Path`, or a pre-blurred image layer for speed).
   - SPEC mode: 2048-point `juce::dsp::FFT` with a Hann window, log-frequency
     x axis 20 Hz..20 kHz, 30 dB..-90 dB, bar or line display, 20 Hz repaint.
   - Mode tabs drawn inside the screen top-left; readout bottom-right with
     peak dBFS, voice count, host BPM.
7. Sections as components in `src/ui/sections/`, laid out exactly like the mockup:
   - `TopBar`: logo, prev/next, preset name button with category chip and author
     (opens the browser), Save, undo/redo (`UndoManager` on the APVTS), voice
     meter, CPU meter, master knob, scale menu, and the hover readout area.
   - `OscillatorPanel` x3 (Osc 1: sync pill, FM source combo, Lin/Exp knobs;
     Osc 2: Super pill and its three knobs; Osc 3: mode combo, wavetable combo,
     small `WavetableView`, Duo pill and knobs, Load… via async `FileChooser`),
     `NoisePanel` (level, colour, Vintage slider), `VoicePanel`.
   - `FilterPanel` x2 with a live response curve, Filter B carrying the routing
     combo, balance and stereo-offset knobs.
   - `EnvelopePanel` x3 with a drawn shape (curve handles draggable), mode
     switch, and Env 3's trigger combo.
   - `ModulationTabs` (left, row 4): tabs LFO 1 / LFO 2 / LFO 3 / Matrix. The LFO
     view shows the shape graph, controls, and a compact list of the first eight
     matrix rows beside it; the Matrix tab shows all 21 rows with source, via,
     destination combos, amount slider, curve, scrollable.
   - `MotionTabs` (right, row 4): tabs Track A / Track B / Arp with draggable
     bar editors (per-step length selector under each bar for tracks; on / tie /
     velocity / gate / transpose / env lanes for the arp), playhead, and the
     control row including Randomise and Clear buttons.
   - `EffectsPanel`: four sections EQ, Chorus, Delay, Reverb with on/off in the
     header status area.
8. `src/ui/PresetBrowser.h/.cpp`: overlay over rows 2-4 with category list,
   search, preset list, favourites, metadata, Save dialog, delete/rename,
   "Open user folder".
9. `WayfarerTime` and `WayfarerSpace` editors: single-panel versions using the
   same theme, with a small Scope in OUT mode.
10. Resizing: aspect-locked scale 60 %..200 %, applied with
    `AffineTransform::scale` on the root component; remembered globally in
    `%APPDATA%\Wayfarer\settings.json`.
11. Accessibility and performance: every control has a name; keyboard focus is
    visible; static panels use `setBufferedToImage`; timers at 60 Hz for the
    scope, 30 Hz for meters and mod-rings, 10 Hz for header status; no
    allocations in `paint`.

## Build and verify

Build all targets. Open in Standalone and in Studio One and Gig Performer at
60 %, 100 % and 150 %. Put the mockup screenshot and the running plugin side by
side and fix layout differences until they match. Play a chord and confirm the
Monitor shows a stable waveform in every mode, and that closing the editor drops
CPU back to the no-editor figure. Automate a knob from the DAW and confirm the
UI follows. Test MIDI learn via right-click. Open and close the editor 50 times
without leaks (`LeakedObjectDetector` in Debug).

## Done when

- The editor matches `docs/UI-MOCKUP.html` in layout, colours and proportions.
- The Monitor works in all six modes with a stable trigger and costs nothing
  when the editor is closed.
- Every UI-facing parameter in `docs/PARAMETERS.md` is reachable (write a test
  that walks the editor's component tree, collects attached parameter IDs, and
  diffs against the layout with a documented exclusion list such as `oscN_pitch`).
- No visible tearing or lag at 200 % scale.
- Commit: `"Add colour-coded editor UI with centre Monitor, preset browser and effect editors"`.

---

# Prompt 12 — Factory preset bank

Read `CLAUDE.md`, `docs/SPEC.md` section 11 (categories), `docs/PRESETS.md`
(22 fully specified starter presets) and `src/core/PresetManager.*`.

## Deliverables

1. A preset authoring tool `tools/PresetGen` (a small console target built from
   `WayfarerCore`) that constructs presets programmatically: start from the init
   state, set parameters by ID, set metadata, write `.wayfarer` JSON into
   `resources/presets/<Category>/`. This keeps presets reproducible and lets you
   refactor them in code.
2. **First, implement every preset in `docs/PRESETS.md` exactly as written.**
   Write a parser for that file's notation (see its final section) so the bank
   regenerates from the document, resolve wavetable names to indices, add
   `ctA_destAmount` / `ctB_destAmount` to `ModDestinations` as that file requests,
   and unit-test that all 22 load, render non-silent finite audio, and that
   preset 1 "Horizon Bed" has its EQ mid scoop and Space reverb active. Then
   author **at least 58 more presets** (80+ total) across the categories Bass, Lead, Pad, Keys,
   Pluck, Sequence, Motion, FX, Drone. Each must use the engine meaningfully, and the
   bank as a whole must showcase: Super stack on Osc 2, wavetable Osc 3 with
   position modulated by LFO and Control Track, Osc 1 sync and FM, both filter
   models and all slopes, Split routing with stereo offset, ADBSSR envelopes, Env 3
   retriggered by LFO, Control Tracks driving cutoff/wavetable/pan/delay time with
   smoothing and swing, arp with oscillator targeting and step envelopes, the three
   reverb algorithms and the delay modes, Vintage at several levels, macros wired
   through the matrix in every preset (Macro 1 = Brightness, Macro 2 = Motion,
   Macro 3 = Space, Macro 4 = Character, by convention).
   Name them evocatively but not as copies of any other product's preset names.
3. Level-match: write a tool pass that renders 2 seconds of each preset at C3
   velocity 100 and normalises `masterVolume` so peak is -6 dBFS ± 1 dB. Store the
   result back into the file.
4. Embed `resources/presets/**` via `juce_add_binary_data` and have
   `PresetManager` list factory presets (read-only) alongside user presets.
   Add a `PresetGen` CMake custom target so `cmake --build build --target presets`
   regenerates the bank.
5. Tests: every factory preset loads without error and renders non-silent, finite
   audio; none exceeds -3 dBFS peak; categories match the folder names.

## Build and verify

Regenerate the bank, rebuild, browse the presets in Studio One. Play each briefly.

## Done when

- 80+ presets embedded, level-matched, categorised, all tests pass.
- Commit: `"Add factory preset bank and PresetGen tool"`.

---

# Prompt 13 — QA, performance and release packaging

Read `CLAUDE.md` and `docs/SPEC.md` section 13.

## Deliverables

1. **pluginval**: run `pluginval --strictness-level 5 --validate` on
   `Wayfarer.vst3`, `WayfarerTime.vst3` and `WayfarerSpace.vst3` (download the
   Windows release into `tools/` if missing). Fix every failure. Add a CMake target
   `validate` that runs it.
2. **Audio-thread audit**: grep and review every `processBlock` path for
   allocations, locks, `String`, `DBG`, file I/O, `std::function` calls that could
   allocate, and `juce::MessageManagerLock`. Fix anything found. Add a debug-only
   allocation-detector (override global `new` with a thread-local flag set during
   `processBlock`) that asserts in Debug builds and is compiled out in Release.
3. **Performance pass**: build a benchmark in `tests/bench/` that renders 10 seconds
   of a heavy preset at 48 kHz / 128 samples: 16 voices, 16 unison, all three
   oscillators with Super and Duo, both filters, all 21 matrix slots, both Control
   Tracks, all effects, 2x oversampling. Report ms per block and percentage of
   real time. Target under 25 % of one core; profile and optimise the top three hot
   spots if not (likely: wavetable interpolation, filter coefficient updates,
   reverb). Try SIMD via `juce::dsp::SIMDRegister` or `juce::FloatVectorOperations`
   where it pays.
4. **Robustness**: fuzz the parameter set (random values for 1000 iterations while
   rendering) and assert no NaN/Inf/denormal storms and no crashes; test sample rates
   44.1k / 48k / 96k / 192k and block sizes 16 .. 4096 including changing mid-run;
   test state load while notes are held; test 200 rapid preset changes.
5. **Host checklist** (write it as `docs/HOST-TESTING.md` and go through it with me):
   Studio One: insert, automate cutoff, save/reopen song, freeze track, offline
   bounce equals real-time (render comparison). Gig Performer: load in a rackspace,
   map a widget to a parameter, switch rackspaces with predictive loading on, verify
   no dropouts and that the tail is handled; confirm parameter names are readable in
   the widget mapper. Fender Studio Pro: insert, play, automate, save/reopen.
6. **Installer**: an Inno Setup script `installer/wayfarer.iss` that installs the
   three `.vst3` bundles to `{commoncf}\VST3`, the Standalone to Program Files,
   and creates the `%APPDATA%\Wayfarer` folders. Add a CMake `package` target that
   builds Release and runs `iscc`. Version taken from CMake.
7. **Docs**: `docs/USER-GUIDE.md` covering every panel, the Control Tracks and Arp
   workflows, MIDI learn, presets, and the macro conventions. Update `README.md`.
8. Tag the release: `git tag v1.0.0`.

## Done when

- pluginval passes at strictness 5 for all three plugins.
- Benchmark output is committed in `docs/BENCHMARK.md` with the machine spec.
- Installer builds and installs on a clean Windows user account.
- Commit: `"QA pass, benchmarks, installer and user guide for v1.0.0"`.
