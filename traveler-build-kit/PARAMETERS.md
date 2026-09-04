# Wayfarer Parameter Map

Parameter IDs are stable strings used in `juce::AudioProcessorValueTreeState`,
preset files and automation. Never rename an ID after prompt 02; add new ones
instead. Column `M` = valid modulation-matrix destination.

Conventions: `N` in an ID means 1..3 for oscillators / envelopes / LFOs, `X` means
A or B for filters and control tracks, `S` means step 1..16, `K` means slot 1..21.
Ranges are the user-facing ranges. Booleans are 0/1. Choice parameters list their
items in order.

## Global

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| masterVolume | float dB | -60..+6 | 0 | M |
| masterPan | float | -1..1 | 0 | M |
| voiceMode | choice | Poly, Mono, Legato | Poly | |
| voices | int | 1..16 | 8 | |
| unisonVoices | int | 1..16 | 1 | |
| unisonDetune | float cents | 0..100 | 12 | M |
| unisonSpread | float | 0..1 | 0.5 | M |
| glideTime | float s | 0..10 (log) | 0 | M |
| glideMode | choice | Off, Always, Legato | Off | |
| polyGlide | bool | | 0 | |
| pbUp | int semi | 0..24 | 2 | |
| pbDown | int semi | 0..24 | 2 | |
| vintage | float | 0..1 | 0.15 | M |
| oversampling | choice | Off, 2x, 4x | 2x | |
| macro1..macro4 | float | 0..1 | 0 | (source) |

## Oscillators (N = 1..3)

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| oscN_on | bool | | osc1 on, others off | |
| oscN_wave | float | 0..1 (Sine→Tri→Saw→Square→Pulse) | 0.5 | M |
| oscN_pw | float | 0.05..0.95 | 0.5 | M |
| oscN_octave | int | -3..3 | 0 | |
| oscN_semi | int | -12..12 | 0 | |
| oscN_fine | float cents | -100..100 | 0 | M |
| oscN_pitch | float semi | -24..24 (mod-only offset, hidden from UI) | 0 | M |
| oscN_level | float | 0..1 | 0.8 | M |
| oscN_pan | float | -1..1 | 0 | M |
| oscN_keytrack | bool | | 1 | |
| oscN_phaseMode | choice | Free, Reset | Free | |
| oscN_phase | float | 0..1 | 0 | |
| osc1_sync | bool | | 0 | |
| osc1_fmSource | choice | Osc2, Osc3 | Osc2 | |
| osc1_fmLin | float | 0..1 | 0 | M |
| osc1_fmExp | float | 0..1 | 0 | M |
| osc2_super | bool | | 0 | |
| osc2_superDetune | float cents | 0..100 | 20 | M |
| osc2_superSpread | float | 0..1 | 0.7 | M |
| osc2_superMix | float | 0..1 | 0.6 | M |
| osc3_mode | choice | VA, Wavetable | VA | |
| osc3_wtIndex | int | 0..(tableCount-1) | 0 | |
| osc3_wtPosition | float | 0..1 | 0 | M |
| osc3_duo | bool | | 0 | |
| osc3_duoDetune | float cents | 0..100 | 10 | M |
| osc3_duoSpread | float | 0..1 | 0.6 | M |
| noise_level | float | 0..1 | 0 | M |
| noise_colour | float | 0..1 (white→dark) | 0.3 | M |

User-imported wavetables are referenced in the preset by file name and stored in
`%APPDATA%\Wayfarer\Wavetables`. `osc3_wtIndex` above the factory count indexes
the user list.

## Filters (X = A, B)

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| fltX_type | choice | Ladder6, Ladder12, Ladder18, Ladder24, NJM12, NJM24 | Ladder24 | |
| fltX_cutoff | float Hz | 20..20000 (log) | 20000 (A), 20000 (B) | M |
| fltX_res | float | 0..1 | 0.1 | M |
| fltX_drive | float dB | 0..24 | 0 | M |
| fltX_keytrack | float | 0..2 | 0.5 | |
| fltX_envAmt | float | -1..1 | 0.5 (A), 0 (B) | M |
| fltX_lfoAmt | float | -1..1 | 0 | M |
| fltX_velAmt | float | 0..1 | 0 | |
| fltX_resComp | bool | | 1 | |
| fltX_on | bool | | A on, B off | |
| filterRouting | choice | Series, Parallel, Split | Series | |
| filterBalance | float | -1..1 (Parallel only) | 0 | M |
| filterStereoOffset | float semi | 0..24 | 0 | M |

