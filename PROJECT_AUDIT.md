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
