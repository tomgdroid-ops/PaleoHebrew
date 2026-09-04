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
