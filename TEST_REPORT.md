# Tests performed

- `node --check` on the renderer and inline scripts: passed.
- `npm test` (jsdom/stub canvas): passed six narrative types; all four reel styles rendered; library/procedural/typography asset fallback; every timed marker drew; scene hero held between words; media path; scene reordering and project reopen; global + scene sync corrections; SRT cue correction; advanced per-word nudge; icon-sheet toggle.
- Headless Chrome 142 / Playwright: 390px mobile and 1100px desktop layouts rendered with **no horizontal overflow at 390px**. A synthetic timed scene loaded in both viewports.
- Real browser import/export smoke test using a generated **4-second tonal WAV**, not spoken narration: audio decoded, two scenes built, preview playback advanced, and MP4 downloads completed for Sketch (3,515,591 B), Trending (1,797,204 B), Classic (1,632,183 B), and Structural (1,382,841 B). No page JavaScript errors were reported. A separate mobile browser check applied +200 ms global and +100 ms scene correction; the downloaded SRT first cue began at 00:00:00,200.

## Limitations

This test audio contained no speech. It **does not verify transcription accuracy, word-level alignment to a real voice, perceived visual quality of every script, or lip-sync**. When word times are estimated rather than aligned, fully automatic perfect sync cannot be guaranteed. Browser codec support, microphone permissions, large-project storage, and mixed-language speech need testing on target devices. Preview/export share the same drawing function, but exhaustive pixel-by-pixel video comparisons were not performed.

## Latest landscape and style check

- Inline-script `node --check` and `npm test`: passed, including all four styles through 16:9 canvas drawing, 1280×720 / 1920×1080 canvas sizes, Scene JSON aspect ratio, wide caption hit coordinates, project ratio persistence/reopen, and return to 9:16.
- Chrome 142 / Playwright on a 390px viewport: 16:9 preview measured 1280×720 internally, no horizontal overflow; real 2-second tonal WAV imported and MP4 downloaded in all four 1280×720 styles: Sketch 1,699,911 B, Trending 744,468 B, Classic 663,418 B, Structural 671,315 B. The browser run reported no page JavaScript errors.
- Separate Chrome export: Classic 1920×1080 MP4 (1,053,403 B); the app reported 1920×1080 and restored the 1280×720 preview afterward. An 1100px wide browser screenshot was visually inspected for the wide layout and confirmed no in-video top duration strip.
- Bundled Hind and Kalam font files and SIL OFL notices; a fresh browser run no longer emitted the previous missing-font 404.

**Still not verified:** real spoken-word transcription or precise voice/caption alignment (the synthetic test contains no speech), every possible uploaded image/video format, pixel-perfect video playback on all devices, or every subject's semantic accuracy. The direct visual inspection covered one short example, not every style/content permutation. Chrome/Edge fast MP4 uses a free external muxer import unless hosted locally; offline browser fallback and device codec support vary. No durable public live URL was established.

## Audio-first director update tests

- `npm test` passed deterministic subject inference ("book" in a longer example), unknown-topic fallback, the expanded scene review controls, all existing style/ratio and persistence tests. Inline scripts and both director/renderer modules passed `node --check`.
- Fresh Chrome 142 / Playwright with a 2-second tonal WAV: tested the blank-script upload entry point using a **stubbed transcription function** (confirmed it invoked automatically), then injected a synthetic word-timed transcript, confirmed scene creation and subject/review UI, and downloaded a 16:9 Trending MP4 (707,087 B). This does **not** test a real model download or speech recognition quality.
- Separately, a pasted-script build exported eight MP4s: vertical Sketch 1,768,421 B, Trending 910,872 B, Classic 786,280 B, Structural 1,188,008 B; landscape Sketch 1,703,347 B, Trending 745,357 B, Classic 662,506 B, Structural 661,222 B. On a 390px viewport there was no horizontal overflow or page error. A real Chrome screenshot of an unfamiliar subject verified that it selected script-led typography rather than an unrelated object.

**Not established:** the free transcription model's download/accuracy on all networks or devices, reliable meaning extraction for every topic, perceptual quality for every narration, or automatic frame-accurate word sync. Users should review the generated transcript and visual choices.

