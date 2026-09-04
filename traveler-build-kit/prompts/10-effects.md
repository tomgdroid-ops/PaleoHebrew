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
