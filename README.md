# Reel Studio

Static, browser-based vertical reel editor. Host `index.html`, `manifest.json`, and `sw.js` together on any static HTTPS host. Upload narration or a video/audio file and paste a sentence-per-line script, then **Build reel from script**. Audio is required to time a reel. Script-based editing and built-in graphics require no API key or stock-photo service.

## Visual editing
Choose Balanced, Stickman-forward, Motion-graphics-forward, or Footage-forward. Each scene has an editable automatic treatment, a pinned treatment menu, the existing built-in visual picker, Replace media, layer toggles, reset, and move controls. User media is stored with browser projects (storage quota applies). Imported content remains the user's responsibility. The local scene planner emits an editable description in Scene JSON; uncertain interpretation is flagged rather than represented as a fact. Scenes use procedural canvas figures, arrows, cards, progressive flows, comparisons, steps, captions, and media annotations. Caption controls, music, voice recording, offline project storage, and export are retained.

For consistent fast export, Chrome/Edge with WebCodecs and the existing mp4-muxer fallback import are recommended. Fast MP4 muxing and optional auto-transcription load free third-party code/models if not bundled; the browser falls back to real-time export where supported. For a fully offline installation, bundle the optional font, speech model, transformer library and muxer dependencies locally. No paid visual API is used. The service worker caches core files. Avoid importing unlicensed third-party assets.

## Known constraints
Scene understanding is rule-based (English/Hindi cues), not semantic AI. Pinned treatment and labels may need human review for ambiguous narration. Timing is estimated without aligned transcription. Video-file seeking and fast export are browser-dependent; fast export falls back to MediaRecorder for video clips. Browser storage may reject large projects.
