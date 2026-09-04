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
