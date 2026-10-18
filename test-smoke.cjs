const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
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
 // Simulate a user-owned image and project reopen without decoding audio in jsdom.
 w.URL.createObjectURL=()=> 'blob:mock';w.URL.revokeObjectURL=()=>{};
 w.eval('setMedia(1,new File(["pixels"],"owned.png",{type:"image/png"}))');
 const saved=w.eval('snap()');assert.equal(saved.mediaFiles[1].name,'owned.png');
 w.eval('loadFile=async()=>{}');saved.voice={test:true};
 w.eval('REEL_SETTINGS.scenes=[];window.OVR.length=0');
 await w.openProj(saved);
 assert.equal(w.eval('sceneCfg(1).treatment'),'flow');
 assert.equal(w.eval('media[1].file.name'),'owned.png');
 assert.equal(w.document.querySelector('#direction').value,'graphics');
 assert.equal(errors.length,0,errors.map(x=>x.stack).join('\n'));
 console.log('PASS: 6 narrative purposes, scene JSON, controls, canvas paths, move persistence, direction preference, media snapshot/reopen');
}catch(e){console.error(e.stack);process.exitCode=1}finally{dom.window.close()}})()
