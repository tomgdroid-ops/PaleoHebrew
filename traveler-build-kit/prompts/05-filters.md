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
