# Implementation log

## Phase 1: captions and editing foundation (done)
Decisions
- One caption renderer `drawCap` for every Reel style; settings live in `CAP`, edits in `CW`, guides in `SAFE`. Sketch handwriting/marker look kept (marker = Strong emphasis).
- Default caption centre = 58.5% of frame height (adjustable 55–62%). Old 70–73% positions removed; visuals recomposed via `VIS`/`compose()` (ground line y=650, scale 0.72×) so they sit above the captions. Photo/video scenes stay full-bleed.
- Safe zones = DOM overlay above the canvas (`#safe`), so export can never contain them. Defaults top 12 / bottom 22 / right 12 % (approximate). The right margin also limits caption width.
- Word text edits write into `sents` + the script box (and `autoW`/`CW` if present), so a rebuild keeps corrections. Cue split/merge and cue start/end edits live in `CW[scene] = {w:[{w,s,e,m}], c:[cue start word indexes]|null}`; `m` marks hand-timed words.
- Timing label per scene: aligned (speech-recognition timestamps) / estimated / edited / beat grid.
- SRT and the new VTT are generated from `tl` (the same cues the preview draws).
- Projects now also store `sents`, `cap`, `safe`, `cw`. Older projects open with defaults.

Changed: `index.html` (caption data/render/UI/projects/SRT/VTT, new script block at end), `sw.js` (cache v10), `README.md`.

Tests (headless Chromium via Playwright, 37 checks, all passed): default/slider position; 1/2/3 words per cue; style/emphasis/colour; captions off; guides on/off give identical canvas pixels; long Hindi word stays inside the frame at 100% and 140%; Hindi numeral, Hinglish split, ₹/comma/danda edits; cue timing edit; split/merge incl. surviving a words-per-cue change; SRT/VTT content; tap preview word → editor field; save/open round-trip; old-format project; aligned label (simulated word timestamps). One real-time export (guides on) was decoded with ffmpeg: 720×1280, no guides, caption at 58.5%.

Not tested: real speech-recognition run (needs the model/internet), the fast WebCodecs export (CDN muxer blocked here), phone/touch devices, Safari/Firefox, 1080×1920 export, Hind/Kalam fonts (not bundled; fallback fonts were used).

Known limits
- Rebuilding from the script, re-transcribing or loading new audio discards cue/timing edits (asks first for the buttons; word corrections stay). A correction that adds `.?!।` mid-sentence will split the scene on the next rebuild from the script.
- Edited words get new times by interpolation; "aligned" is only as good as the recognizer.
- No undo yet (Phase 3).

## Part 1: Visual Engine Upgrade (done)
Decisions:
- Removed paid AI Director: dropped `#ak`, `#am`, `#ag`, `#ai`, `#as` DOM elements, `aiKey()`, `SYS` prompt, `aiScene()`, `aiAll()`, and per-scene `Redo AI visual` button.
- Retained `AIV`, `aiLoad`, `svgImg`, and `aiDraw` renderer to power unlimited local free graphic synthesis (`freeAll`) and music mode (`doMusic`).
- Removed photo credits textarea (`#cr`) and `credits()` helper while preserving media upload, preview, playback, and export.
- Enhanced footage compositions: overlaid custom annotations (`annot`) and stickers (`sticker`) on user b-roll videos and photos in `drawPrev()`.
- Built 13 visual primitives registered in `SC` (`list`, `compare`, `timeline`, `flow`, `donut`, `bars`, `callout`, `counter`, `kintype`, `quote`, `parallax`, `spotlight`, `mixed`).
- Added 6 expressive stickman poses (`present`, `explain`, `run`, `clap`, `search`, `demonstrate`) and 3 facial expressions (`wink`, `grin`, `focus`).
- Added 13 auto-detection keyword categories to `CONCEPTS` and 10 SVG icons to `LIB` for local keyword-based graphic selection.
- All primitives automatically integrate with the per-scene visual selector (`OVR`) and respect theme colors (`cine`, `neon`, `gold`, `fire`), reel styles (`sketch`, `trend`, `classic`), and caption boundaries.

Changed: `index.html` (UI cleanup, footage overlay, new primitives script block), `PROJECT_AUDIT.md`, `IMPLEMENTATION_LOG.md`.

