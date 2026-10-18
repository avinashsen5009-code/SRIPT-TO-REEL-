/* Structural minimalism renderer. Visual-only adapter: no audio, timeline or encoder changes. */
(function(root){
'use strict';
const WHITE='#FFFFFF',PAPER='#F7F4FF',GRID='rgba(247,244,255,.05)',MATTE='#111111';
const FONT='"Iowan Old Style","Baskerville",Georgia,"Noto Sans Devanagari","Nirmala UI",Mangal,serif';
const iconCache=new Map();let noise=null,silhouette=null;
const clamp=x=>Math.max(0,Math.min(1,x));
/* Exact CSS cubic-bezier(.25,1,.5,1), solved at the supplied timestamp. */
function ease(x){x=clamp(x);let l=0,r=1;for(let j=0;j<10;j++){const q=(l+r)/2,p=3*.25*q*(1-q)*(1-q)+3*.5*q*q*(1-q)+q*q*q;if(p<x)l=q;else r=q}const q=(l+r)/2;return 3*q*(1-q)*(1-q)+3*q*q*(1-q)+q*q*q}
function clean(w){return String(w||'').normalize('NFC').toLowerCase().replace(/^[^\p{L}\p{N}₹]+|[^\p{L}\p{N}₹]+$/gu,'')}
const common=new Set('a an the and or but to of for with is are was were i you we it this that in on at by from as not do did can will be have has he she they your my our aap aur hai hain ka ki ke se ko mein यह वह और है हैं का की के से को में आप मैं हम तो पर'.split(' '));
const abstract=/^(idea|change|believe|belief|meaning|mindset|future|freedom|trust|important|better|success|hope|confidence|purpose|value|possible|imagine|सोच|भरोसा|सफलता|विश्वास|उम्मीद|आज़ादी|भविष्य|विचार|बदलाव)$/iu;
const number=/^[₹$]?\d[\d,.%]*$|^[०-९][०-९,%.]*$/u;
const procedural=[
 {shape:'nodes',test:/(connect|link|network|together|relationship|team|जोड़|रिश्ता|संबंध)/iu},
 {shape:'arrow',test:/(go|move|start|begin|step|progress|direction|चल|आगे|शुरू|कदम)/iu},
 {shape:'cycle',test:/(repeat|cycle|routine|daily|again|habit|दोहर|रोज|आदत)/iu},
 {shape:'compare',test:/(versus|rather|instead|compare|difference|contrast|बनाम|इसके बजाय|तुलना)/iu},
 {shape:'focus',test:/(focus|look|notice|attention|see|observe|ध्यान|देख|नज़र)/iu},
 {shape:'time',test:/(minute|second|hour|time|wait|delay|समय|मिनट|घंट|इंतज़ार)/iu}
];
function matches(w,phrase){return phrase.split(/\s+/).some(v=>v===w||(w.length>3&&v.length>3&&(w.startsWith(v)||v.startsWith(w))));}
/* Resolution does not guess an image from a generic word. One marker always returns one tier. */
function resolve(word,context,assets){const w=clean(word);if(!w)return {tier:'type',word:String(word||context||'•')};
 if(number.test(w))return {tier:'procedural',shape:'number',word:String(word)};
 if(!common.has(w)&&assets){
  for(let j=0;j<(assets.library||[]).length;j++)if(matches(w,assets.library[j][0]))return {tier:'library',source:'svg',index:j,word:String(word)};
  for(const [id,terms] of (assets.concepts||[]))if(assets.scenes&&assets.scenes[id]&&terms.some(v=>matches(w,v)))return {tier:'library',source:'scene',id,word:String(word)};
 }
 for(const p of procedural)if(p.test.test(w))return {tier:'procedural',shape:p.shape,word:String(word)};
 if(!abstract.test(w)&&/^[\p{L}]{4,}$/u.test(w)&&!common.has(w))return {tier:'procedural',shape:'tracker',word:String(word)};
 return {tier:'type',word:String(word)};
}
function libraryIcon(index,assets){if(iconCache.has(index))return iconCache.get(index);
 const row=assets.library[index];if(!row)return null;
 const raw=row[1].replace(/fill="(?!none)[^"]*"/g,'fill="none"').replace(/stroke="(?!none)[^"]*"/g,'stroke="'+PAPER+'"').replace(/stroke-width="[^"]*"/g,'stroke-width="2"').replace(/rx="[^"]*"/g,'rx="2"');
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="'+PAPER+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">'+raw+'</g></svg>';
 const img=new Image(),rec={image:img,ok:false};iconCache.set(index,rec);
 img.onload=()=>{rec.ok=true;root.dispatchEvent(new Event('structural-asset-ready'))};img.onerror=()=>{rec.failed=true};
 img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);return rec;
}
function grain(c){if(!noise){noise=document.createElement('canvas');noise.width=noise.height=128;const n=noise.getContext('2d'),d=n.createImageData(128,128);let seed=23719;
  for(let i=0;i<d.data.length;i+=4){seed=(1664525*seed+1013904223)>>>0;const v=seed>>>24;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=120}n.putImageData(d,0,0)}
 c.save();c.globalAlpha=.05;c.fillStyle=c.createPattern(noise,'repeat');c.fillRect(0,0,720,1280);c.restore()}
function background(c){c.save();c.fillStyle=MATTE;c.fillRect(0,0,720,1280);c.strokeStyle=GRID;c.lineWidth=1;c.beginPath();for(let x=0;x<=720;x+=40){c.moveTo(x+.5,0);c.lineTo(x+.5,1280)}for(let y=0;y<=1280;y+=40){c.moveTo(0,y+.5);c.lineTo(720,y+.5)}c.stroke();c.restore()}
function frame(c){c.save();c.strokeStyle='rgba(247,244,255,.3)';c.lineWidth=1;c.beginPath();c.moveTo(48.5,108);c.lineTo(48.5,638);c.moveTo(671.5,108);c.lineTo(671.5,638);c.moveTo(48,674.5);c.lineTo(672,674.5);c.stroke();c.fillStyle=PAPER;c.fillRect(47,673,3,3);c.fillRect(670,673,3,3);c.restore()}
function line(c,x1,y1,x2,y2,p=1){c.beginPath();c.moveTo(x1,y1);c.lineTo(x1+(x2-x1)*clamp(p),y1+(y2-y1)*clamp(p));c.stroke()}
function title(c,text,x,y,max=590,size=58,color=PAPER){text=String(text||'');if(!text)return;c.save();c.font='600 '+size+'px '+FONT;c.textAlign='center';c.textBaseline='middle';let width=c.measureText(text).width;if(width>max)c.scale(max/width,1),x*=width/max;c.fillStyle=color;c.fillText(text,x,y);c.restore()}
function marker(c,word,x,y,phase){c.save();const q=ease(phase);c.strokeStyle=PAPER;c.lineWidth=1;c.globalAlpha=.32+.68*q;c.strokeRect(x-175,y-140,350,280);c.strokeStyle=WHITE;line(c,x-175,y+140,x-175+350*q,y+140);c.fillStyle=PAPER;c.fillRect(x-3,y-3,6,6);c.restore();title(c,word,x,y+200,560,42)}
function vector(c,item,progress,amplitude){const q=ease(progress),x=360,y=338;c.save();c.strokeStyle=PAPER;c.fillStyle=PAPER;c.lineWidth=1;c.globalAlpha=.25+.75*q;
 if(item.shape==='number'){marker(c,item.word,x,y,q);c.restore();title(c,item.word,x,y,600,128,WHITE);return}
 if(item.shape==='nodes'){[210,360,510].forEach((px,k)=>{c.beginPath();c.arc(px,y+(k===1?-70:60),20,0,Math.PI*2);c.stroke()});line(c,230,y+49,340,y-59,q);line(c,380,y-59,490,y+49,q)}
 else if(item.shape==='cycle'){c.beginPath();c.arc(x,y,125,-Math.PI/2,-Math.PI/2+Math.PI*1.8*q);c.stroke();c.fillRect(x+119,y-20,10,10)}
 else if(item.shape==='time'){c.beginPath();c.arc(x,y,118,0,Math.PI*2);c.stroke();line(c,x,y,x,y-76,q);line(c,x,y,x+62,y,q)}
 else if(item.shape==='compare'){c.strokeRect(108,y-123,226,247);c.strokeRect(386,y-123,226,247);line(c,343,y,377,y,q)}
 else if(item.shape==='focus'){[110,66].forEach(r=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2*q);c.stroke()});c.fillRect(x-4,y-4,8,8)}
 else if(item.shape==='arrow'){line(c,150,y,545,y,q);if(q>.7){line(c,515,y-30,545,y,q);line(c,515,y+30,545,y,q)}}
 else {c.strokeRect(170,y-118,380,236);line(c,202,y+88,518,y+88,q);c.fillRect(202+316*q,y+84,8,8)}
 c.restore();title(c,item.word,360,540,580,Math.round(48+6*Math.min(1,amplitude)),WHITE)}