## Envelopes (N = 1 Filter, 2 Amp, 3 Mod)

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| envN_mode | choice | ADSR, ADBSSR | ADSR | |
| envN_attack | float s | 0..20 (log) | 0.005 | M |
| envN_decay | float s | 0..20 (log) | 0.3 | M |
| envN_break | float | 0..1 | 0.7 | |
| envN_slope | float s | 0..20 (log) | 0.5 | |
| envN_sustain | float | 0..1 | 1 (amp), 0.5 others | M |
| envN_release | float s | 0..20 (log) | 0.3 | M |
| envN_attackCurve | float | -1..1 | 0 | |
| envN_decayCurve | float | -1..1 | -0.5 | |
| envN_releaseCurve | float | -1..1 | -0.5 | |
| envN_velocity | float | 0..1 | 0.5 (amp), 0 others | |
| envN_depth | float | -1..1 (env 1 and 3) | 1 | M |
| env3_trigger | choice | Note, ModWheel, Aftertouch, LFO1, LFO2, LFO3 | Note | |

## LFOs (N = 1..3)

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| lfoN_shape | choice | Sine, Triangle, SawUp, SawDown, Square, Pulse25, Pulse75, SampleHold, SmoothRandom, ExpUp, ExpDown, LogUp, LogDown, Stairs4Up, Stairs4Down, Stairs8, HalfSine, RectSine, Trapezoid, SineSaw, Drift | Sine | |
| lfoN_rate | float Hz | 0.01..50 (log) | 1 | M |
| lfoN_sync | bool | | 0 | |
| lfoN_div | choice | 1/64, 1/32T, 1/32, 1/16T, 1/16, 1/8T, 1/16D, 1/8, 1/4T, 1/8D, 1/4, 1/2T, 1/4D, 1/2, 1/2D, 1 bar, 2 bars, 4 bars, 8 bars | 1/4 | |
| lfoN_phase | float | 0..1 | 0 | M |
| lfoN_fadeIn | float s | 0..10 | 0 | |
| lfoN_keyTrigger | bool | | 1 | |
| lfoN_oneShot | bool | | 0 | |
| lfoN_polarity | choice | Bipolar, Unipolar | Bipolar | |
| lfoN_smooth | float | 0..1 | 0 | |
| lfoN_global | bool | | 0 | |
| lfoN_depth | float | 0..1 (scales the LFO as a source) | 1 | M |

## Mod matrix (K = 1..21)

| ID | Type | Choices |
|---|---|---|
| modK_source | choice | None, Env1, Env2, Env3, LFO1, LFO2, LFO3, CtrlA, CtrlB, Velocity, RelVelocity, KeyTrack, ModWheel, Aftertouch, PolyAftertouch, PitchBend, Expression, Breath, Macro1, Macro2, Macro3, Macro4, Random, ArpStep, Constant, Learn1, Learn2, Learn3, Learn4 |
| modK_dest | choice | None, then every `M` parameter in this file, in file order |
| modK_amount | float -1..1 |
| modK_via | choice | same list as source |
| modK_curve | choice | Linear, Exp |

The destination list is generated in code from a single table
(`ModDestinations.h`) so the UI, the matrix and the presets agree.

## Control Tracks (X = A, B)

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| ctX_on | bool | | 0 | |
| ctX_length | int | 1..16 | 8 | |
| ctX_sync | bool | | 1 | |
| ctX_rate | float Hz | 0.05..50 (log) | 4 | M |
| ctX_div | choice | same list as lfoN_div | 1/16 | |
| ctX_smooth | float | 0..1 | 0 | M |
| ctX_swing | float | 0..0.75 | 0 | M |
| ctX_gate | float | 0..1 | 1 | M |
| ctX_random | float | 0..1 | 0 | M |
| ctX_direction | choice | Forward, Reverse, PingPong, Random | Forward | |
| ctX_trigger | choice | Free, Retrigger | Free | |
| ctX_poly | bool | | 0 | |
| ctX_depth | float | 0..1 | 1 | M |
| ctX_dest | choice | same as modK_dest (direct destination) | None | |
| ctX_destAmount | float | -1..1 | 0 | |
| ctX_stepS | float | -1..1 | 0 | |
| ctX_lenS | choice | x0.5, x1, x2, x3, x4 | x1 | |