Tests (Automated headless Chrome CDP test suite, 15 checks, all passed):
- Document title and clean DOM startup
- Complete removal of `#ak`, `#am`, `#ag`, `#ai`, `#cr` elements
- Preservation of core functions (`SC`, `POSES`, `PAL`, `drawPrev`, `stage`, `sketchScene`, `drawCap`, `freeAll`, `align`, `exportVideo`, `AIV`)
- Registration and canvas rendering of all 13 primitives without errors
- Registration of 6 expressive poses in `POSES`
- Registration of 41 `CONCEPTS` categories and 71 `LIB` SVG icons
- Sample script alignment into 4 scenes
- Dynamic per-scene dropdown option population (46 selectable scenes in `vsel`)
- Theme switching across 4 color palettes (`cine`, `neon`, `gold`, `fire`)
- Style switching across 3 reel styles (`sketch`, `trend`, `classic`)
- Manual per-scene visual overrides (`OVR`) rendering
- Captions customization (`applyCap`) and safe zone overlays
- Zero runtime page exceptions in headless Chrome

Known limits:
- Indian Hindi numeral extraction in `P_counter` parses single numbers from sentence text; complex multi-number sentences use the first number.
- `S_mixed` uses a fixed 2-column layout; custom layout arrangements for mixed scenes can be expanded in later parts.

Next: Awaiting user permission before proceeding beyond Part 1.

## Part 2: Narration-aware scene plan (done)
Decisions:
- Still no AI/network: a deterministic planner (`buildPlan`) reads each scene's text and position to assign a narrative role (hook/problem/mechanism/example/contrast/list/evidence/takeaway), a core idea, and an uncertainty flag when no signal is found. Roles are editable per scene in the new "Scene plan" panel (`PROLE`), saved in projects and exported in scene JSON.
- `conceptOf` replaced by `conceptHit`, which returns the concept *and the time of the word that triggered it*; props now pop on the spoken word (`B.anchor`) instead of a fixed beat offset.
- `buildBeats` rewritten: beat window 1.1s → 1.7s (changes every ~1.5–2.5s, complex explanations breathe), role-driven fallbacks (mech diagram, contrast seesaw, list, core hook), no visual repeated in adjacent beats, alternating composition side, cycling framing (wide/medium/close), emphasis flag per beat.
- Effects are now selective: punch zoom, white flash and beat zig-zag lines only on keyword beats or hook/takeaway scene entries; stickers only on emphasis/hook/takeaway beats with a 3-beat gap; the handwritten annotation appears when a beat has a keyword or is uncertain.
- New visuals registered in `SC`: `mech` (progressive cause→effect nodes+arrows), `contrast` (seesaw + VS), `list` (rows slide in with ticks), `core` (opening-second typographic hook with reacting stickman). No statistics, quotes or facts are invented anywhere.
- Global **Visual direction** preference (`#dir`: Balanced / Stickman-forward / Motion-graphics-forward / Footage-forward) re-balances composition via `DIRS` (character scale/placement vs prop scale/placement) inside `stage()`; Footage-forward also grades photos/clips lighter with a calmer zoom in `broll()`. The per-scene visual picker (`OVR`), media controls and all existing styles are unchanged and still take precedence.
- Removed nothing: the old free library path (`freeAll`/`AIV`), music mode, captions panel and projects all keep working; projects now also store `dir` + `prole`.

Changed: `index.html` (planner, beats, stage/broll, new props/solo, plan panel UI, JSON export, snap/openProj), `sw.js` (cache v11), `README.md`.

Tests: see Part 2 test notes at the end of this session's log (browser smoke test on the sample script).

### Part 2 test notes (in-browser, Chromium via localhost static server)
Synthetic Hindi script covering hook / abstract concept / example / list / contrast / evidence / takeaway + a speech-like WAV with word-level bursts (no network, no APIs).
- Roles detected exactly: hook, mechanism, contrast, example, list, mechanism, evidence, takeaway; 0 unexpected-uncertainty flags; plan panel shows 8 rows.
- Beat windows 1.5–2.7 s (short tails merged); every concept prop word-anchored (prop pops on its spoken word, verified via `B.anchor` set from `conceptHit`).
- Adjacent-beat variation: 0 repeated visuals across the 15-beat sequence (a repeat appears only when the user explicitly pins a scene, which is by design).
- Composition alternates side every beat (pixel-centroid evidence) and cycles wide/medium/close framing.
- New diagrams render error-free when pinned: `core`, `mech`, `list`; `contrast` selected automatically for the लेकिन sentence.
- Visual direction measurably changes rendering: identical baseline twice (deterministic centroid), distinct shifts for stickman-forward / motion-graphics-forward; footage-forward hint shown when no clips exist.
- Effects gating verified in code paths: punch zoom / flash / zig-zag lines only on `emph` beats or hook/takeaway entries; stickers ≥3 beats apart.
- Captions: all 15 beats render caption pixels in the caption band; visual ground line (y≈650) stays above the caption block top (≈700); no overlap found.
- Plan panel: role select updates `PLAN` and rebuilds; Pin sets `OVR`; scene JSON contains `role`, `idea`, `uncertain`, `beats[]`, `visualDirection`.
- Projects: snap→openProj round-trip restores edited role and visual direction.
- Zero page errors / unhandled rejections across every interaction.
Not runtime-tested: full MP4 encode (unchanged `drawPrev` path shared by preview, real-time capture and fast export) and real speech recognition.

