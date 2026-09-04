# Wayfarer Starter Presets

Twenty-two presets specified as exact parameter recipes using the IDs from
`PARAMETERS.md`. Prompt 12's `PresetGen` tool implements these first, verbatim,
then extends the bank to 80+. Anything not listed keeps its default from
`PARAMETERS.md`. All presets follow the macro convention:
Macro 1 = Brightness, Macro 2 = Motion, Macro 3 = Space, Macro 4 = Character.

Notation:
- `id = value` sets a parameter. Choice parameters use the choice name.
- `modK = Source > Destination, amount [, via Source]` fills matrix slot K.
- `ctA_steps = [..]` fills `ctA_step1..16`; unlisted steps are 0.
- Wavetables are referenced by factory family name from prompt 03. `PresetGen`
  resolves the name to `osc3_wtIndex`; if the exact name is missing, pick the
  closest table in that family and log it.
- `masterVolume` values are starting points; prompt 12's level-match pass
  overrides them to -6 dBFS peak.

---

## 1. Horizon Bed — Pad (the featured one)

A wide, slowly breathing pad with real depth that can carry a section alone,
yet is voiced to sit behind a lead or vocal: the low end is trimmed, the
900 Hz region is scooped so it does not fight melody instruments, the top is
soft, and all the motion is slow and below 0.3 Hz so nothing draws the ear.
Play it with sustained 3-4 note voicings in the C2-C4 range. Macro 1 opens it
up to the front of the mix, Macro 2 adds motion, Macro 3 pushes it further back.

```
# voicing
voiceMode = Poly
voices = 8
unisonVoices = 2
unisonDetune = 6
unisonSpread = 0.6
vintage = 0.3
oversampling = 2x
masterVolume = -6

# oscillators
osc1_on = 1
osc1_wave = 0.55          # saw with a little square edge
osc1_octave = 0
osc1_level = 0.55
osc1_pan = -0.2
osc1_phaseMode = Free

osc2_on = 1
osc2_wave = 0.42          # between triangle and saw, soft
osc2_octave = -1
osc2_level = 0.7
osc2_super = 1
osc2_superDetune = 18
osc2_superSpread = 0.9
osc2_superMix = 0.5

osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Cinematic Evolve 03"
osc3_wtPosition = 0.2
osc3_duo = 1
osc3_duoDetune = 8
osc3_duoSpread = 0.8
osc3_level = 0.45
osc3_pan = 0.15

noise_level = 0.06
noise_colour = 0.7

# filters: ladder for body, OTA for a brighter parallel layer
fltA_on = 1
fltA_type = Ladder24
fltA_cutoff = 900
fltA_res = 0.15
fltA_drive = 3
fltA_keytrack = 0.3
fltA_envAmt = 0.25
fltB_on = 1
fltB_type = NJM12
fltB_cutoff = 2400
fltB_res = 0.2
fltB_keytrack = 0.5
fltB_envAmt = 0.15
filterRouting = Parallel
filterBalance = -0.2
filterStereoOffset = 3

# envelopes
env1_mode = ADBSSR
env1_attack = 1.2
env1_decay = 2.0
env1_break = 0.6
env1_slope = 4.0
env1_sustain = 0.4
env1_release = 2.5
env1_attackCurve = 0.2

env2_attack = 0.9
env2_decay = 1.0
env2_sustain = 1.0
env2_release = 3.2
env2_attackCurve = 0.3
env2_velocity = 0.3

env3_attack = 3.0
env3_decay = 4.0
env3_sustain = 0.3
env3_release = 3.0
env3_trigger = LFO3

# LFOs (all slow)
lfo1_shape = Sine
lfo1_rate = 0.08
lfo1_fadeIn = 2.0
lfo1_keyTrigger = 0
lfo2_shape = Triangle
lfo2_rate = 0.21
lfo2_keyTrigger = 0
lfo3_shape = SmoothRandom
lfo3_rate = 0.3
lfo3_smooth = 0.6

# control tracks: gentle, smoothed into curves
ctA_on = 1
ctA_length = 8
ctA_sync = 1
ctA_div = 1/2
ctA_smooth = 0.9
ctA_direction = PingPong
ctA_steps = [0.2, 0.5, 0.1, 0.7, 0.3, 0.6, 0.0, 0.4]
ctA_dest = fltA_cutoff
ctA_destAmount = 0.35

ctB_on = 1
ctB_length = 6
ctB_sync = 1
ctB_div = 1 bar
ctB_smooth = 1.0
ctB_direction = Forward
ctB_steps = [0.0, 0.4, 0.8, 0.5, 0.9, 0.2]
ctB_dest = osc3_wtPosition
ctB_destAmount = 0.4

# mod matrix
mod1 = LFO1 > osc3_wtPosition, 0.3
mod2 = LFO2 > osc2_pan, 0.25
mod3 = LFO2 > fltA_cutoff, 0.08, via ModWheel
mod4 = Env3 > fltB_cutoff, 0.2
mod5 = LFO3 > osc3_duoDetune, 0.15
mod6 = Macro1 > fltA_cutoff, 0.6
mod7 = Macro1 > fltB_cutoff, 0.4
mod8 = Macro2 > ctA_depth, 0.5
mod9 = Macro2 > lfo1_depth, 0.5
mod10 = Macro3 > reverb_mix, 0.4
mod11 = Macro3 > delay_mix, 0.2
mod12 = Macro4 > vintage, 0.5
mod13 = Macro4 > fltA_drive, 0.4
mod14 = Aftertouch > fltA_cutoff, 0.3
mod15 = Velocity > fltA_cutoff, 0.15

# effects: EQ is what makes it sit behind
eq_on = 1
eq_lowGain = -2
eq_lowFreq = 120
eq_midGain = -3
eq_midFreq = 900
eq_midQ = 0.8
eq_highGain = -1.5
eq_highFreq = 8000

chorus_on = 1
chorus_mode = I+II
chorus_depth = 0.35
chorus_mix = 0.3

delay_on = 1
delay_mode = Dual
delay_sync = 1
delay_divL = 1/4D
delay_divR = 1/2
delay_feedback = 0.35
delay_modRate = 0.25
delay_modDepth = 0.25
delay_highCut = 4500
delay_duck = 0.4
delay_mix = 0.18

reverb_on = 1
reverb_algo = Space
reverb_size = 0.75
reverb_decay = 9
reverb_predelay = 40
reverb_damp = 0.6
reverb_modRate = 0.3
reverb_modDepth = 0.4
reverb_lowCut = 150
reverb_mix = 0.38
```

