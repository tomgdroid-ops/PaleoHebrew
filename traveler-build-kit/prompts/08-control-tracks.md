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
