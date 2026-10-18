#!/usr/bin/env python3
"""Run ONCE with internet:  python3 fetch-model.py [model] 
Bundles the Whisper speech model + the transformers.js runtime INTO the site, so visitors download nothing extra
when they press Auto-transcribe. Default model: small (the most accurate one that runs reliably in a browser).
Creates ./vendor (runtime + wasm) and ./models/onnx-community/whisper-<model>_timestamped. Commit both folders.
Each file must stay under 100 MB for GitHub Pages; the script warns if one does not."""
import json, sys, pathlib, urllib.request
model = sys.argv[1] if len(sys.argv) > 1 else 'small'
VER = '3.7.6'; MID = f'onnx-community/whisper-{model}_timestamped'
root = pathlib.Path(__file__).parent
def get(u): return urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'}), timeout=120)
def save(url, dest):
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 0: print('have ', dest.name); return
    with get(url) as r, open(dest, 'wb') as f:
        while (b := r.read(1 << 20)): f.write(b)
    mb = dest.stat().st_size / 1e6; print(f'saved {dest.name} ({mb:.1f} MB)' + ('  <-- OVER 100 MB, GitHub Pages will reject this' if mb > 100 else ''))
# 1) runtime: transformers.js + onnxruntime wasm
flat = json.load(get(f'https://data.jsdelivr.com/v1/package/npm/@huggingface/transformers@{VER}/flat'))['files']
for f in flat:
    n = f['name']
    if n.startswith('/dist/') and (n == '/dist/transformers.min.js' or n.endswith('.wasm') or (n.endswith('.mjs') and 'ort-wasm' in n)):
        save(f'https://cdn.jsdelivr.net/npm/@huggingface/transformers@{VER}{n}', root / 'vendor' / n.split('/')[-1])
# 2) model: config/tokenizer files + the int8 (quantized) onnx weights the browser uses by default
info = json.load(get(f'https://huggingface.co/api/models/{MID}'))
for sib in info['siblings']:
    n = sib['rfilename']
    if n.startswith('onnx/') and not n.endswith('_quantized.onnx'): continue
    if n.endswith(('.md', '.gitattributes')): continue
    save(f'https://huggingface.co/{MID}/resolve/main/{n}', root / 'models' / MID / n)
print('Done. Commit the vendor/ and models/ folders with the site.')
