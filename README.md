# Reel Studio

Static, browser-based vertical reel editor. Host `index.html`, `manifest.json`, and `sw.js` together on any static HTTPS host. Upload narration or a video/audio file and paste a sentence-per-line script, then **Build reel from script**. Audio is required to time a reel. Script-based editing and built-in graphics require no API key or stock-photo service.

## Visual editing
Choose Balanced, Stickman-forward, Motion-graphics-forward, or Footage-forward. Each scene has an editable automatic treatment, a pinned treatment menu, the existing built-in visual picker, Replace media, layer toggles, reset, and move controls. User media is stored with browser projects (storage quota applies). Imported content remains the user's responsibility. The local scene planner emits an editable description in Scene JSON; uncertain interpretation is flagged rather than represented as a fact. Scenes use procedural canvas figures, arrows, cards, progressive flows, comparisons, steps, captions, and media annotations. Caption controls, music, voice recording, offline project storage, and export are retained.

For consistent fast export, Chrome/Edge with WebCodecs and the existing mp4-muxer fallback import are recommended. Fast MP4 muxing and optional auto-transcription load free third-party code/models if not bundled; the browser falls back to real-time export where supported. For a fully offline installation, bundle the optional font, speech model, transformer library and muxer dependencies locally. No paid visual API is used. The service worker caches core files. Avoid importing unlicensed third-party assets.

## Known constraints
Scene understanding is rule-based (English/Hindi cues), not semantic AI. Pinned treatment and labels may need human review for ambiguous narration. Timing is estimated without aligned transcription. Video-file seeking and fast export are browser-dependent; fast export falls back to MediaRecorder for video clips. Browser storage may reject large projects.

## Structural minimalism style

The editor uses a separate `structural-minimalism.css` stylesheet: charcoal 40px grid, restrained grain, geometric 1px edges, masked heading reveal, and traced preview boundary. Select **Reel style → Structural minimalism** to render the *entire reel* in the matching monochrome grid style (including captions, scene diagrams, pinned library art, user media treatment, and music-mode visuals). This selection is saved in projects and used by the same canvas path for preview and video export. The palette deliberately overrides the colour theme selector while Structural minimalism is selected; other reel styles remain unchanged. Existing audio alignment and export controls are preserved. Do not remove the stylesheet when hosting.

## Word-level Structural renderer

`reel-renderer-minimalism.js` is loaded before the existing editor script. Only **Reel style → Structural minimalism** uses it. For each existing timed word marker it attempts an exact existing library concept/SVG match, otherwise a traced procedural shape, otherwise large kinetic type. When a library SVG is still loading or fails, the visible procedural tracer is shown instead. User-owned media is drawn in a bounded monochrome frame when that scene's media layer/treatment and visual direction select it. Its caption renderer reveals up to three words with each word triggered by the stored word-start timestamp; the supplied audio amplitude slightly affects vector/type motion. Other styles, upload, transcription, timing estimation, scene editing, and export implementations are unchanged.

These timings are only as accurate as the editor's supplied word timing. Without aligned transcription they are estimates; the engine uses an amplitude envelope, **not frequency-spectrum peak detection**. Review timing and captions before publishing. The fallback guarantees a visible treatment for a marker, not semantic certainty about an ambiguous word.

The built-in CSS and JS are served from the project folder; do not omit `reel-renderer-minimalism.js` or `structural-minimalism.css` from a deployment.
