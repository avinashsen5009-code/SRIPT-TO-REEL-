# Reel Studio (SCRIPT-TO-REEL)

Turn a voiceover, podcast or song into a vertical reel. Runs fully in the browser.

## Host on GitHub Pages
1. Upload all files in this folder to the repo root (Add file > Upload files > Commit).
2. Settings > Pages > Deploy from a branch > `main` / `(root)` > Save.
3. Open https://avinashsen5009-code.github.io/SRIPT-TO-REEL-/ after about a minute.

Install it as an app from the browser menu (Add to Home screen). Use Chrome or Edge.

## AI Director
Open the page, paste your own Anthropic API key under "AI Director", then press "Design visuals with AI". The key stays in your browser only. Never commit it.

The site now works free and unlimited: scenes are drawn from a built-in vector library, matched to your words in Hindi and English. The AI Director is optional.

Reel style: Trending (big word-by-word captions, punch zoom and flash cuts) or Classic.

Music mode: upload a song with no script and press "Music mode (beat cuts)". Export now renders MP4 faster than real time in Chrome/Edge, and falls back to real-time recording if needed.

## New in this version
- **Hand-drawn sketch style** (default Reel style): chalk stickman with pencil-wobble lines, chalk grain, handwritten captions (Kalam, Hindi + English), marker highlight on keywords, handwritten labels with arrows that write themselves on, sticker pops, and chalk zig-zag cuts. The other styles and the whole icon library are unchanged.
- **1080x1920 export** toggle next to Export video (720x1280 stays the default).
- **Background music** with auto-ducking under the voice (also in the exported file).
- **Projects**: Save / Open / Delete inside the browser (IndexedDB). Stores script, settings, scene cuts, voiceover and music. Works offline. Web photos and AI visuals are not stored.
- **Offline fonts**: run `python3 fetch-fonts.py` once (needs internet), then commit the new `fonts/` folder. The service worker caches it.
- More library topics (calendar, ads, star, search, trust, world, podcast) and a higher-contrast camera icon.

## v8 changes
- Smoother preview: one pencil pass while previewing (two on export), cached chalk/vignette, no per-frame DOM lookups, adaptive 30 fps lock on slow devices.
- Library: +5 scenes (gear, shield, cart, camera, mail) with English + Hindi keywords.
- Per-scene "Visual" picker: Auto by default, pin any scene only if you want to.
- Shortcuts: Space, left/right (Shift = 5 s), [ and ] for scenes. Buttons stay disabled until they can work; delete/remove ask first.

## Bundled speech model (no download for visitors)
Run once with internet: `python3 fetch-model.py` then commit `vendor/` and `models/`. Auto-transcribe then loads everything from your own site. If the folders are missing it falls back to downloading from the internet as before.

## v10: captions (Phase 1)
- Captions now sit at 58.5% of the frame height (adjustable 55–62%); visuals are composed above them.
- **Captions & safe zones** panel: on/off, 1/2/3 words per cue, emphasis Off/Subtle/Strong, outline/shadow/backing, size, text and highlight colours, and preview-only 9:16 safe-zone guides (never exported).
- Tap a caption word in the preview, or edit words in the cue list (Hindi, English, Hinglish, numerals). Split/merge cues and edit cue start/end times. Each scene is labelled aligned, estimated or edited.
- SRT and VTT export use the same cues as the preview. Projects save caption settings and edits.
