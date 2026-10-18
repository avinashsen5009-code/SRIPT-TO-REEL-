# Project audit (Phase 1)

Source: `reel-studio-site-v9.zip` → static PWA, one `index.html` (~133 KB, 3 inline scripts), `sw.js`, `manifest.json`, `icon.svg`, two fetch helper scripts.

## Material findings
- Captions were drawn by two separate functions (`caption`, `capBig`) at fixed y=930 / 905 (≈70–73% of 1280). Colours, size, words-per-cue and on/off were not configurable.
- SRT was written per *scene* (sentence), not per caption cue, so it did not match what the preview showed.
- Word timing is either `autoW` (speech-recognition timestamps) or estimated from script length + audio loudness (`wordsT`). The UI never said which.
- Scene visuals were composed for y 140–860, i.e. they sat *behind* the new caption line.
- Projects stored script/settings/cuts/audio only; no caption data.
- `fonts/`, `vendor/`, `models/` are not in the ZIP (see README); core editing works without them, offline transcription and offline fonts do not until they are added (Phase 5).
- Pre-existing, untouched: in the non-sketch styles ("Trending", "Classic") the free library icon layers did not show up in my headless-Chromium run of the **original** v9 file either (text layers do). The default sketch style is unaffected. Needs a look in a real browser before Phase 2.
- Pre-existing, untouched: real-time export names the file `reel.mp4` although headless Chromium wrote VP9/Opus into it.

## Part 1 — Reel Studio Visual Engine Audit (October 2026)
- **AI Director & Metered Services**: Removed separate AI Director panel, Anthropic API dependencies (`SYS` prompt, `aiKey`, `aiScene`, `aiAll`), and photo credits textarea. Free local visual generation (`freeScene`, `freeAll`, `LIB`) and `aiDraw` renderer preserved for unlimited local graphic generation without paid keys or rate limits.
- **Visual Primitives Architecture**: Built 13 canvas/SVG primitives extending the existing `SC` table and `man()` character engine:
  - Expressive Stickman: Extended `POSES` with 6 dynamic gestures (`present`, `explain`, `run`, `clap`, `search`, `demonstrate`) and enhanced `faceDraw` (`wink`, `grin`, `focus`).
  - Animated Shapes & Diagrams: `P_list` (stepped checklist), `P_compare` (before/after contrast card), `P_timeline` (milestone tracker), `P_flow` (3-node flowchart), `P_donut` (radial gauge), `P_bars` (metric comparison).
  - Kinetic Typography & Callouts: `P_callout` (reactive speech bubble with keyword), `P_counter` (metric rolling counter with progress bar), `P_kintype` (staggered word burst with pill highlight), `P_quote` (quotation card).
  - 2.5D Compositions: `P_parallax` (4-depth-plane parallax with drift and shadows), `P_spotlight` (theatrical light cone with dust particles).
  - Mixed Scenes: `S_mixed` (full-stage composite combining stickman demonstration, 3-step flowchart, and kinetic pill).
  - Footage Compositions: Overlaid custom annotations (`annot`) and stickers (`sticker`) on b-roll videos and photos.
- **Design System Consistency**: Strict adherence to existing `INK` (`#F4F7FB`), `DK` (`#14202E`), theme accent palette `col`, `HF` font stack, rounded caps, standard stroke weights (5-8px), and harmonic motion physics (`ease`, `outCubic`, sine oscillators).
- **Per-Scene Picker Integration**: All 13 new primitives automatically populate in the per-scene visual selector dropdown (`OVR`), fully editable per scene.

## Part 3 + Library Expansion — Art Direction & Massive Visual Library (October 2026)

### Art Direction (Part 3)
- **Adjacent-scene pose variation**: Added `ROLE_POSES` dictionary mapping each narrative role to a pool of 4 pose names. `buildBeats` is patched to assign `B.artPose` per beat from the role pool, skipping the last pose used. `stage()` is patched to temporarily swap the SC entry's pose to `artPose` during rendering. The original SC entry is always restored after, preserving per-scene picker functionality.
- **Stickman interactions with diagrams**: `P_manDiagram` (character arm animates to point at diagram node that appears on spoken word), `P_carry` (character holds glowing radial-gradient orb with pulse ring), `S_pushWall` (solo: character pushes cracking red barrier as resistance increases), `S_climb` (solo: staircase builds bottom-up, character advances one step at a time).
- **Composition strategy**: Framing (wide/medium/close), side alternation, and emphasis gating were already implemented in Part 2. Part 3 adds pose diversity and stickman-object interaction to the composition layer.