Metadata: author "Wayfarer", category Pad, tags "motion, wide, cinematic, background".

---

## 2. Glass Tide — Pad

Brighter, glassier companion to Horizon Bed for when the pad is the feature.

```
voices = 8
unisonVoices = 2
unisonDetune = 9
vintage = 0.2
osc1_on = 1
osc1_wave = 0.25
osc1_octave = 1
osc1_level = 0.4
osc2_on = 1
osc2_wave = 0.5
osc2_super = 1
osc2_superDetune = 24
osc2_superSpread = 1.0
osc2_level = 0.7
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Bell Partials 02"
osc3_wtPosition = 0.35
osc3_level = 0.4
fltA_type = Ladder12
fltA_cutoff = 2200
fltA_res = 0.25
fltA_envAmt = 0.3
fltA_keytrack = 0.7
filterStereoOffset = 2
env1_attack = 2.0
env1_decay = 3.0
env1_sustain = 0.5
env1_release = 3.0
env2_attack = 1.4
env2_sustain = 1
env2_release = 4.0
lfo1_shape = Sine
lfo1_rate = 0.12
lfo1_keyTrigger = 0
mod1 = LFO1 > osc3_wtPosition, 0.4
mod2 = LFO1 > osc1_pan, 0.3
mod3 = Macro1 > fltA_cutoff, 0.6
mod4 = Macro2 > lfo1_depth, 0.6
mod5 = Macro3 > reverb_mix, 0.4
mod6 = Macro4 > vintage, 0.6
chorus_on = 1
chorus_mode = I
chorus_mix = 0.35
reverb_on = 1
reverb_algo = Hall
reverb_decay = 6
reverb_mix = 0.35
masterVolume = -8
```

---

## 3. Low Orbit — Pad

Dark, sub-heavy pad for underscoring. Mono-compatible low end, stereo top.