function typography(c,text,progress,amplitude){const q=ease(progress),word=String(text||'•');c.save();c.beginPath();c.rect(48,172,624,435);c.clip();c.globalAlpha=q;c.translate(360,358+(1-q)*58);c.scale(.94+.06*q+Math.min(.025,amplitude*.025),.94+.06*q);
 c.font='600 150px '+FONT;c.textAlign='center';c.textBaseline='middle';const m=c.measureText(word).width;if(m>600)c.scale(600/m,600/m);c.fillStyle=WHITE;c.fillText(word,0,0);c.restore();c.save();c.strokeStyle=PAPER;c.lineWidth=1;line(c,95,555,95+530*q,555);c.restore()}
function sceneAsset(c,item,data,progress){if(item.source==='svg'){const r=libraryIcon(item.index,data.assets);if(!r||!r.ok)return false;c.save();c.globalAlpha=ease(progress);c.translate(360,344+(1-ease(progress))*45);c.drawImage(r.image,-175,-175,350,350);c.restore();return true}
 if(item.source==='scene'&&data.assets.stageFit){if(!silhouette){silhouette=document.createElement('canvas');silhouette.width=720;silhouette.height=1280}const off=silhouette.getContext('2d');off.setTransform(1,0,0,1,0,0);off.clearRect(0,0,720,1280);off.save();off.shadowBlur=0;try{data.assets.stageFit(off,item.id,Math.max(.02,data.time-data.start),data.time,PAPER,data.palette||{},0,false,item.word)}catch(e){off.restore();return false}off.restore();off.globalCompositeOperation='source-in';off.fillStyle=PAPER;off.fillRect(0,0,720,1280);off.globalCompositeOperation='source-over';c.save();c.globalAlpha=ease(progress);c.drawImage(silhouette,0,0);c.restore();return true}return false}
