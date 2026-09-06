# Prompt 11 — GUI

Read `CLAUDE.md`, `docs/SPEC.md` section 11 in full, and open `docs/UI-MOCKUP.html`
in a browser (it is a static HTML mockup of the finished editor with a live
canvas oscilloscope; take a screenshot of it and keep it beside you). Replace the
placeholder editors of all three plugins with real interfaces that match the
mockup's layout, proportions and colour system. Use plain JUCE components (no
WebView) so it works in every host without extra runtime.

## Design brief (from the spec, summarised)

- Deep dark blue metallic panel with brushed grain and a soft vignette.
- Roland-style colour-coded section headers: a solid 22 px bar per section in
  its family colour with dark text, section name left, live status text right.
  Families and hex values are in the spec table. Knob arcs and active states
  inside a section use the family colour.
- A live oscilloscope Monitor in the centre of the shaping row with the four
  macro knobs under it.
- Signal-flow layout top to bottom: sources, shaping around the monitor,
  modulation (left) and motion (right), effects chain.
- Type: Rajdhani for titles/tabs/buttons, IBM Plex Sans for labels, IBM Plex
  Mono for values. Download the three families from Google Fonts (OFL licence),
  place the `.ttf` files in `resources/fonts/`, embed via `juce_add_binary_data`,
  and load them with `Typeface::createSystemTypefaceFor`.

## Deliverables

1. `resources/ui/background.png`: if a file with this name already exists in
   the repo, use it. If not, write `tools/GenerateBackground` (a small console
   target using `juce::Image` and `juce::Random`) that renders a 2048 x 2048
   tileable brushed-metal tile: horizontal streaks from low-pass-filtered noise,
   dark navy tint, seamless edges via wrap-around blending. Either way, embed it
   with BinaryData. The editor paints: gradient, then the tile at 35 % opacity
   (`Graphics::setTiledImageFill`), then the vignette.
2. `src/ui/Theme.h`: all colours from the spec table as `juce::Colour`
   constants, a `SectionFamily` enum, `familyColour(SectionFamily)`, font
   loaders, and the base size / scale constants. Nothing else hard-codes a colour.
3. `src/ui/LookAndFeel.h/.cpp`: `LookAndFeel_V4` subclass: rotary knob (dark
   metal cap with radial highlight, coloured value arc from 7 o'clock to 5
   o'clock, white pointer, bipolar knobs draw the arc from 12 o'clock), pill
   toggle, combo box, text button, tab button, and a mod-ring painter that
   draws the summed modulation range for a knob's destination (from an atomic
   snapshot the processor updates at control rate, read by a 30 Hz timer).
4. `src/ui/SectionPanel.h/.cpp`: the framed panel with the coloured header bar.
   Constructor takes title, family, and a `std::function<String()>` for the live
   status text, refreshed on a 10 Hz timer. Children are laid out by the owner.
5. `src/ui/Knob.h/.cpp`: knob + label + value readout, `SliderParameterAttachment`,
   double-click reset, Ctrl for fine, mouse-wheel, right-click menu: MIDI Learn,
   Unlearn, "Add to mod matrix →" submenu listing sources. Two sizes (34 px and
   28 px caps at base scale).
6. `src/ui/Scope.h/.cpp` (the Monitor):
   - In the processor: `ScopeTaps` with one `juce::AbstractFifo` per tap
     (post-FX sum, pre-FX sum, osc 1/2/3 of the most recently started voice),
     8192 floats each, written in `processBlock` only when `editorOpen` is true.
     Writing is a plain memcpy into the FIFO; no allocation, no locks.
   - In the editor: a 60 Hz timer drains the selected tap into a display buffer,
     finds a rising zero-crossing trigger, and paints ~3 cycles of the lowest
     sounding note (the processor exposes the lowest active MIDI note) or a
     20 ms window when idle. Grid 12 x 6, centre line, amber trace with glow
     (`DropShadow` on a `Path`, or a pre-blurred image layer for speed).
   - SPEC mode: 2048-point `juce::dsp::FFT` with a Hann window, log-frequency
     x axis 20 Hz..20 kHz, 30 dB..-90 dB, bar or line display, 20 Hz repaint.
   - Mode tabs drawn inside the screen top-left; readout bottom-right with
     peak dBFS, voice count, host BPM.