## Arpeggiator

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| arp_on | bool | | 0 | |
| arp_latch | bool | | 0 | |
| arp_mode | choice | Up, Down, UpDownInc, UpDownExc, DownUpInc, DownUpExc, AsPlayed, ReversePlayed, Random, RandomNoRepeat, Chord, Converge, Diverge, ConvergeDiverge, PinkyUp, PinkyDown, ThumbUp, ThumbDown, UpX2, DownX2 | Up | |
| arp_div | choice | same list as lfoN_div | 1/16 | |
| arp_octaves | int | 1..4 | 1 | |
| arp_gate | float | 0.01..2 | 0.8 | M |
| arp_swing | float | 0..0.75 | 0 | M |
| arp_velMode | choice | Played, Step, Fixed | Played | |
| arp_target | choice | All, Osc1, Osc2, Osc3, Osc1+2, Osc1+3, Osc2+3 | All | |
| arp_steps | int | 1..16 | 8 | |
| arp_stepOnS | bool | | 1 | |
| arp_stepTieS | bool | | 0 | |
| arp_stepVelS | float | 0..1 | 0.8 | |
| arp_stepGateS | float | 0.01..2 | 1 | |
| arp_stepTransS | int | -12..12 | 0 | |
| arp_stepEnvS | float | -1..1 | 0 | |

## Effects

| ID | Type | Range / Choices | Default | M |
|---|---|---|---|---|
| eq_on | bool | | 0 | |
| eq_lowGain | float dB | -15..15 | 0 | M |
| eq_lowFreq | float Hz | 30..500 (log) | 100 | |
| eq_midGain | float dB | -15..15 | 0 | M |
| eq_midFreq | float Hz | 200..8000 (log) | 1000 | M |
| eq_midQ | float | 0.3..10 (log) | 0.7 | |
| eq_highGain | float dB | -15..15 | 0 | M |
| eq_highFreq | float Hz | 1500..16000 (log) | 6000 | |
| chorus_on | bool | | 0 | |
| chorus_mode | choice | I, II, I+II | I | |
| chorus_rate | float Hz | 0.05..10 (log) | 0.5 | M |
| chorus_depth | float | 0..1 | 0.5 | M |
| chorus_mix | float | 0..1 | 0.5 | M |
| delay_on | bool | | 0 | |
| delay_mode | choice | Dual, PingPong | Dual | |
| delay_sync | bool | | 1 | |
| delay_timeL | float ms | 1..2000 (log) | 375 | M |
| delay_timeR | float ms | 1..2000 (log) | 500 | M |
| delay_divL | choice | same list as lfoN_div | 1/8D | |
| delay_divR | choice | same list as lfoN_div | 1/4 | |
| delay_feedback | float | 0..1.1 | 0.4 | M |
| delay_modRate | float Hz | 0.05..5 (log) | 0.3 | M |
| delay_modDepth | float | 0..1 | 0.2 | M |
| delay_lowCut | float Hz | 20..2000 (log) | 100 | |
| delay_highCut | float Hz | 1000..20000 (log) | 8000 | M |
| delay_duck | float | 0..1 | 0 | |
| delay_mix | float | 0..1 | 0.3 | M |
| reverb_on | bool | | 0 | |
| reverb_algo | choice | Room, Hall, Space | Hall | |
| reverb_size | float | 0..1 | 0.5 | M |
| reverb_decay | float s | 0.1..60 (log) | 3 | M |
| reverb_predelay | float ms | 0..250 | 20 | |
| reverb_damp | float | 0..1 | 0.5 | M |
| reverb_modRate | float Hz | 0.05..5 (log) | 0.4 | M |
| reverb_modDepth | float | 0..1 | 0.3 | M |
| reverb_lowCut | float Hz | 20..1000 (log) | 80 | |
| reverb_mix | float | 0..1 | 0.25 | M |

## Non-parameter state (saved in the preset but not automatable)

- MIDI learn map: list of (CC number, parameter ID) plus Learn slot 1-4 CC numbers.
- Preset metadata: name, author, category, tags, comment.
- User wavetable file name for Osc 3.
- Control Track and Arp step data are ordinary parameters above so they are
  automatable, but the GUI treats them as editors rather than knobs.
