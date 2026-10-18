#!/usr/bin/env python3
"""Run ONCE with internet: python3 fetch-fonts.py
Downloads Hind (captions/UI) and Kalam (handwriting) into ./fonts and writes fonts/fonts.css.
Commit the fonts/ folder with the site; after that the app never needs Google Fonts."""
import re, urllib.request, pathlib
CSS = 'https://fonts.googleapis.com/css2?family=Hind:wght@400;500;600;700&family=Kalam:wght@400;700&display=swap'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
get = lambda u: urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': UA})).read()
out = pathlib.Path(__file__).with_name('fonts'); out.mkdir(exist_ok=True)
css = get(CSS).decode()
def grab(m):
    url = m.group(1); name = '-'.join(url.split('/')[-3:]).replace('..', '.')
    (out / name).write_bytes(get(url)); print('saved', name); return 'url(' + name + ')'
(out / 'fonts.css').write_text(re.sub(r'url\((https://[^)]+)\)', grab, css))
print('Done. Now commit the fonts/ folder.')
