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