```
voices = 6
osc1_on = 1
osc1_wave = 0.5
osc1_octave = -2
osc1_level = 0.8
osc2_on = 1
osc2_wave = 0.0          # sine
osc2_octave = -2
osc2_level = 0.6
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Spectral Tilt 01"
osc3_duo = 1
osc3_duoSpread = 1.0
osc3_octave = 0
osc3_level = 0.35
fltA_type = Ladder24
fltA_cutoff = 400
fltA_res = 0.3
fltA_drive = 6
fltA_envAmt = 0.4
env1_attack = 3.0
env1_decay = 5.0
env1_sustain = 0.3
env1_release = 4.0
env2_attack = 2.0
env2_sustain = 1
env2_release = 5.0
ctA_on = 1
ctA_length = 4
ctA_div = 1 bar
ctA_smooth = 1.0
ctA_steps = [0.0, 0.6, 0.3, 0.9]
ctA_dest = fltA_cutoff
ctA_destAmount = 0.3
mod1 = Macro1 > fltA_cutoff, 0.7
mod2 = Macro2 > ctA_depth, 0.7
mod3 = Macro3 > reverb_mix, 0.5
mod4 = Macro4 > fltA_drive, 0.6
reverb_on = 1
reverb_algo = Space
reverb_decay = 12
reverb_lowCut = 200
reverb_mix = 0.3
masterVolume = -6
```

---

## 4. Vapour Choir — Pad

Formant wavetable "voices" with slow vowel motion.

```
voices = 8
unisonVoices = 2
unisonDetune = 7
osc1_on = 0
osc2_on = 1
osc2_wave = 0.35
osc2_super = 1
osc2_superDetune = 12
osc2_superSpread = 0.8
osc2_level = 0.5
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Vowel Sweep 01"
osc3_wtPosition = 0.1
osc3_duo = 1
osc3_duoDetune = 6
osc3_duoSpread = 0.9
osc3_level = 0.8
fltA_type = NJM24
fltA_cutoff = 3000
fltA_res = 0.15
env2_attack = 1.2
env2_release = 3.5
env2_sustain = 1
lfo1_shape = Triangle
lfo1_rate = 0.06
lfo1_keyTrigger = 0
mod1 = LFO1 > osc3_wtPosition, 0.6
mod2 = ModWheel > osc3_wtPosition, 0.5
mod3 = Macro1 > fltA_cutoff, 0.5
mod4 = Macro2 > lfo1_rate, 0.6
mod5 = Macro3 > reverb_mix, 0.4
mod6 = Macro4 > osc3_duoDetune, 0.5
chorus_on = 1
chorus_mode = II
chorus_mix = 0.3
reverb_on = 1
reverb_algo = Hall
reverb_size = 0.8
reverb_decay = 7
reverb_mix = 0.4
masterVolume = -7
```

---

## 5. Sync Bass — Bass

Punchy Osc 1 hard-sync bass with a swept sync envelope.

```
voiceMode = Mono
glideMode = Legato
glideTime = 0.06
osc1_on = 1
osc1_wave = 0.6
osc1_octave = -1
osc1_sync = 1
osc1_level = 0.9
osc2_on = 1
osc2_wave = 0.5
osc2_octave = -2
osc2_level = 0.5
fltA_type = Ladder24
fltA_cutoff = 500
fltA_res = 0.2
fltA_drive = 8
fltA_envAmt = 0.6
env1_attack = 0.002
env1_decay = 0.35
env1_sustain = 0.1
env1_release = 0.2
env2_attack = 0.002
env2_decay = 0.5
env2_sustain = 0.8
env2_release = 0.15
env3_attack = 0.001
env3_decay = 0.25
env3_sustain = 0.0
env3_release = 0.1
mod1 = Env3 > osc1_pitch, 0.7        # sync sweep: master stays, slave pitch sweeps
mod2 = Velocity > fltA_cutoff, 0.4
mod3 = Macro1 > fltA_cutoff, 0.7
mod4 = Macro2 > env3_decay, 0.5
mod5 = Macro4 > fltA_drive, 0.7
eq_on = 1
eq_lowGain = 2
eq_lowFreq = 70
masterVolume = -6
```

---

## 6. Deep Round — Bass

Clean sine-plus-triangle sub for the bottom of a track.

```
voiceMode = Mono
glideMode = Always
glideTime = 0.03
osc1_on = 1
osc1_wave = 0.0
osc1_octave = -2
osc1_level = 1.0
osc2_on = 1
osc2_wave = 0.2
osc2_octave = -1
osc2_level = 0.3
fltA_type = Ladder12
fltA_cutoff = 300
fltA_envAmt = 0.3
env1_decay = 0.2
env1_sustain = 0.2
env2_attack = 0.003
env2_release = 0.12
env2_velocity = 0.6
mod1 = Macro1 > fltA_cutoff, 0.6
mod2 = Macro4 > osc2_level, 0.6
masterVolume = -4
```

---

## 7. Analogue Grit — Bass

OTA filter driven hard, Super stack for width, mono with glide.