## Mobile speech consent update

- `node --check` on inline scripts and `npm test` passed, including Base default, per-model first-use confirmation, prepared-model reuse, and Small requiring separate confirmation.
- Chrome 142 / Playwright at 390px: uploaded a synthetic WAV with an empty script and confirmed **no transcription starts before approval** using a stubbed transcription function. Dismiss/retry worked; approval called the stub; a remembered Base choice skipped the prompt; selecting Small required a separate prompt. Pasting a script bypassed the model prompt. No horizontal overflow or page errors.
- A separate script-backed Chrome run exported a 16:9 Structural MP4 (553,080 B) after the update.

**Not tested here:** actually downloading and running the Base or Small speech models, offline cache reuse on physical phones, or transcription of real speech. Model downloads are not bundled in the ZIP. Cancellation stops the app's transcription result path but may not interrupt an in-flight third-party model transfer. Browser storage eviction can trigger another download even after consent.

## Story illustrated-cards integration

- Static syntax checks (`node --check`) on both new adapted modules and every inline script passed. `npm test` (jsdom) passed existing features plus the fifth style, Story scene plan, captions, 16:9 hit coordinates, user-owned media, and Story saved-project reopen.
- Chrome 142 / Playwright with a synthetic **4-second tone** and scripted scenes: Story portrait MP4 **1,228,786 B** (720×1280), Story landscape MP4 **984,983 B** (1280×720), and separate Story 1920×1080 MP4 **1,655,711 B**. Both preview layouts rendered; at 390px viewport, no horizontal overflow. Word caption targets were nonempty. No page JavaScript errors were reported.
- Chrome checked Story scene planners/draws for list, flow, contrast, real-number chart, year timeline, spoken-number counter and title card. A browser-owned PNG loaded as media in Story, a pinned library visual was selected, and the local beat-cut music path rendered with eight beats. A later fresh browser run exported another 1280×720 Story MP4 (1,012,054 B) without HTTP or page errors. The bundled Lora font was explicitly loaded and confirmed by `document.fonts.check` after style selection. A visual screenshot was inspected in portrait and landscape.
- The integration repaired the existing missing `svgImg` helper for the built-in SVG library. No real speech recognition or word alignment was validated by the tonal test. This does not prove accurate semantic storyboarding for every subject, exhaustive uploaded-video compatibility, or every device's codec support.

## Grounded visual explanation and silent review (current build)

- Syntax checks passed for `visual-grammar.js`, `story-style.js`, `reel-renderer-minimalism.js`, `sw.js` and inline scripts. `npm test` passed: explicit relationship compilation, unsupported fallback, all five canvas paths, exported caption isolation from preview-only review, existing media/project/landscape and word-calibration regressions.
- Chrome/Playwright on a 390px viewport imported a **synthetic tone** with a supplied sentence, "Use a phone but read a book." The scene grammar recognized the spoken contrast and two concrete library pictograms; visual inspection of Story portrait and landscape screenshots showed phone versus book with labels and no invented facts. All five styles drew without page errors or horizontal overflow. During preview playback the review toggle left `CAPHIT.length` at zero.
- With visual-only review **still on**, Chrome downloaded ten nonempty MP4s: portrait Sketch 1,418,829 B, Trending 620,217 B, Classic 537,905 B, Structural 588,277 B, Story 273,849 B; 16:9 Sketch 691,864 B, Trending 481,196 B, Classic 434,410 B, Structural 376,425 B, Story 202,721 B. Instrumented caption renderers were invoked **488 normal / 122 Structural times during export**, confirming that preview-only hiding did not remove exported captions. No browser page errors were reported. This also checks a path to output audio but does **not** verify audible sound by listening or decode each exported file.
- This test supplied the transcript. It does **not** verify speech recognition, causal understanding for arbitrary narration, a physically silent speaker/video under every browser audio policy, all possible uploaded-video codecs, accessibility of unlabeled pictograms, or physical-phone behavior. Unsupported relationships intentionally keep existing editable treatment; only explicit, recognized two-sided statements receive new diagrams. No public durable hosted test link has been established.