function media(c,m,progress){const el=m.el,w=el.videoWidth||el.naturalWidth,h=el.videoHeight||el.naturalHeight;if(!w||!h)return false;
 const x=64,y=145,W=592,H=446,scale=Math.max(W/w,H/h);c.save();c.beginPath();c.rect(x,y,W,H);c.clip();c.filter='grayscale(1) contrast(1.15)';c.drawImage(el,x+(W-w*scale)/2,y+(H-h*scale)/2,w*scale,h*scale);c.filter='none';c.strokeStyle=PAPER;c.lineWidth=1;c.strokeRect(x+.5,y+.5,W-1,H-1);c.restore();return true}
function renderScene(c,data){background(c);const words=data.words||[],t=data.time;
 let active=words.length?0:-1;for(let k=0;k<words.length;k++)if(t>=words[k].s)active=k;
 const w=active>=0?words[active]:null,markerText=w?.w||data.text||'•',start=w?.s??data.start,progress=clamp((t-start)/.36),asset=data.assets||{},item=resolve(markerText,data.text,asset);
 const layered=data.layers||{};let libraryPainted=false;const useMedia=data.media&&layered.media!==false&&(data.treatment==='media'||data.treatment==='auto'&&['balanced','footage'].includes(data.direction));
 c.save();c.beginPath();c.rect(46,110,628,535);c.clip();
 if(useMedia&&media(c,data.media,progress)){/* User media remains the primary layer. */}
 else if(layered.diagram!==false){const picked=data.pin&&asset.scenes?.[data.pin]?{tier:'library',source:'scene',id:data.pin,word:markerText}:item;
  if(picked.tier==='library'){libraryPainted=sceneAsset(c,picked,data,progress);if(!libraryPainted)vector(c,{shape:'tracker',word:markerText},progress,data.amplitude||0)}
  else if(picked.tier==='procedural')vector(c,picked,progress,data.amplitude||0);
  else typography(c,markerText,progress,data.amplitude||0);
 }else typography(c,markerText,progress,data.amplitude||0); // A visible rhythm remains even if diagram layer is hidden.
 c.restore();
 if(layered.labels!==false){c.save();c.beginPath();c.rect(54,120,612,525);c.clip();
  if(useMedia||libraryPainted){c.fillStyle='rgba(17,17,17,.9)';c.fillRect(90,562,540,54);title(c,markerText,360,587,520,38)}c.restore()}
 frame(c);return {tier:item.tier,word:markerText,index:active};
}
function caption(c,{cue,time,config,hits,safe}){hits.length=0;if(!config.on||!cue?.words?.length)return;
 const ws=cue.words,active=Math.max(0,ws.reduce((idx,w,k)=>time>=w.s?k:idx,0)),start=Math.max(0,active-2),shown=ws.slice(start,active+1),y=config.y*1280;
 let size=(shown.length===1?90:shown.length===2?72:64)*config.size/100,maxW=Math.min(630,720*(1-2*(safe?.right||12)/100));
 c.save();c.font='600 '+size+'px '+FONT;const gap=15;let widths=shown.map(w=>c.measureText(w.w).width),total=widths.reduce((a,b)=>a+b,0)+gap*(shown.length-1);if(total>maxW){size*=maxW/total;c.font='600 '+size+'px '+FONT;widths=shown.map(w=>c.measureText(w.w).width);total=widths.reduce((a,b)=>a+b,0)+gap*(shown.length-1)}
 c.textAlign='center';c.textBaseline='middle';c.fillStyle='rgba(17,17,17,.86)';c.fillRect(360-total/2-18,y-size*.83,total+36,size*1.66);
 let x=360-total/2;shown.forEach((word,k)=>{const original=start+k,phase=clamp((time-word.s)/.24),q=ease(phase),width=widths[k],cx=x+width/2;
  c.save();c.beginPath();c.rect(x-2,y-size,x+width+2-(x-2),size*2);c.clip();c.globalAlpha=Math.max(.38,q);c.translate(cx,y+(1-q)*size*.36);c.fillStyle=original%2===0?WHITE:PAPER;c.fillText(word.w,0,0);if(original===active){c.fillRect(-width/2,size*.54,width,1)}c.restore();
  hits.push({si:cue.si,ci:cue.ci,k:cue.idx+original,x0:x-2,x1:x+width+2,y0:y-size*.9,y1:y+size*.9});x+=width+gap
 });c.restore()}
root.StructuralReel={resolve,renderScene,caption,background,frame,grain,ease};
})(window);
