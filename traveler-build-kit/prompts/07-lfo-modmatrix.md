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