```
voiceMode = Mono
glideMode = Legato
glideTime = 0.08
vintage = 0.5
osc1_on = 1
osc1_wave = 0.7
osc1_octave = -1
osc1_level = 0.8
osc2_on = 1
osc2_wave = 0.55
osc2_octave = -1
osc2_super = 1
osc2_superDetune = 15
osc2_superSpread = 0.5
osc2_level = 0.6
noise_level = 0.05
fltA_type = NJM24
fltA_cutoff = 700
fltA_res = 0.45
fltA_drive = 14
fltA_envAmt = 0.5
env1_decay = 0.4
env1_sustain = 0.2
env2_attack = 0.004
env2_decay = 0.4
env2_sustain = 0.9
env2_release = 0.2
mod1 = Velocity > fltA_cutoff, 0.5
mod2 = Macro1 > fltA_cutoff, 0.7
mod3 = Macro4 > fltA_drive, 0.5
mod4 = Macro4 > fltA_res, 0.3
masterVolume = -6
```

---

## 8. Solaris Lead — Lead

Classic detuned lead with vibrato on aftertouch and a delay throw.

```
voiceMode = Legato
glideMode = Legato
glideTime = 0.12
unisonVoices = 3
unisonDetune = 14
unisonSpread = 0.4
vintage = 0.35
osc1_on = 1
osc1_wave = 0.6
osc1_level = 0.8
osc2_on = 1
osc2_wave = 0.6
osc2_fine = 7
osc2_level = 0.8
osc3_on = 1
osc3_wave = 0.6
osc3_octave = -1
osc3_level = 0.4
fltA_type = Ladder24
fltA_cutoff = 1800
fltA_res = 0.2
fltA_drive = 4
fltA_envAmt = 0.4
fltA_keytrack = 0.6
env1_decay = 0.5
env1_sustain = 0.5
env2_attack = 0.01
env2_sustain = 1
env2_release = 0.4
lfo1_shape = Sine
lfo1_rate = 5.5
lfo1_fadeIn = 0.4
mod1 = Aftertouch > lfo1_depth, 1.0
mod2 = LFO1 > osc1_pitch, 0.08
mod3 = LFO1 > osc2_pitch, 0.08
mod4 = LFO1 > osc3_pitch, 0.08
mod5 = ModWheel > fltA_cutoff, 0.4
mod6 = Macro1 > fltA_cutoff, 0.6
mod7 = Macro3 > delay_mix, 0.4
mod8 = Macro4 > unisonDetune, 0.5
delay_on = 1
delay_mode = PingPong
delay_divL = 1/8D
delay_divR = 1/8D
delay_feedback = 0.45
delay_mix = 0.25
reverb_on = 1
reverb_algo = Hall
reverb_decay = 2.5
reverb_mix = 0.2
masterVolume = -8
```

---

## 9. Wire Lead — Lead

Osc 1 exponential FM from Osc 3 for a hard, metallic mono lead.

```
voiceMode = Mono
glideMode = Always
glideTime = 0.05
osc1_on = 1
osc1_wave = 0.0
osc1_fmSource = Osc3
osc1_fmExp = 0.35
osc1_level = 0.9
osc3_on = 1
osc3_wave = 0.0
osc3_octave = 1
osc3_semi = 7
osc3_level = 0.0            # FM source only, not heard
fltA_type = NJM12
fltA_cutoff = 4000
fltA_res = 0.1
env1_decay = 0.3
env1_sustain = 0.4
env2_attack = 0.005
env2_release = 0.3
env3_attack = 0.001
env3_decay = 0.4
env3_sustain = 0.2
mod1 = Env3 > osc1_fmExp, 0.5
mod2 = Velocity > osc1_fmExp, 0.3
mod3 = Macro1 > fltA_cutoff, 0.5
mod4 = Macro4 > osc1_fmExp, 0.5
delay_on = 1
delay_mode = Dual
delay_divL = 1/8
delay_divR = 1/4
delay_feedback = 0.3
delay_mix = 0.2
masterVolume = -8
```

---

## 10. Felt Keys — Keys

Soft electric-piano style keys from wavetable Osc 3 plus a sine.

```
voices = 12
osc1_on = 1
osc1_wave = 0.0
osc1_level = 0.5
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Additive Harmonic 04"
osc3_wtPosition = 0.15
osc3_level = 0.8
fltA_type = Ladder12
fltA_cutoff = 2500
fltA_keytrack = 1.0
fltA_envAmt = 0.35
fltA_velAmt = 0.5
env1_attack = 0.002
env1_decay = 0.9
env1_sustain = 0.1
env1_release = 0.5
env2_attack = 0.002
env2_decay = 2.5
env2_sustain = 0.4
env2_release = 0.6
env2_velocity = 0.7
mod1 = Velocity > osc3_wtPosition, 0.3
mod2 = Macro1 > fltA_cutoff, 0.5
mod3 = Macro3 > reverb_mix, 0.4
chorus_on = 1
chorus_mode = I
chorus_mix = 0.25
reverb_on = 1
reverb_algo = Room
reverb_decay = 1.2
reverb_mix = 0.2
masterVolume = -8
```

