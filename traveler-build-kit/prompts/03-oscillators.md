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
