# Prompt 11 — GUI

Read `CLAUDE.md`, `docs/SPEC.md` section 11, and skim `docs/PARAMETERS.md`.
Replace the placeholder editors of all three plugins with real interfaces. Use
plain JUCE components (no WebView) so it works in every host without extra runtime.

## Design brief

Dark, low-glare, cinematic. One background tone (near-black blue-grey), one panel
tone slightly lighter, one accent (warm amber) used only for active states and
value arcs, off-white text, muted labels. Avoid dense repeated ornaments; group
controls into clearly bordered sections with a heading. Keep the "visual tinnitus"
criticism of busy synth UIs in mind: whitespace and alignment over decoration.
Base size 1180 × 760, resizable by aspect-locked scaling 75 %..200 %, scale
remembered in a global settings file.

## Deliverables

1. `src/ui/LookAndFeel.h/.cpp`: custom `LookAndFeel_V4` subclass: rotary knob with
   value arc, tick at default, bipolar knobs drawn from centre; toggle "pill"
   buttons; combo boxes; section headers; a mod-ring on knobs showing the summed
   modulation range for that destination (read from the processor at 30 Hz via a
   `Timer`, never from the audio thread directly; the processor keeps an atomic
   snapshot of current mod offsets per destination).
2. `src/ui/Knob.h/.cpp`: knob + label + value readout, `SliderParameterAttachment`,
   double-click reset, Ctrl for fine, mouse-wheel, right-click menu: MIDI Learn,
   Unlearn, "Add to mod matrix →" submenu listing sources (creates a slot with the
   next free `modK_` and amount 50 %).
3. Sections as components in `src/ui/sections/`:
   - `TopBar`: preset name button (opens browser), prev/next, save, category,
     master volume, voice count meter, CPU meter, scale menu, undo/redo (parameter
     undo via `juce::UndoManager` attached to the APVTS).
   - `OscillatorPanel` ×3 (with the Osc 1 sync/FM, Osc 2 Super, Osc 3 mode/wavetable
     controls; a `WavetableView` drawing the current frame at the current position,
     with a "Load…" button using `juce::FileChooser` async), `NoisePanel`, and a
     `VoicePanel` (mode, voices, unison, glide, bend, vintage, oversampling).
   - `FilterPanel` ×2 with type, cutoff, res, drive, keytrack, env, lfo, velocity;
     routing / balance / stereo offset strip; a small live frequency-response curve
     (computed from the coefficient formulas on the UI thread).
   - `EnvelopePanel` ×3 with mode switch and a drawn envelope shape that updates
     with the parameters and shows curve handles (drag to set curve values).
   - `ModulationTabs` with tabs: `LfoPanel` ×3 (shape picker draws the shape),
     `ModMatrixPanel` (21 rows: source, via, destination combos, amount slider,
     curve), `ControlTrackPanel` ×2 (16 draggable bars, per-step length selector,
     length, rate/sync, smooth, swing, gate, random, direction, trigger, poly,
     depth, dest, Randomise and Clear buttons, playhead indicator),
     `ArpPanel` (mode, rate, octaves, gate, swing, latch, velocity mode, target,
     16-step editor with on/tie/velocity/gate/transpose/env lanes, playhead).
   - `EffectsPanel`: EQ, Chorus, Delay, Reverb strips with on/off.
   - `MacroStrip`: macros 1-4 with rename (stored in preset metadata).
4. `src/ui/PresetBrowser.h/.cpp`: overlay with category list, search box,
   preset list, favourites toggle, author/tags display, Save dialog (name, category,
   author, tags, comment), delete/rename, "Open user folder". Reads from
   `PresetManager`.
5. `WayfarerTime` and `WayfarerSpace` editors: single-panel versions using the same
   LookAndFeel and Knob.
6. Accessibility: every control has a name and the editor is keyboard focusable;
   tooltips show the parameter description.
7. Performance: repaint only what changed (use `setBufferedToImage` on static
   panels, `repaint` on regions), 30 Hz timers for meters and playheads, no
   allocations in `paint`.

## Build and verify

Build all targets. Open in Standalone and in Studio One and Gig Performer at
several window sizes. Automate a knob from the DAW and confirm the UI follows.
Test MIDI learn via right-click. Check the editor opens and closes 50 times without
leaks (`juce::LeakedObjectDetector` is on in Debug).

## Done when

- Every parameter in `docs/PARAMETERS.md` that is meant for the UI is reachable
  from the editor (write a quick test that walks the editor's component tree and
  collects attached parameter IDs, then diffs against the layout, allowing a
  documented exclusion list such as `oscN_pitch`).
- No visible tearing or lag at 200 % scale.
- Commit: `"Add full editor UI, preset browser and effect plugin editors"`.
