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
