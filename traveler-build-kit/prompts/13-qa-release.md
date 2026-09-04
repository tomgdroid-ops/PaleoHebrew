# Prompt 13 — QA, performance and release packaging

Read `CLAUDE.md` and `docs/SPEC.md` section 13.

## Deliverables

1. **pluginval**: run `pluginval --strictness-level 5 --validate` on
   `Wayfarer.vst3`, `WayfarerTime.vst3` and `WayfarerSpace.vst3` (download the
   Windows release into `tools/` if missing). Fix every failure. Add a CMake target
   `validate` that runs it.
2. **Audio-thread audit**: grep and review every `processBlock` path for
   allocations, locks, `String`, `DBG`, file I/O, `std::function` calls that could
   allocate, and `juce::MessageManagerLock`. Fix anything found. Add a debug-only
   allocation-detector (override global `new` with a thread-local flag set during
   `processBlock`) that asserts in Debug builds and is compiled out in Release.
3. **Performance pass**: build a benchmark in `tests/bench/` that renders 10 seconds
   of a heavy preset at 48 kHz / 128 samples: 16 voices, 16 unison, all three
   oscillators with Super and Duo, both filters, all 21 matrix slots, both Control
   Tracks, all effects, 2x oversampling. Report ms per block and percentage of
   real time. Target under 25 % of one core; profile and optimise the top three hot
   spots if not (likely: wavetable interpolation, filter coefficient updates,
   reverb). Try SIMD via `juce::dsp::SIMDRegister` or `juce::FloatVectorOperations`
   where it pays.
4. **Robustness**: fuzz the parameter set (random values for 1000 iterations while
   rendering) and assert no NaN/Inf/denormal storms and no crashes; test sample rates
   44.1k / 48k / 96k / 192k and block sizes 16 .. 4096 including changing mid-run;
   test state load while notes are held; test 200 rapid preset changes.
5. **Host checklist** (write it as `docs/HOST-TESTING.md` and go through it with me):
   Studio One: insert, automate cutoff, save/reopen song, freeze track, offline
   bounce equals real-time (render comparison). Gig Performer: load in a rackspace,
   map a widget to a parameter, switch rackspaces with predictive loading on, verify
   no dropouts and that the tail is handled; confirm parameter names are readable in
   the widget mapper. Fender Studio Pro: insert, play, automate, save/reopen.
6. **Installer**: an Inno Setup script `installer/wayfarer.iss` that installs the
   three `.vst3` bundles to `{commoncf}\VST3`, the Standalone to Program Files,
   and creates the `%APPDATA%\Wayfarer` folders. Add a CMake `package` target that
   builds Release and runs `iscc`. Version taken from CMake.
7. **Docs**: `docs/USER-GUIDE.md` covering every panel, the Control Tracks and Arp
   workflows, MIDI learn, presets, and the macro conventions. Update `README.md`.
8. Tag the release: `git tag v1.0.0`.

## Done when

- pluginval passes at strictness 5 for all three plugins.
- Benchmark output is committed in `docs/BENCHMARK.md` with the machine spec.
- Installer builds and installs on a clean Windows user account.
- Commit: `"QA pass, benchmarks, installer and user guide for v1.0.0"`.
