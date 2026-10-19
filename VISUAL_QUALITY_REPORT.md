# Visual quality update — October 19, 2026

This update is applied to the existing Reel Studio website, without replacing its editor or its export/transcription pipeline. The flat-file website package is `hello.zip` (delivered separately). It has **not** been deployed to a public host by this update.

## What changed

- **Explainer / Auto mix:** Ordinary sentences containing “with” or “without” no longer trigger a false `VS` comparison. Explicit contrasts such as a price rising from ₹250 to ₹400 while a budget stays unchanged still use the comparison layout. The comparison presents the *spoken* amounts and a budget label rather than generic symbol cards or repeating full sentences.
- **Classic:** Automatic scenes with recognized spoken subjects use an editorial two-subject composition with timed reveals, grounded labels and visual hierarchy. It does not override a manual treatment, media, or a pinned visual.
- **Trend:** Automatic recognized subjects use a stronger accent-framed lead object and a staggered secondary tile, distinct from Classic. The secondary caption is placed clear of its tile.
- **Sketch:** Prefers the current scene’s subject over a broad global subject. Sketch figure limbs have subtle, consistent curvature instead of rigid straight-line segments; a pointing pose changes to a holding pose within longer scenes.
- **Structural:** A spoken two-subject scene can show two monochrome framed drawings. It excludes common action verbs from subject selection and suppresses the floating callout that previously covered a subject. It avoids pulling a future unspoken subject forward. Captions and a typographic fallback remain for scenes without usable library drawings.
- **Story and Auto mix:** Existing character scene direction and story treatments remain available; Auto mix inherits the corrected subject/contrast and Sketch behavior where those treatments are selected. The earlier motion-direction work for beats and ~15-second transitions remains in place.
- Source-grounded visual decisions use local word timing and bundled imagery; no paid image-generation API was added. Saved-project structure and manual visual controls remain on their existing paths. The service-worker cache key is `reel-v38`.

## Tests actually performed

- The existing smoke suite passed, including its saved-project, controls, scene routing, 16:9 preview, caption/export path and style coverage assertions.
- Browser visual audit rendered **28 preview frames: four scenes × seven styles** (Auto mix, Story, Structural, Explainer, Classic, Sketch and Trend), with no page exceptions. The test script used a pasted four-scene transcript and a synthesized 16-second tone. A separate Structural browser screenshot taken **after icon loading** confirmed that the doctor and child drawings appear together without the old overlapping callout.
- Mobile browser check at **320 px**: scene 3 selected in the scrollable scene rail, no document-width overflow, and **40 caption words matching 40 source words**, no page exceptions.
- Fresh browser exports after this pass: **Story 9:16 MP4**, 3,373,784 bytes, and **Structural 16:9 MP4**, 4,664,619 bytes; both files had an MP4 `ftyp` header and no page exceptions.

## Limits

- The test audio is **not speech**. Those checks verify rendering, word-count alignment to supplied text, UI interaction and export, **not** microphone transcription accuracy or semantic interpretation of arbitrary recordings.
- Library drawings only appear when a spoken word has a recognized bundled subject and the asset has loaded. Unrecognized or abstract narration takes an editable typographic/diagram fallback; automatically selected subjects are suggestions, not guaranteed semantic understanding. Avoid claiming every scene will have an illustrated character or that engagement is guaranteed.
- MP4 checks above verify container/header and browser download, not a frame-by-frame decoder inspection of every exported style. The prior motion update separately tested its transition samples. Two styles and ratios were exported again in this update, not every permutation.
- The GitHub-hosted production site will not change until you upload the extracted website files to your repository root and publish them. A first-use browser speech-model download may still require a network connection; fonts from Google may fall back to local/system fonts if unavailable.

## Install this flat package

Extract `hello.zip` and upload the **files themselves** to the root of the GitHub Pages repository (same level as `index.html`), replacing matching files. Do not upload the ZIP as a website file, and do not put the extracted files inside a new subfolder. If your browser retains an older service worker, reload after upload (a hard refresh may help). Keep the `.ttf` font files and the license files with the HTML, JS, CSS, SVG, manifest and service worker.
