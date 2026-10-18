const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('fs'),assert=require('assert');
let html=fs.readFileSync('index.html','utf8');
for(const name of ['reel-renderer-minimalism','reel-director','visual-grammar','story-director','story-style']){
 html=html.replace(`<script src="${name}.js"></script>`,()=>'<script>'+fs.readFileSync(name+'.js','utf8')+'</script>');
}
const vc=new VirtualConsole(),errors=[];vc.on('jsdomError',e=>errors.push(e));
class Ctx {
 constructor(){this.canvas={width:720,height:1280}}
 createImageData(w,h){return {data:new Uint8ClampedArray(w*h*4)}}
 createPattern(){return {}}
 createLinearGradient(){return {addColorStop(){}}}
 createRadialGradient(){return {addColorStop(){}}}
 measureText(t){return {width:String(t).length*17}}
 getImageData(){return {data:new Uint8ClampedArray(720*1280*4)}}
}
for(const name of ['setTransform','clearRect','fillRect','drawImage','beginPath','moveTo','lineTo','closePath','arcTo','arc','ellipse','bezierCurveTo','quadraticCurveTo','fill','stroke','save','restore','translate','scale','rotate','rect','clip','strokeText','fillText','strokeRect','putImageData'])Ctx.prototype[name]=function(){};
for(const k of ['lineWidth','shadowBlur'])Object.defineProperty(Ctx.prototype,k,{configurable:true,get(){return this['_'+k]||0},set(v){this['_'+k]=v}});
const dom=new JSDOM(html,{url:'https://reel.test/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.CanvasRenderingContext2D=Ctx;w.HTMLCanvasElement.prototype.getContext=function(){if(!this._ctx)this._ctx=new Ctx();return this._ctx};w.HTMLCanvasElement.prototype.captureStream=()=>({getVideoTracks:()=>[]});w.navigator.storage={persist:async()=>true};w.HTMLCanvasElement.prototype.getBoundingClientRect=()=>({width:720,height:1280,left:0,top:0});w.requestAnimationFrame=()=>0;w.matchMedia=()=>({matches:false})}});
const w=dom.window,script=['What if a small habit changes your day?','The problem is waiting for motivation.','When you pick up your phone, the old routine begins.','First open the book, then read one page.','Instead of waiting, make the first step easy.','Remember: start small.'].join('\n');
(async()=>{await new Promise(r=>setTimeout(r,20));try{
 assert.equal(errors.length,0,errors.map(x=>x.stack).join('\n'));
 w.document.querySelector('#sc').value=script;
 w.eval('buf={duration:24,sampleRate:16000,numberOfChannels:1,getChannelData:()=>new Float32Array(384000)};sents=split(document.querySelector("#sc").value);cuts=[4,8,12,16,20];refresh()');
 assert.equal(errors.length,0,errors.map(x=>x.stack).join('\n'));
 assert.equal(w.document.querySelectorAll('#ls li').length,6);
 const plan=JSON.parse(w.document.querySelector('#js').value).scenes;
 assert.deepEqual(plan.map(x=>x.plan.purpose),['hook','problem','example','list','contrast','takeaway']);
 assert(plan.every(x=>x.plan.keyIdea && x.plan.duration===4));
 assert.equal(plan[0].plan.subject,'book');
 assert(w.document.querySelector('#ls li:first-child .director-review'),'audio-first scene review missing');
 const choice=[...w.document.querySelectorAll('#ls li:first-child .director-review button')].find(b=>b.textContent==='Words only');
 choice.click();assert.equal(w.eval('sceneCfg(0).treatment'),'typography');w.drawPrev(2);
 w.eval('sceneCfg(0).treatment="auto"');w.renderList();
 assert.equal(w.ReelDirector.analyse(['Quasar neutrino boson.'],[]).focus,null);

 const selects=w.document.querySelectorAll('#ls li:first-child select');assert(selects.length>=2);
 selects[0].value='flow';selects[0].dispatchEvent(new w.Event('change'));
 const shot=w.eval('snap()');assert.equal(shot.sceneSettings[0].treatment,'flow');
 const before=w.document.querySelector('#js').value;
 w.eval('drawPrev(2);drawPrev(14);drawPrev(22)');
 assert.equal(errors.length,0,errors.map(x=>x.stack).join('\n'));
 [...w.document.querySelectorAll('#ls li:first-child button')].find(x=>x.textContent==='↓').click();assert.equal(w.eval('sceneCfg(1).treatment'),'flow');
 assert(w.document.querySelector('#js').value!==before);
 w.document.querySelector('#direction').value='graphics';w.document.querySelector('#direction').dispatchEvent(new w.Event('change'));
 assert.equal(w.eval('snap().direction'),'graphics');
 // Selected reel style must reach the shared preview renderer, not just CSS.
 const sty=w.document.querySelector('#sty');sty.value='structural';sty.dispatchEvent(new w.Event('change'));
 assert.equal(w.eval('UI.sty'),'structural');
 assert.equal(JSON.parse(w.document.querySelector('#js').value).reelStyle,'structural');
 let charcoalPaints=0;Ctx.prototype.fillRect=function(){if(this.fillStyle==='#111111')charcoalPaints++};
 w.eval('drawPrev(2)');
 assert(charcoalPaints>0,'structural canvas rendering was not selected');
 const assets=w.eval('({library:LIB,concepts:CONCEPTS,scenes:SC})');
 assert.equal(w.StructuralReel.resolve('phone','',assets).tier,'library');
 assert.equal(w.StructuralReel.resolve('connect','',assets).tier,'procedural');
 assert.equal(w.StructuralReel.resolve('hope','',assets).tier,'type');
 assert.equal(w.StructuralReel.resolve('the','',assets).tier,'type');
 assert.equal(w.StructuralReel.resolve('35','',assets).shape,'number');
 let marked=0;Ctx.prototype.fillText=function(v){if(String(v).trim())marked++};
 const times=w.eval('tl.flatMap(ch=>ch.flatMap(c=>c.words.map(x=>x.s+.01)))');
 for(const at of times){const before=marked;w.drawPrev(at);assert(marked>before,'empty word marker at '+at)}
 assert(times.length>25);
 // The supplied Story look is an additional style; never replaces editor state.
 sty.value='story';sty.dispatchEvent(new w.Event('change'));
 assert.equal(w.eval('UI.sty'),'story');assert.equal(w.document.querySelectorAll('#sty option').length,5);
 assert.equal(w.StoryStyle.plan(0).role,'hook');
 w.drawPrev(1);w.drawPrev(5);w.drawPrev(22);
 assert.equal(errors.length,0,errors.map(x=>x.stack).join('\n'));
 assert(w.eval('CAPHIT.length')>0,'story captions should use the existing editable caption renderer');
 sty.value='structural';sty.dispatchEvent(new w.Event('change'));
 // Advanced caption sheet retains per-word manual alignment.
 const captionTool=w.document.querySelector('[data-sheet="cap"]');captionTool.click();
 assert.equal(w.document.querySelector('#cap').open,true);
 w.document.querySelector('#capAdvanced').click();assert(w.document.querySelector('#cap').classList.contains('advanced-open'));
 await new Promise(r=>setTimeout(r,35));
 const nudge=w.document.querySelector('#cues button.word-nudge[data-si="1"][data-k="1"][data-d="0.05"]');
 assert(nudge,'word alignment button missing');const beforeNudge=w.eval('wordsT(1)[1].s');nudge.click();
 assert(w.eval('wordsT(1)[1].s')>beforeNudge,'per-word onset did not move');
 // Correction is additive, scene-specific, and shared by preview plus caption files.
 w.eval('ALIGN.global=200;ALIGN.scene[1]=100');
 assert(Math.abs(w.eval('correctedTime(1,5)')-4.7)<.001);
 const rawCue=w.eval('tl[1][0].s'),shiftedCue=w.cueList().find(x=>x.s>=4);
 assert(shiftedCue.s>=rawCue+.25,'caption export did not include correction');
 const opened=w.document.querySelector('[data-sheet="syncSheet"]');opened.click();assert.equal(w.document.querySelector('#syncSheet').hidden,false);
 opened.click();assert.equal(w.document.querySelector('#syncSheet').hidden,true);
 // Every reel style must still render on the same canvas path.
 for(const mode of ['sketch','trend','classic','structural','story']){sty.value=mode;sty.dispatchEvent(new w.Event('change'));w.drawPrev(5)}
 sty.value='structural';sty.dispatchEvent(new w.Event('change'));
 let heroes=[];const originalRender=w.StructuralReel.renderScene;
 w.StructuralReel.renderScene=function(...a){const r=originalRender(...a);heroes.push(r.hero);return r};
 w.drawPrev(4.3);w.drawPrev(5.7);assert.equal(heroes.at(-1),heroes.at(-2),'main scene visual changed with each spoken word');
 w.StructuralReel.renderScene=originalRender;
 // Simulate a user-owned image and project reopen without decoding audio in jsdom.
 w.URL.createObjectURL=()=> 'blob:mock';w.URL.revokeObjectURL=()=>{};
 w.eval('setMedia(1,new File(["pixels"],"owned.png",{type:"image/png"}))');
 // Real output dimensions and caption hit targets must switch together for every style.
 const ratio=w.document.querySelector('#ratio');ratio.value='wide';ratio.dispatchEvent(new w.Event('change'));
 assert.equal(w.document.querySelector('#pv').width,1280);assert.equal(w.document.querySelector('#pv').height,720);
 assert.match(w.document.querySelector('#res').options[1].textContent,/1920×1080/);assert.equal(JSON.parse(w.document.querySelector('#js').value).aspectRatio,'16:9');
 w.eval('setK(1.5)');assert.deepEqual([w.document.querySelector('#pv').width,w.document.querySelector('#pv').height],[1920,1080]);w.eval('setK(1)');
 for(const style of ['sketch','trend','classic','structural','story']){sty.value=style;sty.dispatchEvent(new w.Event('change'));w.drawPrev(5);assert.equal(errors.length,0,errors.map(x=>x.stack).join('\n'))}
 assert(w.eval('CAPHIT.every(h=>h.x0>750&&h.x1<1260&&h.y0>200&&h.y1<520)'),'wide caption hit coordinates were not transformed');
 const saved=w.eval('snap()');assert.equal(saved.mediaFiles[1].name,'owned.png');assert.equal(saved.ratio,'wide');

 Object.defineProperty(w.eval('media[1].el'),'naturalWidth',{value:500});
 Object.defineProperty(w.eval('media[1].el'),'naturalHeight',{value:500});
 let mediaPaints=0;const owned=w.eval('media[1].el');Ctx.prototype.drawImage=function(el){if(el===owned)mediaPaints++};
 w.document.querySelector('#direction').value='footage';w.eval('sceneCfg(1).treatment="media"');w.drawPrev(5);assert(mediaPaints>0,'user media was not rendered');
 w.eval('sceneCfg(1).treatment="flow"');w.document.querySelector('#direction').value='graphics';
 w.eval('loadFile=async()=>{}');saved.voice={test:true};
 w.eval('REEL_SETTINGS.scenes=[];window.OVR.length=0');
 await w.openProj(saved);
 assert.equal(w.eval('sceneCfg(1).treatment'),'flow');
 assert.equal(w.eval('media[1].file.name'),'owned.png');
 assert.equal(w.document.querySelector('#direction').value,'graphics');
 assert.equal(w.eval('UI.sty'),'story');
 assert.equal(w.eval('snap().sty'),'story');assert.equal(w.eval('snap().ratio'),'wide');assert.equal(w.document.querySelector('#pv').width,1280);
 assert.equal(w.eval('ALIGN.global'),200);assert.equal(w.eval('ALIGN.scene[1]'),100);
 assert.equal(errors.length,0,errors.map(x=>x.stack).join('\n'));
 ratio.value='vertical';ratio.dispatchEvent(new w.Event('change'));assert.equal(w.document.querySelector('#pv').height,1280);
 // Grounded grammar only illustrates explicit, recognizable spoken relationships.
 const lookup=w.eval('libHit'),ground=w.VisualGrammar.compile('Use a phone but read a book.',lookup);
 assert.equal(ground.supported,true);assert.equal(ground.kind,'contrast');
 assert.equal(w.VisualGrammar.compile('Nebulous ideas exist.',lookup).supported,false);
 assert.equal(w.VisualGrammar.compile('The phone changes everything.',lookup).supported,false);
 w.eval('sents[0]="Use a phone but read a book.";refresh()');
 assert.equal(JSON.parse(w.document.querySelector('#js').value).scenes[0].plan.grammar.supported,true);
 assert([...w.document.querySelectorAll('#ls li:first-child .director-review button')].some(x=>x.textContent==='Explain relationship'));
 for(const mode of ['sketch','trend','classic','structural','story']){
  sty.value=mode;sty.dispatchEvent(new w.Event('change'));w.drawPrev(.8);
 }
 assert.equal(errors.length,0,errors.map(x=>x.stack).join('\n'));
 const review=w.document.querySelector('#visualReview');review.click();assert.equal(review.getAttribute('aria-pressed'),'true');
 w.drawPrev(.8);assert.equal(w.eval('CAPHIT.length'),0,'silent comprehension review must hide only preview captions');
 w.eval('fxb=true');w.drawPrev(.8);assert(w.eval('CAPHIT.length')>0,'export must still render captions in review mode');w.eval('fxb=false');
 review.click();w.drawPrev(.8);assert(w.eval('CAPHIT.length')>0);
 // Audio-only entry asks consent once per model; script mode never needs the model.
 w.eval('localStorage.clear();offerTranscription()');
 assert.equal(w.document.querySelector('#md').value,'base');
 assert.equal(w.document.querySelector('#speechSetup').hidden,false);
 w.eval('markSpeechPrepared()');w.document.querySelector('#speechSetup').hidden=true;
 w.eval('transcribe=()=>{window.__gateCalls=(window.__gateCalls||0)+1};offerTranscription()');
 assert.equal(w.__gateCalls,1);assert.equal(w.document.querySelector('#speechSetup').hidden,true);
 w.document.querySelector('#md').value='small';w.eval('offerTranscription()');
 assert.equal(w.document.querySelector('#speechSetup').hidden,false);

 console.log('PASS: 6 narrative purposes, scene JSON, controls, canvas paths, move persistence, direction preference, all reel styles, sync/export and word calibration, stable scene hero, audio-first subject and editable visual review, mobile Base consent, 16:9 five-style preview, grounded grammar, visual-only review/export captions, owned-media paint, snapshot/reopen');
}catch(e){console.error(e.stack);process.exitCode=1}finally{dom.window.close()}})()