### Library Expansion — 24 new visual compositions
| Category | Scenes Added |
|---|---|
| Stickman interactions | manDiagram, carry, pushWall, climb |
| Psychology & human behavior | decision, rewardLoop, attention, habitStack, lossAversion |
| Money, business & economics | compound, budget, debtCycle |
| Learning, productivity & self-improvement | spacedRep, focusDesk, skillArc |
| Digital, tech & social | algo, notifs |
| Science & relationships | causeEffect, venn |
| Data viz components | funnel, matrix, pyramid |
| Storytelling devices | revealWords, magnify |

- **Before expansion**: 49 SC entries, 41 CONCEPTS, 71 LIB icons  
- **After expansion**: 73 SC entries, 62 CONCEPTS, 86 LIB icons
- All new compositions follow the existing design system (INK/DK palette, ease/outCubic physics, HF font stack, consistent stroke weights)
- All 24 new scenes appear in the per-scene picker dropdown automatically (SC registration is the single source of truth)
- No external assets, no paid APIs, no metered services

## Part 4 — Studio Editorial Style & Reference Fusion (October 2026)

### Visual Style: `studio` ("Studio Editorial")
- **Visual Design System Fusion**: Merges the luxury editorial motion graphics from Video 1 (*Wink Guys*), the clean tech mascot & macOS UI execution from Video 2 (*Claude Code Skills*), and the expressive hand-drawn stickman character engine.
- **Ambient Mesh Canvas & Technical Studio HUD**:
  - Multi-point fluid ambient mesh gradient with 3 floating color orbs (royal indigo `#6366F1`, warm amber `#F59E0B`, pastel cyan `#38BDF8`) drifting smoothly over time.
  - Studio technical HUD telemetry framing: top-left `[ STUDIO // REEL 01 ]`, top-right `01 / 27 • 24 FPS • 9:16`, bottom-left `stickman engine • 1080p • render`, bottom-right dynamic timecode (`0.00s // ACTIVE`).
  - Active bottom hairline progress scrubber track with a glowing accent bead that moves synchronously with audio playback.
  - Corner micro-crosshairs (`+`) at frame margins for technical precision.
- **Clarity & Typography Hierarchy**:
  - Integrated `Playfair Display` (editorial serif with italics) paired with `ui-monospace` technical labels.
  - Uncompromising caption legibility anchored strictly within safe zones (`58.5%` height, clear of HUD and ground).
  - High-contrast anti-aliasing on all canvas shapes, strokes, and text.
- **8 Signature Visual Primitives Added from Reference Videos**:
  1. `codeTerminal`: macOS dark window with red/yellow/green dots, typing syntax-highlighted code, yellow sticky note (`"10x faster"`) with bouncing arrow.
  2. `bezierCurve`: Smooth cubic Bézier S-curve easing graph with keyframe diamonds, rolling velocity bead, and `"premium motion"` tag.
  3. `installProgress`: Progress card with retro pixel bot mascot, live progress bar ticking `0% -> 100%`, and status subtext.
  4. `taskChecklist`: macOS card with 4 execution pipeline tasks turning green with `[DONE]` badges in sequence.
  5. `growthChart`: GitHub star history / exponential growth curve with date axes, rising red trajectory curve, and glowing star.
  6. `fannedFiles`: 4 fanned document icons (`SKILL.md`, `brand.pdf`, `assets/`, `bundle.zip`) with numbered arrows (`1, 2, 3, 4`) and mouse cursor.
  7. `costComparison`: Low-cost local bar with `$` vs tall diagonal-striped tower with `$$$$$` and `10X EXPENSE` tag.
  8. `promptBar`: Pill-shaped AI chat prompt bar (`"message assistant..."`) with blinking purple cursor and send button.
  9. `redSlash`: Mockup UI card with an animated bold diagonal red marker slash and `"REJECTED"` stamp.
- **Total Library Counts**:
  - Visual Primitives in `SC`: **82** (was 73)
  - Concept Keyword Groups in `CONCEPTS`: **71** (was 62)
  - SVG Icon Library in `LIB`: **95** (was 86)
- **Zero API / Cloud Dependencies**: Pure client-side Canvas 2D/SVG execution.
