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