---

## 11. Drawbar Glow — Keys

Organ-style additive table with a slow chorus and Vintage wobble.

```
voices = 12
vintage = 0.4
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Organ Drawbars 02"
osc3_wtPosition = 0.3
osc3_level = 0.9
osc1_on = 1
osc1_wave = 0.0
osc1_octave = -1
osc1_level = 0.4
fltA_type = Ladder6
fltA_cutoff = 6000
env2_attack = 0.005
env2_sustain = 1
env2_release = 0.08
mod1 = ModWheel > osc3_wtPosition, 0.6
mod2 = Macro1 > osc3_wtPosition, 0.6
mod3 = Macro3 > reverb_mix, 0.4
chorus_on = 1
chorus_mode = I+II
chorus_mix = 0.4
reverb_on = 1
reverb_algo = Room
reverb_mix = 0.15
masterVolume = -8
```

---

## 12. Rain Pluck — Pluck

Short OTA pluck with ping-pong delay, made for arpeggios.

```
voices = 16
osc1_on = 1
osc1_wave = 0.45
osc1_level = 0.8
osc2_on = 1
osc2_wave = 0.45
osc2_octave = 1
osc2_fine = 5
osc2_level = 0.4
fltA_type = NJM24
fltA_cutoff = 600
fltA_res = 0.3
fltA_envAmt = 0.7
fltA_keytrack = 0.5
fltA_velAmt = 0.4
env1_attack = 0.001
env1_decay = 0.25
env1_sustain = 0.0
env1_release = 0.25
env2_attack = 0.001
env2_decay = 0.6
env2_sustain = 0.0
env2_release = 0.4
mod1 = Macro1 > fltA_cutoff, 0.6
mod2 = Macro3 > delay_mix, 0.5
mod3 = Macro4 > fltA_res, 0.5
delay_on = 1
delay_mode = PingPong
delay_divL = 1/8D
delay_divR = 1/8D
delay_feedback = 0.5
delay_highCut = 5000
delay_mix = 0.3
reverb_on = 1
reverb_algo = Hall
reverb_decay = 3
reverb_mix = 0.2
masterVolume = -8
```

---

## 13. Marimba Wire — Pluck

Linear FM bell-pluck. Velocity controls FM amount so it goes from wood to glass.

```
voices = 16
osc1_on = 1
osc1_wave = 0.0
osc1_fmSource = Osc2
osc1_fmLin = 0.2
osc1_level = 0.9
osc2_on = 1
osc2_wave = 0.0
osc2_octave = 2
osc2_level = 0.0
fltA_type = Ladder12
fltA_cutoff = 8000
env2_attack = 0.001
env2_decay = 1.2
env2_sustain = 0.0
env2_release = 0.8
env3_attack = 0.001
env3_decay = 0.3
env3_sustain = 0.0
mod1 = Env3 > osc1_fmLin, 0.5
mod2 = Velocity > osc1_fmLin, 0.4
mod3 = Macro4 > osc1_fmLin, 0.5
mod4 = Macro3 > reverb_mix, 0.5
reverb_on = 1
reverb_algo = Hall
reverb_decay = 4
reverb_mix = 0.3
masterVolume = -8
```

---

## 14. Nightdrive — Sequence

Arpeggiated 16th sequence with a Control Track filter groove and step envelopes.

