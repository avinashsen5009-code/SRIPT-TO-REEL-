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

Next: Phase 2 (audio-directed mixed visual system).
