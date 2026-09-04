# Wayfarer Build Prompts (all 13, in order)

Paste one prompt per Claude Code session, in order. Check each prompt's **Done when** list and commit before starting the next. Copy `SPEC.md` and `PARAMETERS.md` into your project's `docs/` folder before prompt 01.


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

Read `CLAUDE.md`, `docs/SPEC.md` section 11, and skim `docs/PARAMETERS.md`.
Replace the placeholder editors of all three plugins with real interfaces. Use
plain JUCE components (no WebView) so it works in every host without extra runtime.

## Design brief

Dark, low-glare, cinematic. One background tone (near-black blue-grey), one panel
tone slightly lighter, one accent (warm amber) used only for active states and
value arcs, off-white text, muted labels. Avoid dense repeated ornaments; group
controls into clearly bordered sections with a heading. Keep the "visual tinnitus"
criticism of busy synth UIs in mind: whitespace and alignment over decoration.
Base size 1180 × 760, resizable by aspect-locked scaling 75 %..200 %, scale
remembered in a global settings file.

## Deliverables

1. `src/ui/LookAndFeel.h/.cpp`: custom `LookAndFeel_V4` subclass: rotary knob with
   value arc, tick at default, bipolar knobs drawn from centre; toggle "pill"
   buttons; combo boxes; section headers; a mod-ring on knobs showing the summed
   modulation range for that destination (read from the processor at 30 Hz via a
   `Timer`, never from the audio thread directly; the processor keeps an atomic
   snapshot of current mod offsets per destination).
2. `src/ui/Knob.h/.cpp`: knob + label + value readout, `SliderParameterAttachment`,
   double-click reset, Ctrl for fine, mouse-wheel, right-click menu: MIDI Learn,
   Unlearn, "Add to mod matrix →" submenu listing sources (creates a slot with the
   next free `modK_` and amount 50 %).
3. Sections as components in `src/ui/sections/`:
   - `TopBar`: preset name button (opens browser), prev/next, save, category,
     master volume, voice count meter, CPU meter, scale menu, undo/redo (parameter
     undo via `juce::UndoManager` attached to the APVTS).
   - `OscillatorPanel` ×3 (with the Osc 1 sync/FM, Osc 2 Super, Osc 3 mode/wavetable
     controls; a `WavetableView` drawing the current frame at the current position,
     with a "Load…" button using `juce::FileChooser` async), `NoisePanel`, and a
     `VoicePanel` (mode, voices, unison, glide, bend, vintage, oversampling).
   - `FilterPanel` ×2 with type, cutoff, res, drive, keytrack, env, lfo, velocity;
     routing / balance / stereo offset strip; a small live frequency-response curve
     (computed from the coefficient formulas on the UI thread).
   - `EnvelopePanel` ×3 with mode switch and a drawn envelope shape that updates
     with the parameters and shows curve handles (drag to set curve values).
   - `ModulationTabs` with tabs: `LfoPanel` ×3 (shape picker draws the shape),
     `ModMatrixPanel` (21 rows: source, via, destination combos, amount slider,
     curve), `ControlTrackPanel` ×2 (16 draggable bars, per-step length selector,
     length, rate/sync, smooth, swing, gate, random, direction, trigger, poly,
     depth, dest, Randomise and Clear buttons, playhead indicator),
     `ArpPanel` (mode, rate, octaves, gate, swing, latch, velocity mode, target,
     16-step editor with on/tie/velocity/gate/transpose/env lanes, playhead).
   - `EffectsPanel`: EQ, Chorus, Delay, Reverb strips with on/off.
   - `MacroStrip`: macros 1-4 with rename (stored in preset metadata).
4. `src/ui/PresetBrowser.h/.cpp`: overlay with category list, search box,
   preset list, favourites toggle, author/tags display, Save dialog (name, category,
   author, tags, comment), delete/rename, "Open user folder". Reads from
   `PresetManager`.
5. `WayfarerTime` and `WayfarerSpace` editors: single-panel versions using the same
   LookAndFeel and Knob.
6. Accessibility: every control has a name and the editor is keyboard focusable;
   tooltips show the parameter description.
7. Performance: repaint only what changed (use `setBufferedToImage` on static
   panels, `repaint` on regions), 30 Hz timers for meters and playheads, no
   allocations in `paint`.

## Build and verify

Build all targets. Open in Standalone and in Studio One and Gig Performer at
several window sizes. Automate a knob from the DAW and confirm the UI follows.
Test MIDI learn via right-click. Check the editor opens and closes 50 times without
leaks (`juce::LeakedObjectDetector` is on in Debug).

## Done when

- Every parameter in `docs/PARAMETERS.md` that is meant for the UI is reachable
  from the editor (write a quick test that walks the editor's component tree and
  collects attached parameter IDs, then diffs against the layout, allowing a
  documented exclusion list such as `oscN_pitch`).
- No visible tearing or lag at 200 % scale.
- Commit: `"Add full editor UI, preset browser and effect plugin editors"`.

---

# Prompt 12 — Factory preset bank

Read `CLAUDE.md`, `docs/SPEC.md` section 11 (categories), `src/core/PresetManager.*`.

## Deliverables

1. A preset authoring tool `tools/PresetGen` (a small console target built from
   `WayfarerCore`) that constructs presets programmatically: start from the init
   state, set parameters by ID, set metadata, write `.wayfarer` JSON into
   `resources/presets/<Category>/`. This keeps presets reproducible and lets you
   refactor them in code.
2. Author **at least 80 presets** across the categories Bass, Lead, Pad, Keys,
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