```
voices = 8
vintage = 0.25
osc1_on = 1
osc1_wave = 0.6
osc1_octave = -1
osc1_level = 0.8
osc2_on = 1
osc2_wave = 0.7
osc2_octave = -1
osc2_fine = -6
osc2_level = 0.6
fltA_type = Ladder24
fltA_cutoff = 500
fltA_res = 0.3
fltA_drive = 5
fltA_envAmt = 0.5
env1_attack = 0.001
env1_decay = 0.2
env1_sustain = 0.1
env2_attack = 0.001
env2_decay = 0.3
env2_sustain = 0.4
env2_release = 0.15
arp_on = 1
arp_mode = Up
arp_div = 1/16
arp_octaves = 2
arp_gate = 0.6
arp_swing = 0.12
arp_velMode = Step
arp_steps = 8
arp_stepVel1 = 1.0
arp_stepVel2 = 0.6
arp_stepVel3 = 0.8
arp_stepVel4 = 0.6
arp_stepVel5 = 0.9
arp_stepVel6 = 0.6
arp_stepVel7 = 0.7
arp_stepVel8 = 0.5
arp_stepEnv1 = -0.5
arp_stepEnv5 = 0.4
arp_stepTie7 = 1
ctA_on = 1
ctA_length = 16
ctA_div = 1/16
ctA_smooth = 0.15
ctA_swing = 0.12
ctA_steps = [0.8, 0.2, 0.5, 0.1, 0.9, 0.3, 0.6, 0.0, 0.7, 0.2, 0.4, 0.1, 1.0, 0.3, 0.5, 0.2]
ctA_dest = fltA_cutoff
ctA_destAmount = 0.5
mod1 = Velocity > fltA_cutoff, 0.4
mod2 = Macro1 > fltA_cutoff, 0.6
mod3 = Macro2 > ctA_depth, 0.8
mod4 = Macro3 > delay_mix, 0.4
mod5 = Macro4 > fltA_drive, 0.6
delay_on = 1
delay_mode = PingPong
delay_divL = 1/8D
delay_divR = 1/8D
delay_feedback = 0.4
delay_duck = 0.5
delay_mix = 0.2
masterVolume = -8
```

---

## 15. Pad Under, Pulse Over — Sequence

Arp oscillator targeting: Osc 2 holds the chord as a pad while Osc 1 arpeggiates.

```
voices = 16
osc1_on = 1
osc1_wave = 0.5
osc1_level = 0.7
osc2_on = 1
osc2_wave = 0.4
osc2_octave = -1
osc2_super = 1
osc2_superDetune = 16
osc2_superSpread = 0.9
osc2_level = 0.6
fltA_type = Ladder24
fltA_cutoff = 1200
fltA_res = 0.2
fltA_envAmt = 0.3
fltB_on = 1
fltB_type = NJM12
fltB_cutoff = 1500
filterRouting = Split
filterStereoOffset = 2
env1_decay = 0.3
env1_sustain = 0.3
env2_attack = 0.005
env2_decay = 0.5
env2_sustain = 0.7
env2_release = 1.5
arp_on = 1
arp_mode = UpDownExc
arp_div = 1/8
arp_octaves = 2
arp_gate = 0.5
arp_target = Osc1
lfo1_shape = Sine
lfo1_rate = 0.1
lfo1_keyTrigger = 0
mod1 = LFO1 > osc2_pan, 0.3
mod2 = Macro1 > fltA_cutoff, 0.6
mod3 = Macro2 > arp_gate, 0.5
mod4 = Macro3 > reverb_mix, 0.5
delay_on = 1
delay_divL = 1/8D
delay_divR = 1/4
delay_feedback = 0.35
delay_mix = 0.2
reverb_on = 1
reverb_algo = Hall
reverb_decay = 5
reverb_mix = 0.3
masterVolume = -8
```

---

## 16. Tidal Motion — Motion

Both Control Tracks in ping-pong at different lengths driving wavetable position
and pan, so the pattern never repeats exactly. Hold one note.

```
voices = 4
unisonVoices = 3
unisonDetune = 10
unisonSpread = 1.0
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "FM Scan 03"
osc3_duo = 1
osc3_duoSpread = 1.0
osc3_level = 0.9
osc1_on = 1
osc1_wave = 0.0
osc1_octave = -1
osc1_level = 0.4
fltA_type = Ladder12
fltA_cutoff = 1500
fltA_res = 0.2
env2_attack = 0.5
env2_sustain = 1
env2_release = 2.0
ctA_on = 1
ctA_length = 7
ctA_div = 1/8
ctA_smooth = 0.6
ctA_direction = PingPong
ctA_steps = [0.0, 0.3, 0.7, 1.0, 0.5, 0.2, 0.8]
ctA_dest = osc3_wtPosition
ctA_destAmount = 0.8
ctB_on = 1
ctB_length = 5
ctB_div = 1/4
ctB_smooth = 0.8
ctB_direction = PingPong
ctB_steps = [-0.8, 0.4, -0.2, 0.9, -0.6]
ctB_dest = osc3_pan
ctB_destAmount = 0.7
mod1 = CtrlA > fltA_cutoff, 0.3
mod2 = Macro1 > fltA_cutoff, 0.6
mod3 = Macro2 > ctA_smooth, -0.6
mod4 = Macro3 > reverb_mix, 0.5
delay_on = 1
delay_divL = 1/8D
delay_divR = 1/4D
delay_feedback = 0.4
delay_modDepth = 0.4
delay_mix = 0.25
reverb_on = 1
reverb_algo = Space
reverb_decay = 8
reverb_mix = 0.3
masterVolume = -8
```