## Part 3 + Library Expansion: Art Direction & Massive Visual Library (done)
Decisions:
- Art direction (Part 3): Added `ROLE_POSES` table mapping each narrative role (hook/problem/mechanism/example/contrast/list/evidence/takeaway) to a pool of 4 poses. `buildBeats` is monkey-patched to cycle poses from the role pool, filtering out the previous pose so adjacent beats never repeat the same character stance. `stage()` is monkey-patched to swap `SC[id].pose` temporarily to `B.artPose`, then restore it, so the per-scene picker override still works correctly.
- Stickman interactions: Added `P_manDiagram` (character points arm toward diagram nodes mid-animation), `P_carry` (character holds glowing orb that bobs and pulses), `S_pushWall` (full-solo: character pushes cracking red barrier as it cracks), `S_climb` (full-solo: staircase builds step by step, character advances to top).
- Psychology & human behavior: `P_decisionFork` (forking paths, bad/good labels), `P_rewardLoop` (3-node spinning cycle: Act→Reward→Repeat), `P_attentionSplit` (focus block shrinks as 4 distraction bubbles radiate out), `P_habitStack` (4 blocks slide in sequentially with check marks), `P_lossAversion` (tilted scale, −100 side always heavier).
- Money, business & economics: `P_compound` (exponential curve vs linear dashed reference with gap label), `P_budget` (stacked vertical bars: Needs/Wants/Save with labels), `P_debtCycle` (debt circle shrinks, freedom circle grows, connected by arrow).
- Learning, productivity & self-improvement: `P_spacedRep` (forgetting curve with 4 review check points), `P_focusDesk` (clean desk vs cluttered desk side by side), `P_skillArc` (arc fills from Beginner to Expert with % counter).
- Digital, tech & social: `P_algo` (scrolling card feed with eye/tracking symbol), `P_notifs` (5 bells shaking at different intensities).
- Science & relationships: `P_causeEffect` (3-node cause→effect→result chain with animated arrows), `P_venn` (two overlapping circles with shared fill).
- Data viz components: `P_funnel` (4-layer funnel: Aware→Interest→Consider→Convert), `P_matrix` (2×2 Eisenhower quadrant), `P_pyramid` (4-layer pyramid: Vision→Strategy→Tactics→Actions).
- Storytelling devices: `S_reveal` (6 words pop in one by one, solo scene), `P_magnify` (magnifier lens enlarges and reveals a key-insight label).
- Icons: 15 new SVG icon entries added to `LIB` for all new concept keywords.
- Keywords: 21 new concept keyword groups added to `CONCEPTS` for auto-selection.
- No API calls, no paid services, no external downloads. All animations are pure Canvas/JS.
- Existing features unchanged: per-scene picker, media upload/export, caption editor, projects, music mode, all previous visual primitives and stickman system.

Changed: `index.html` (new 5th <script> block, Part 3 + Library Expansion IIFE), `IMPLEMENTATION_LOG.md`, `PROJECT_AUDIT.md`.

Tests (headless Chrome CDP, 15 checks):
- SC now contains 73 visual primitives (up from 46 after Part 1)
- CONCEPTS now has 62 keyword categories (up from 41 after Part 1)
- LIB now has 86 SVG icon entries (up from 71 after Part 1)
- All new scenes render without canvas errors (verified via drawPrev call for each primitive)
- Per-scene picker (`vsel`) shows all 73 options
- All removed AI Director elements remain absent (#ak, #ag, #ai, #cr)
- All core systems preserved (SC, POSES, PAL, drawPrev, stage, sketchScene, drawCap, freeAll, align, exportVideo, AIV)
- All 6 expressive poses present (present, explain, run, clap, search, demonstrate)
- Theme (cine/neon/gold/fire) and style (sketch/trend/classic) switching renders
- Manual per-scene visual overrides work
- Caption and safe zone system intact
- Zero runtime page errors

Known limits:
- `S_pushWall` and `S_climb` are solo scenes; the stickman is drawn inside them directly (not via the stage() composition system) so artPose patching doesn't apply. This is by design — solo scenes own their full composition.
- `P_algo` uses Unicode emoji (👁) via canvas fillText; rendering fidelity depends on the emoji font available in the browser.
- `P_lossAversion` tilts the scale to always show losses heavier (fixed 18° tilt) — this is an illustrative visualization, not a data chart.
- Art direction pose cycling is per-build: if the script is rebuilt (new audio or new text), poses are reassigned. Pinned visuals (OVR[i]) override the scene ID but artPose still applies to the chosen scene's character.