7. Sections as components in `src/ui/sections/`, laid out exactly like the mockup:
   - `TopBar`: logo, prev/next, preset name button with category chip and author
     (opens the browser), Save, undo/redo (`UndoManager` on the APVTS), voice
     meter, CPU meter, master knob, scale menu, and the hover readout area.
   - `OscillatorPanel` x3 (Osc 1: sync pill, FM source combo, Lin/Exp knobs;
     Osc 2: Super pill and its three knobs; Osc 3: mode combo, wavetable combo,
     small `WavetableView`, Duo pill and knobs, Load… via async `FileChooser`),
     `NoisePanel` (level, colour, Vintage slider), `VoicePanel`.
   - `FilterPanel` x2 with a live response curve, Filter B carrying the routing
     combo, balance and stereo-offset knobs.
   - `EnvelopePanel` x3 with a drawn shape (curve handles draggable), mode
     switch, and Env 3's trigger combo.
   - `ModulationTabs` (left, row 4): tabs LFO 1 / LFO 2 / LFO 3 / Matrix. The LFO
     view shows the shape graph, controls, and a compact list of the first eight
     matrix rows beside it; the Matrix tab shows all 21 rows with source, via,
     destination combos, amount slider, curve, scrollable.
   - `MotionTabs` (right, row 4): tabs Track A / Track B / Arp with draggable
     bar editors (per-step length selector under each bar for tracks; on / tie /
     velocity / gate / transpose / env lanes for the arp), playhead, and the
     control row including Randomise and Clear buttons.
   - `EffectsPanel`: four sections EQ, Chorus, Delay, Reverb with on/off in the
     header status area.
8. `src/ui/PresetBrowser.h/.cpp`: overlay over rows 2-4 with category list,
   search, preset list, favourites, metadata, Save dialog, delete/rename,
   "Open user folder".
9. `WayfarerTime` and `WayfarerSpace` editors: single-panel versions using the
   same theme, with a small Scope in OUT mode.
10. Resizing: aspect-locked scale 60 %..200 %, applied with
    `AffineTransform::scale` on the root component; remembered globally in
    `%APPDATA%\Wayfarer\settings.json`.
11. Accessibility and performance: every control has a name; keyboard focus is
    visible; static panels use `setBufferedToImage`; timers at 60 Hz for the
    scope, 30 Hz for meters and mod-rings, 10 Hz for header status; no
    allocations in `paint`.

## Build and verify

Build all targets. Open in Standalone and in Studio One and Gig Performer at
60 %, 100 % and 150 %. Put the mockup screenshot and the running plugin side by
side and fix layout differences until they match. Play a chord and confirm the
Monitor shows a stable waveform in every mode, and that closing the editor drops
CPU back to the no-editor figure. Automate a knob from the DAW and confirm the
UI follows. Test MIDI learn via right-click. Open and close the editor 50 times
without leaks (`LeakedObjectDetector` in Debug).

## Done when

- The editor matches `docs/UI-MOCKUP.html` in layout, colours and proportions.
- The Monitor works in all six modes with a stable trigger and costs nothing
  when the editor is closed.
- Every UI-facing parameter in `docs/PARAMETERS.md` is reachable (write a test
  that walks the editor's component tree, collects attached parameter IDs, and
  diffs against the layout with a documented exclusion list such as `oscN_pitch`).
- No visible tearing or lag at 200 % scale.
- Commit: `"Add colour-coded editor UI with centre Monitor, preset browser and effect editors"`.