---

## 17. Breathing Machine — Motion

Env 3 retriggered by LFO 2 shapes the filter rhythmically; random Control Track
adds per-cycle variation.

```
voices = 6
osc1_on = 1
osc1_wave = 0.65
osc1_level = 0.8
osc2_on = 1
osc2_wave = 0.65
osc2_octave = -1
osc2_fine = 4
osc2_level = 0.6
fltA_type = NJM24
fltA_cutoff = 300
fltA_res = 0.4
fltA_drive = 6
env2_attack = 0.3
env2_sustain = 1
env2_release = 1.0
env3_attack = 0.01
env3_decay = 0.35
env3_sustain = 0.0
env3_trigger = LFO2
lfo2_shape = Square
lfo2_sync = 1
lfo2_div = 1/8
lfo2_keyTrigger = 1
ctA_on = 1
ctA_length = 8
ctA_div = 1/8
ctA_random = 0.5
ctA_steps = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
ctA_dest = env3_decay
ctA_destAmount = 0.5
mod1 = Env3 > fltA_cutoff, 0.7
mod2 = Macro1 > fltA_cutoff, 0.5
mod3 = Macro2 > ctA_random, 0.8
mod4 = Macro4 > fltA_drive, 0.6
delay_on = 1
delay_mode = PingPong
delay_divL = 1/16
delay_divR = 1/16
delay_feedback = 0.3
delay_mix = 0.15
masterVolume = -8
```

---

## 18. Ice Sheet — FX

Slow-rising noise and wavetable texture with Space reverb. Sound-design riser.

```
voices = 2
osc1_on = 0
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Noise Shaped 01"
osc3_duo = 1
osc3_duoDetune = 30
osc3_duoSpread = 1.0
osc3_level = 0.7
noise_level = 0.6
noise_colour = 0.4
fltA_type = Ladder24
fltA_cutoff = 200
fltA_res = 0.5
fltA_envAmt = 0.9
env1_attack = 6.0
env1_decay = 2.0
env1_sustain = 1.0
env1_release = 4.0
env2_attack = 4.0
env2_sustain = 1
env2_release = 6.0
lfo1_shape = Drift
lfo1_rate = 0.5
lfo1_smooth = 0.7
mod1 = LFO1 > osc3_wtPosition, 0.6
mod2 = LFO1 > fltA_res, 0.2
mod3 = Macro1 > fltA_cutoff, 0.8
mod4 = Macro2 > env1_attack, -0.7
mod5 = Macro3 > reverb_decay, 0.6
delay_on = 1
delay_mode = Dual
delay_sync = 0
delay_timeL = 410
delay_timeR = 620
delay_feedback = 0.6
delay_modDepth = 0.6
delay_mix = 0.3
reverb_on = 1
reverb_algo = Space
reverb_size = 1.0
reverb_decay = 20
reverb_modDepth = 0.6
reverb_mix = 0.5
masterVolume = -10
```

---

## 19. Drop Tone — FX

Pitch-drop hit with a big sync sweep and reverb tail. Play single notes.

```
voiceMode = Mono
osc1_on = 1
osc1_wave = 0.7
osc1_sync = 1
osc1_level = 1.0
osc2_on = 1
osc2_wave = 0.5
osc2_octave = -1
osc2_level = 0.6
fltA_type = Ladder24
fltA_cutoff = 3000
fltA_res = 0.3
fltA_drive = 10
env2_attack = 0.001
env2_decay = 2.5
env2_sustain = 0.0
env2_release = 1.0
env3_attack = 0.001
env3_decay = 1.8
env3_sustain = 0.0
mod1 = Env3 > osc1_pitch, 1.0
mod2 = Env3 > osc2_pitch, 0.5
mod3 = Env3 > fltA_cutoff, 0.6
mod4 = Macro4 > fltA_drive, 0.6
mod5 = Macro3 > reverb_mix, 0.5
reverb_on = 1
reverb_algo = Hall
reverb_decay = 6
reverb_mix = 0.4
masterVolume = -8
```

---

## 20. Tectonic — Drone

Sub-octave drone with slowly rotating OTA filter and Vintage instability.

