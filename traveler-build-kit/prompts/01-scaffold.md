# Prompt 01 — Project scaffold

You are building **Wayfarer**, a hybrid VA/wavetable synthesizer plugin in C++20 with
JUCE 8, for Windows (VST3 + Standalone). The design spec is in `docs/SPEC.md` and the
parameter map is in `docs/PARAMETERS.md`. Read both fully before writing anything.

This session creates the project skeleton, gets a clean Release build, and installs
the VST3 so it loads in a DAW. No synthesis yet beyond a test tone.

## Deliverables

1. `CMakeLists.txt` at the root:
   - `cmake_minimum_required(VERSION 3.28)`, project `Wayfarer` VERSION 0.1.0, C++20.
   - JUCE 8.0.9 via `FetchContent` from `https://github.com/juce-framework/JUCE.git`
     tag `8.0.9`. Honour `FETCHCONTENT_SOURCE_DIR_JUCE` so an offline clone works.
   - `juce_add_plugin(Wayfarer ...)` with `COMPANY_NAME "Wayfarer"`,
     `PLUGIN_MANUFACTURER_CODE Wayf`, `PLUGIN_CODE Wyfr`, `IS_SYNTH TRUE`,
     `NEEDS_MIDI_INPUT TRUE`, `FORMATS VST3 Standalone`, `PRODUCT_NAME "Wayfarer"`,
     `COPY_PLUGIN_AFTER_BUILD TRUE`, `VST3_CATEGORIES Instrument Synth`.
   - Link `juce::juce_audio_utils`, `juce::juce_dsp`, `juce::juce_audio_plugin_client`
     and the recommended config/warning flags. Define `JUCE_WEB_BROWSER=0`,
     `JUCE_USE_CURL=0`, `JUCE_VST3_CAN_REPLACE_VST2=0`, `JUCE_DISPLAY_SPLASH_SCREEN=0`.
   - MSVC: add `/bigobj`, `/MP`, and `/fp:fast` for Release. Set
     `CMAKE_MSVC_RUNTIME_LIBRARY` to static (`MultiThreaded$<$<CONFIG:Debug>:Debug>`).
   - A `WayfarerTests` console executable (`add_subdirectory(tests)`) linking the
     same sources via an object/static library `WayfarerCore` so DSP is testable
     without the plugin wrapper. Use a tiny header-only test harness (a `CHECK`
     macro and a registry), no external test framework.
   - `add_subdirectory(src)` and `add_subdirectory(tests)`.
2. Source layout (create empty but compiling files where later prompts will fill in):
   ```
   src/PluginProcessor.h/.cpp
   src/PluginEditor.h/.cpp        (placeholder: a label and a resizable window)
   src/core/Params.h/.cpp         (parameter layout; this prompt: masterVolume only)
   src/core/ModDestinations.h     (empty table for now)
   src/dsp/                       (empty)
   src/engine/                    (empty)
   src/fx/                        (empty)
   src/ui/                        (empty)
   tests/main.cpp, tests/TestHarness.h
   ```
3. `PluginProcessor` must:
   - Own a `juce::AudioProcessorValueTreeState` built from `Params::createLayout()`.
   - In `processBlock`, use `juce::ScopedNoDenormals`, produce a -18 dBFS 220 Hz
     sine while any MIDI note is held (simple gate, no envelope), scaled by
     `masterVolume`. This proves MIDI in, audio out, parameter read.
   - Implement `getStateInformation` / `setStateInformation` with the APVTS tree.
   - Report tail length 0 and be instantiable with any block size.
4. `CLAUDE.md` at the root, containing: what the project is, the file layout, the
   build and test commands below, the rule that `docs/SPEC.md` and `docs/PARAMETERS.md`
   are authoritative, the audio-thread rules (no allocation, locks or logging after
   `prepareToPlay`; `ScopedNoDenormals`; parameters read through cached
   `std::atomic<float>*` pointers), and the coding conventions (C++20, `juce::`
   prefixes, no `using namespace`, one class per file, `[[nodiscard]]` on pure getters).
5. `.gitignore` for `build*/`, `*.user`, `.vs/`, `_deps/`.
6. `README.md` with the same build instructions.

## Build and verify

```bat
cmake -B build -G "Visual Studio 17 2022" -A x64
cmake --build build --config Release --target Wayfarer_VST3 Wayfarer_Standalone WayfarerTests
build\tests\Release\WayfarerTests.exe
```

Run all of it. Fix every warning that comes from our own code. If the copy step to
`C:\Program Files\Common Files\VST3` fails, say so and tell me to re-run the
terminal as Administrator rather than silently skipping it.

## Done when

- Release build of VST3, Standalone and tests completes with zero errors.
- `WayfarerTests.exe` runs and reports at least one passing test (a smoke test that
  instantiates the processor, calls `prepareToPlay(48000, 128)`, sends a note-on and
  gets non-zero output).
- `Wayfarer.vst3` exists in `C:\Program Files\Common Files\VST3`.
- Standalone launches, shows the placeholder window, and plays a tone from a MIDI keyboard.
- `CLAUDE.md` exists and is accurate.
- Everything is committed: `git add -A && git commit -m "Scaffold Wayfarer JUCE project"`.
