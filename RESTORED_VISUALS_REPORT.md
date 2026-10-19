# Uploaded visual-version integration — October 19, 2026

**Status:** Integrated into the existing Reel Studio source. This is not a public deployment. The website files are delivered as a flat-file ZIP named `hello.zip`.

## What the uploaded files showed

I rendered the uploaded website alongside the then-current site, with the **same four-scene script and test audio**, across Story, Structural, Classic, Trending and Sketch. The older Story scene kept a character, room, chart and stepped paper cards; the newer automatic paths frequently replaced these with generic diagrams or text boxes. The newer Classic/Trending default often substituted a one-object editorial template for the older pictorial scene progression. Structural's automatic source-component selection could replace its old, stronger numerical or word-focused composition. The old relationship cards were visually clearer, but their second object could appear at the word “then,” before the object itself was spoken.

Uploaded-file audit:
- `story-style.js` and `story-director.js`: older illustrated layouts and selection logic, now restored for the regular Story route. A separate, namespaced copy of the older planner (`legacy-story-director.js`) avoids overriding the newer planner used by Explainer and Auto mix.
- `visual-grammar.js`: restored the older subject cards and explicit source-grounded relationship language; adjusted only the reveal timing so the second subject appears **after its own word begins**, not at the connecting phrase, and no ghost second card is shown in advance.
- `index.html`: restored the older Classic/Trending directed-scene drawing path without reverting the updated editor, captions, navigation, transcription, controls, save/open, media handling, 9:16/16:9 or MP4 export. Sketch keeps the more recent moving stickman composition to prevent the old fixed-box/fixed-position regression.
- `reel-renderer-minimalism.js`: restored the older Structural scene-priority/rendering path while retaining its newer captions, landscape companion, editable source components and spoken doctor/child pair. The newer source component path remains available through the explicit Graphics visual-direction choice.
- `editor-sheets.css`: the current file already contained the uploaded stylesheet verbatim as its first section; later compact mobile controls were retained.
- `fonts.css`, `reel-director.js`, `structural-minimalism.css`, `manifest.json`: identical to the currently active copies. No needless replacement.
- `sw.js`: retained later offline-file coverage and incremented cache key to `reel-v41`, adding the two newly loaded visual modules.
- The additional `story-style (1).js` is for a different drop-in integration and references `PLAN`/`directDraw`, which this current app does not expose. It was inspected but not loaded over the working Story implementation. The uploaded README recommends an optional paid AI Director; that recommendation was **not** restored, as the current site deliberately uses free local direction.

## Integration behavior

- Story defaults to the uploaded paper/room/character/chart visual family; a short source-grounded note replaces repeated full-script note text. An illustrated companion is chosen only from recognized words within that same scene and timed to that word.
- Classic and Trending default to the uploaded directed drawings and explicit relationship cards. Their visual picker, pins and user media retain existing priority. Their previous template replacement is no longer the default.
- Structural defaults to the uploaded hierarchy and narrative framing; a pair of actually spoken library subjects can also be shown after its assets have loaded. No floating callout covers that pair.
- Sketch's automatic placement is scene-dependent with a moving stickman and sourced props. The older grammar-card look remains accessible through the existing manual Explain relationship treatment; manual panels, upload paths and pins are retained.
- The newer rich Story components are **not deleted**: selecting **Visual direction → Motion-graphics-forward** on Story uses the newer graphics-oriented path. Explainer and Auto mix, their controls, source-grounded components and other previous improvements remain present.
- The existing motion system still provides a source-timed ~2.5 s visual beat and a visual-zone-only transition near 15 s. It does not accelerate speech or force an arbitrary hard cut for each beat. The caption timeline still preserves every script word.

## Tests actually run

- Existing smoke suite: **passed**, including all styles, editable scenes, saved-project reopening, ratio preview, caption-word retention, transcript controls and manual treatment paths. Added an assertion that the second subject in “phone … then … book” waits for *book* instead of *then*.
- Browser comparison: **20 frames from the uploaded version and 20 from the integrated version** for four scenes × five styles; **zero page errors**. Reviewed rendered contact sheets. A separate seven-style audit rendered **28 frames** with zero page errors. Structural's delayed SVG loading was allowed to complete in the comparative render; its doctor and child both appeared.
- Browser timing check: source *book* began at 1.893 s in the test fixture; the relationship plan selected word index 7 (book) instead of index 3 (then). A before/after preview was captured; asynchronously decoded SVGs may be absent from the very first preview frame.
- Mobile browser check at **320 px**: scene rail selected scene 3, no document horizontal overflow, **40 caption words matched 40 supplied words**, no page errors.
- Fresh browser exports after integration: Story 9:16 MP4 and Structural 16:9 MP4, both downloaded with `ftyp` MP4 headers and no page errors. Other ratio/style combinations were exercised by smoke tests and earlier updates, but were not all individually exported again in this integration pass.

## Limits and installation

The browser test supplied a transcript and a synthesized tone, **not a speech recording**: this did not test automatic speech-recognition quality. Deterministic source matching cannot always determine the intended picture for ambiguous words; users can correct the scene treatment or supply their own media. Actual SVG icons load asynchronously. I cannot guarantee every arbitrary audio clip will receive a perfect image or exact semantic scene cuts.

Extract `hello.zip` and upload the **extracted files directly to the GitHub Pages repository root**, replacing existing matching files beside `index.html`. Do not upload a subfolder or only the ZIP. The site was not deployed from this workspace. A first-use browser speech-model download and any optional online font still require network access.