```
voiceMode = Mono
unisonVoices = 4
unisonDetune = 5
unisonSpread = 1.0
vintage = 0.6
osc1_on = 1
osc1_wave = 0.6
osc1_octave = -2
osc1_level = 0.8
osc2_on = 1
osc2_wave = 0.6
osc2_octave = -3
osc2_level = 0.6
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Phase Distortion 02"
osc3_octave = -1
osc3_level = 0.4
fltA_type = NJM24
fltA_cutoff = 250
fltA_res = 0.5
fltA_drive = 8
fltB_on = 1
fltB_type = Ladder12
fltB_cutoff = 1200
filterRouting = Parallel
filterBalance = -0.4
filterStereoOffset = 5
env2_attack = 2.0
env2_sustain = 1
env2_release = 6.0
lfo1_shape = Sine
lfo1_rate = 0.03
lfo1_keyTrigger = 0
lfo2_shape = Drift
lfo2_rate = 0.2
lfo2_smooth = 0.8
mod1 = LFO1 > fltA_cutoff, 0.5
mod2 = LFO2 > osc3_wtPosition, 0.5
mod3 = LFO2 > fltB_cutoff, 0.2
mod4 = Macro1 > fltA_cutoff, 0.6
mod5 = Macro2 > lfo1_rate, 0.5
mod6 = Macro3 > reverb_mix, 0.5
mod7 = Macro4 > vintage, 0.4
reverb_on = 1
reverb_algo = Space
reverb_decay = 15
reverb_lowCut = 120
reverb_mix = 0.3
masterVolume = -6
```

---

## 21. Halo Drone — Drone

High, shimmering drone from Duo wavetables and Space reverb pitch drift.

```
voices = 4
unisonVoices = 2
unisonDetune = 4
osc3_on = 1
osc3_mode = Wavetable
osc3_wavetable = "Bell Partials 04"
osc3_octave = 1
osc3_duo = 1
osc3_duoDetune = 12
osc3_duoSpread = 1.0
osc3_level = 0.8
osc1_on = 1
osc1_wave = 0.0
osc1_level = 0.3
fltA_type = Ladder6
fltA_cutoff = 5000
env2_attack = 3.0
env2_sustain = 1
env2_release = 8.0
lfo1_shape = SmoothRandom
lfo1_rate = 0.15
lfo1_keyTrigger = 0
mod1 = LFO1 > osc3_wtPosition, 0.5
mod2 = LFO1 > osc3_pan, 0.4
mod3 = Macro2 > lfo1_depth, 0.6
mod4 = Macro3 > reverb_decay, 0.7
chorus_on = 1
chorus_mode = II
chorus_mix = 0.3
reverb_on = 1
reverb_algo = Space
reverb_size = 0.9
reverb_decay = 25
reverb_modDepth = 0.7
reverb_mix = 0.55
masterVolume = -10
```

---

## 22. Init Motion — Template

A clean starting point with the macro routing and both Control Tracks already
wired, so new motion patches start from something musical.

```
osc1_on = 1
osc1_wave = 0.5
osc1_level = 0.8
fltA_type = Ladder24
fltA_cutoff = 2000
fltA_envAmt = 0.3
env1_decay = 0.5
env1_sustain = 0.5
env2_attack = 0.01
env2_sustain = 1
env2_release = 0.4
ctA_on = 1
ctA_length = 8
ctA_div = 1/8
ctA_smooth = 0.3
ctA_dest = fltA_cutoff
ctA_destAmount = 0.0
ctB_on = 1
ctB_length = 8
ctB_div = 1/4
ctB_smooth = 0.5
ctB_dest = osc1_pan
ctB_destAmount = 0.0
mod1 = Macro1 > fltA_cutoff, 0.6
mod2 = Macro2 > ctA_destAmount, 0.6
mod3 = Macro3 > reverb_mix, 0.5
mod4 = Macro4 > vintage, 0.5
reverb_on = 1
reverb_algo = Hall
reverb_mix = 0.2
masterVolume = -6
```

---

## Notes for PresetGen (prompt 12)

- Implement a small parser for this file's `id = value`, `modK = ...`,
  `ctX_steps = [...]` and `osc3_wavetable = "name"` lines so the bank is regenerated
  from this document, and unit-test that all 22 load and render.
- `ctA_destAmount` used as a mod destination in preset 22 is not in the `M` list.
  Add it (and `ctB_destAmount`) to `ModDestinations` in prompt 12 as a documented
  addition; this is allowed because IDs are only added, never renamed.
- Where a preset sets a per-step parameter by explicit ID (`arp_stepVel3`), the
  parser handles it as a normal `id = value`.
