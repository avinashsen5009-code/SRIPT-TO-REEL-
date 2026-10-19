/* Structural minimalism renderer. Visual-only adapter: no audio, timeline or encoder changes. */
(function(root){
'use strict';
const WHITE='#FFFFFF',PAPER='#F7F4FF',GRID='rgba(247,244,255,.05)',MATTE='#111111';
const FONT='"Iowan Old Style","Baskerville",Georgia,"Noto Sans Devanagari","Nirmala UI",Mangal,serif';
const iconCache=new Map();let noise=null,silhouette=null;
const clamp=x=>Math.max(0,Math.min(1,x));
/* Exact CSS cubic-bezier(.25,1,.5,1), solved at the supplied timestamp. */
function ease(x){x=clamp(x);if(x<=0)return 0;if(x>=1)return 1;let l=0,r=1;for(let j=0;j<10;j++){const q=(l+r)/2,p=3*.25*q*(1-q)*(1-q)+3*.5*q*q*(1-q)+q*q*q;if(p<x)l=q;else r=q}const q=(l+r)/2;return 3*q*(1-q)*(1-q)+3*q*q*(1-q)+q*q*q}
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
function matches(w,phrase){return phrase.split(/\s+/).some(v=>v===w||(/^[a-z]{4,}$/i.test(v)&&[v+'s',v+'es',v+'ed',v+'ing'].includes(w)));}
/* Resolution does not guess an image from a generic word. One marker always returns one tier. */
function resolve(word,context,assets){const w=clean(word);if(!w)return {tier:'type',word:String(word||context||'•')};
 if(number.test(w))return {tier:'procedural',shape:'number',word:String(word)};
 if(!common.has(w)&&assets){
  for(let j=0;j<(assets.library||[]).length;j++)if(matches(w,assets.library[j][0]))return {tier:'library',source:'svg',index:j,word:String(word)};
  for(const [id,terms] of (assets.concepts||[]))if(assets.scenes&&assets.scenes[id]&&terms.some(v=>matches(w,v)))return {tier:'library',source:'scene',id,word:String(word)};
 }
 for(const p of procedural)if(p.test.test(w))return {tier:'procedural',shape:p.shape,word:String(word)};
 /* Unmatched concepts abstain rather than drawing an unrelated tracker. */
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
function vector(c,item,progress,amplitude,showTitle=true){const q=ease(progress),x=360,y=338;c.save();c.strokeStyle=PAPER;c.fillStyle=PAPER;c.lineWidth=1;c.globalAlpha=.25+.75*q;
 if(item.shape==='number'){marker(c,item.word,x,y,q);c.restore();title(c,item.word,x,y,600,128,WHITE);return}
 if(item.shape==='nodes'){[210,360,510].forEach((px,k)=>{c.beginPath();c.arc(px,y+(k===1?-70:60),20,0,Math.PI*2);c.stroke()});line(c,230,y+49,340,y-59,q);line(c,380,y-59,490,y+49,q)}
 else if(item.shape==='cycle'){c.beginPath();c.arc(x,y,125,-Math.PI/2,-Math.PI/2+Math.PI*1.8*q);c.stroke();c.fillRect(x+119,y-20,10,10)}
 else if(item.shape==='time'){c.beginPath();c.arc(x,y,118,0,Math.PI*2);c.stroke();line(c,x,y,x,y-76,q);line(c,x,y,x+62,y,q)}
 else if(item.shape==='compare'){c.strokeRect(108,y-123,226,247);c.strokeRect(386,y-123,226,247);line(c,343,y,377,y,q)}
 else if(item.shape==='focus'){[110,66].forEach(r=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2*q);c.stroke()});c.fillRect(x-4,y-4,8,8)}
 else if(item.shape==='arrow'){line(c,150,y,545,y,q);if(q>.7){line(c,515,y-30,545,y,q);line(c,515,y+30,545,y,q)}}
 else {c.strokeRect(170,y-118,380,236);line(c,202,y+88,518,y+88,q);c.fillRect(202+316*q,y+84,8,8)}
 c.restore();if(showTitle)title(c,item.word,360,540,580,Math.round(48+6*Math.min(1,amplitude)),WHITE)}
function typography(c,text,progress,amplitude){const q=ease(progress),word=String(text||'•');c.save();c.beginPath();c.rect(48,172,624,435);c.clip();c.globalAlpha=q;c.translate(360,358+(1-q)*58);c.scale(.94+.06*q+Math.min(.025,amplitude*.025),.94+.06*q);
 c.font='600 150px '+FONT;c.textAlign='center';c.textBaseline='middle';const m=c.measureText(word).width;if(m>600)c.scale(600/m,600/m);c.fillStyle=WHITE;c.fillText(word,0,0);c.restore();c.save();c.strokeStyle=PAPER;c.lineWidth=1;line(c,95,555,95+530*q,555);c.restore()}
function sceneAsset(c,item,data,progress){if(item.source==='svg'){const r=libraryIcon(item.index,data.assets);if(!r||!r.ok)return false;c.save();c.globalAlpha=ease(progress);c.translate(360,344+(1-ease(progress))*45);c.drawImage(r.image,-175,-175,350,350);c.restore();return true}
 if(item.source==='scene'&&data.assets.stageFit){if(!silhouette){silhouette=document.createElement('canvas');silhouette.width=720;silhouette.height=1280}const off=silhouette.getContext('2d');off.setTransform(1,0,0,1,0,0);off.clearRect(0,0,720,1280);off.save();off.shadowBlur=0;try{data.assets.stageFit(off,item.id,Math.max(.02,data.time-data.start),data.time,PAPER,data.palette||{},0,false,item.word)}catch(e){off.restore();return false}off.restore();off.globalCompositeOperation='source-in';off.fillStyle=PAPER;off.fillRect(0,0,720,1280);off.globalCompositeOperation='source-over';c.save();c.globalAlpha=ease(progress);c.drawImage(silhouette,0,0);c.restore();return true}return false}
function media(c,m,progress){const el=m.el,w=el.videoWidth||el.naturalWidth,h=el.videoHeight||el.naturalHeight;if(!w||!h)return false;
 const x=64,y=145,W=592,H=446,scale=Math.max(W/w,H/h);c.save();c.beginPath();c.rect(x,y,W,H);c.clip();c.filter='grayscale(1) contrast(1.15)';c.drawImage(el,x+(W-w*scale)/2,y+(H-h*scale)/2,w*scale,h*scale);c.filter='none';c.strokeStyle=PAPER;c.lineWidth=1;c.strokeRect(x+.5,y+.5,W-1,H-1);c.restore();return true}
/* Hold one explanatory hero per scene. Only the small progress trace follows each word. */
function heroFor(data){
 const asset=data.assets||{},all=(data.words||[]).filter(w=>w.s<=data.time+.08),long=(data.end-data.start)>5.2;
 const beat=Math.min(3,Math.max(0,Math.floor((data.time-data.start)/3.1))),section=long?all.filter(w=>w.s>=data.start+beat*3.1&&w.s<data.start+(beat+1)*3.1):all;
 const ws=section.length?section:all,candidate=[];
 for(const w of ws){const r=resolve(w.w,data.text,asset);if(common.has(clean(w.w)))continue;
  const weight=r.tier==='library'?4:r.tier==='procedural'?2:1;
  candidate.push({r,weight,at:w.s})}
 candidate.sort((a,b)=>b.weight-a.weight||a.at-b.at);
 return candidate[0]?.r||{tier:'type',word:all.find(w=>!common.has(clean(w.w)))?.w||'•'};
}
function narrative(c,plan,phase){
 const p=ease(phase),kind=plan?.purpose||'mechanism';c.save();c.strokeStyle='rgba(247,244,255,.55)';c.lineWidth=1.5;
 if(kind==='contrast'){line(c,360,190,360,475,p);c.strokeRect(84,225,148,215);c.strokeRect(488,225,148,215)}
 else if(kind==='list'){for(let k=0;k<3;k++){const x=176+k*184;c.strokeRect(x-24,490,48,48);line(c,x-10,515,x+10,515,Math.max(0,Math.min(1,(p*3-k))))}}
 else if(kind==='problem'){line(c,94,470,275,470,p);line(c,445,470,626,470,p);c.strokeRect(330,452,60,36)}
 else if(kind==='takeaway'){c.beginPath();c.arc(360,345,184,-Math.PI/2,-Math.PI/2+Math.PI*1.5*p);c.stroke()}
 else if(kind==='hook'){c.beginPath();c.arc(360,345,170,Math.PI,-Math.PI+Math.PI*p);c.stroke()}
 else if(kind==='example'){line(c,140,505,580,505,p);c.fillStyle=PAPER;c.fillRect(140+430*p,501,8,8)}
 else{[130,590].forEach(x=>{c.beginPath();c.arc(x,345,9,0,7);c.stroke()});line(c,145,345,575,345,p)}
 c.restore()
}
function rhythm(c,words,index,time){if(!words.length)return;c.save();c.strokeStyle='rgba(247,244,255,.38)';c.fillStyle=PAPER;c.lineWidth=1;
 const n=words.length,left=98,width=524,y=619;c.beginPath();c.moveTo(left,y);c.lineTo(left+width,y);c.stroke();
 words.forEach((w,k)=>{const x=left+(k+.5)*width/n;c.fillRect(x-1,y-3,2,6)});
 const x=left+(Math.max(0,index)+.5)*width/n;c.fillRect(x-3,y-6,6,12);c.restore()}
/* Source-limited editorial diagrams: one primary composition per scene. Never
   invent amounts, map points, medical detail or a relationship absent from speech. */
const sourceKinds=new Set(['analogycard','venndiagram','conceptmap','mindmap','decisiontree','barchart','linechart','piechart','scalecompare','matrix2x2','historytimeline','numberline','formulabuilder','mythfactflip','truefalse','quizthreeoption','flashcardflip','mnemonicletters','mappin','anatomydiagram','statechange','crosssection']);
const selfKinds=new Set(['habitloop','streakcalendar','progressring','daytimeline','habitgrid','batterymeter','compoundcurve','beforeaftersplit','thinkvsreality','balancescale','checklisttick','routineclock']);
function sourcePlan(data){if(data.treatment!=='auto'||data.pin)return null;const text=data.text||'';
 const edu=root.EducationalComponents?.parse(text);if(edu&&!edu.reuse&&sourceKinds.has(edu.id))return{family:'education',plan:edu};
 const prop=root.MetaphorProps?.plan(text);if(prop)return{family:'prop',plan:prop};
 const self=root.SelfImprovement?.parse(text);if(self&&selfKinds.has(self.id))return{family:'self',plan:self};
 const graph=root.SceneGraph?.fromText(text);if(graph&&!graph.review&&['definition','cause','cycle','hierarchy'].includes(graph.kind)&&graph.nodes?.length>=2)return{family:'graph',plan:graph};
 return null
}
function sourceAt(data,index){const at=data.words?.[Math.max(0,index)]?.s;if(at==null)return 0;const remain=Math.max(.08,(data.end||at+1)-at);return ease((data.time-at)/Math.min(data.motion==='calm'?.65:.32,remain*.85))}
function sourceText(c,v,x,y,w=160,px=29){v=String(v||'').split(/\s+/).slice(0,4).join(' ').slice(0,38);if(!v)return;title(c,v,x,y,w,px,PAPER)}
function sourceBox(c,x,y,w,h,q){if(q<=0)return;c.save();c.globalAlpha=.18+.82*q;c.strokeStyle=PAPER;c.lineWidth=1.4;c.strokeRect(x+.5,y+.5,w-1,h-1);c.fillStyle='rgba(247,244,255,.025)';c.fillRect(x+1,y+1,w-2,h-2);c.fillStyle=PAPER;c.fillRect(x+11,y+13,31*q,2);c.restore()}
function sourceVisual(c,data,source){const p=source.plan,kind=p.id||p.kind,labels=(p.labels||p.nodes?.map(n=>n.label)||[]),idx=(p.at||p.nodes?.map(n=>n.at)||[]);c.save();c.beginPath();c.rect(48,110,624,548);c.clip();
 c.fillStyle='rgba(247,244,255,.42)';c.fillRect(70,133,34,2);c.font='500 22px '+FONT;c.textAlign='left';c.fillText((source.family==='prop'?'OBJECT':source.family==='education'?'EXPLAIN':'STRUCTURE'),115,141);
 if(source.family==='prop'){root.MetaphorProps.paintGlyph(c,p,{skin:'structural',t:data.time,start:data.start,end:data.end,words:data.words,calm:data.motion==='calm'},360,349,.85);if(!data.captionsOn)sourceText(c,p.term,360,570,520,39)}
 else if(source.family==='education'&&['barchart','linechart','piechart','scalecompare'].includes(kind)&&p.values?.length>=2){const rows=p.values.slice(0,5),max=Math.max(1,...rows.map(v=>Math.abs(v.num))),n=rows.length;sourceBox(c,76,184,568,343,1);
  if(kind==='piechart'){let angle=-Math.PI/2;const total=rows.reduce((sum,v)=>sum+Math.max(0,v.num),0)||1;rows.forEach((v,j)=>{const q=sourceAt(data,p.valueAt?.[j]??idx[j]??j),span=Math.PI*2*Math.max(0,v.num)/total*q;c.strokeStyle=['#F7F4FF','#C0BDC7','#8D8C94','#A9A8B0','#77777F'][j];c.lineWidth=31;c.beginPath();c.arc(273,344,104,angle,angle+span);c.stroke();angle+=Math.PI*2*Math.max(0,v.num)/total});}
  else if(kind==='linechart'){c.strokeStyle=PAPER;c.lineWidth=2;c.beginPath();let drawn=0;rows.forEach((v,j)=>{const q=sourceAt(data,p.valueAt?.[j]??idx[j]??j);if(!q)return;const x=132+j*455/Math.max(1,n-1),y=451-180*(v.num/max)*q;drawn++?c.lineTo(x,y):c.moveTo(x,y)});c.stroke()}
  else rows.forEach((v,j)=>{const q=sourceAt(data,p.valueAt?.[j]??idx[j]??j);if(!q)return;const x=124+j*(478/n),h=(kind==='scalecompare'?Math.sqrt(v.num/max):v.num/max)*192*q;c.fillStyle=j%2?'#A8A8AE':PAPER;c.fillRect(x,454-h,Math.min(64,478/n-12),h)});
  rows.forEach((v,j)=>{if(!sourceAt(data,p.valueAt?.[j]??idx[j]??j))return;const x=145+j*(478/n);sourceText(c,v.raw,x,230,Math.max(65,478/n-8),28);sourceText(c,v.label,x,494,Math.max(75,478/n-8),25)})}
 else if(source.family==='education'&&kind==='historytimeline'&&p.values?.length>=2){const rows=p.values.slice(0,4);c.strokeStyle=PAPER;c.lineWidth=2;line(c,118,359,599,359,1);rows.forEach((v,j)=>{const q=sourceAt(data,idx[j]??j),x=135+j*445/Math.max(1,rows.length-1);if(!q)return;c.fillStyle=PAPER;c.fillRect(x-5,354,10,10);sourceText(c,v.raw,x,299,110,34);sourceText(c,v.event,x,423,130,24)})}
 else if(source.family==='self'&&['progressring','streakcalendar','batterymeter','compoundcurve'].includes(kind)){const raw=p.values?.[0]||'',num=Number(String(raw).replace(/[^0-9.]/g,''));const valid=Number.isFinite(num)&&raw!=='';const q=sourceAt(data,idx[0]??0);c.strokeStyle='rgba(247,244,255,.25)';c.lineWidth=2;c.beginPath();c.arc(360,352,138,0,7);c.stroke();c.strokeStyle=PAPER;c.lineWidth=5;c.beginPath();c.arc(360,352,138,-Math.PI/2,-Math.PI/2+Math.PI*2*(valid&&String(raw).includes('%')?Math.min(1,num/100):.7)*q);c.stroke();if(valid)sourceText(c,String(raw),360,354,320,65);else sourceText(c,labels[0],360,353,400,35)}
 else{const items=labels.slice(0,kind==='mindmap'||kind==='matrix2x2'?4:3);if(!items.length){c.restore();return false}const isPair=['analogycard','venndiagram','conceptmap','beforeaftersplit','thinkvsreality','statechange','mythfactflip','flashcardflip','formulabuilder'].includes(kind),n=items.length;
  items.forEach((v,j)=>{let x,y,w,h;if(isPair){w=241;h=192;x=j%2?390:89;y=271}else if(n===1){x=146;y=257;w=428;h=232}else if(n===2){x=89+j*280;y=267;w=244;h=206}else{x=89+(j%3)*185;y=j%2?301:236;w=160;h=185}const q=sourceAt(data,idx[j]??j);if(!q)return;sourceBox(c,x,y,w,h,q);sourceText(c,v,x+w/2,y+h/2,w-22,n>2?27:34)});
  if(n>=2){c.strokeStyle='rgba(247,244,255,.72)';c.lineWidth=2;const y=isPair?367:550;line(c,342,y,377,y,sourceAt(data,idx[1]??1));if(['cycle','habitloop'].includes(kind)){c.beginPath();c.arc(360,369,150,0,Math.PI*1.4*sourceAt(data,idx[1]??1));c.stroke()}}}
 c.restore();return true}
/* Landscape companion shows the same spoken subject, never a generic ring. */
function paintWide(c,data,x,y){const sourced=sourcePlan(data);if(!sourced)return false;const p=sourced.plan,id=p.id||p.kind,idx=p.at||[],values=p.values||[];c.save();c.beginPath();c.rect(839,82,322,210);c.clip();c.strokeStyle=PAPER;c.fillStyle=PAPER;c.lineWidth=2;
 if(sourced.family==='prop'){root.MetaphorProps.paintGlyph(c,p,{skin:'structural',t:data.time,start:data.start,end:data.end,words:data.words,calm:data.motion==='calm'},x,y+28,.46)}
 else if(values.length>=2&&['barchart','linechart','piechart','scalecompare'].includes(id)){c.save();c.strokeStyle='rgba(247,244,255,.35)';c.lineWidth=1;c.beginPath();c.moveTo(864,250);c.lineTo(1153,250);c.moveTo(864,142);c.lineTo(864,250);c.stroke();c.restore();const shown=values.filter((v,j)=>sourceAt(data,p.valueAt?.[j]??idx[j]??j)>0);if(shown.length){const max=Math.max(1,...values.map(v=>Math.abs(v.num)));values.slice(0,4).forEach((v,j)=>{const q=sourceAt(data,p.valueAt?.[j]??idx[j]??j);if(!q)return;const xx=875+j*70,hh=120*Math.max(0,v.num)/max*q;c.fillStyle=j%2?'#9999A0':PAPER;c.fillRect(xx,250-hh,32,hh);sourceText(c,v.raw,xx+16,268,57,22)})}}
 else if(values.length===1&&/[0-9०-९]/u.test(String(values[0]))){const q=sourceAt(data,idx[0]??0);if(q>0)sourceText(c,values[0],x,y+20,280,74)}
 else{const labels=(p.labels||p.nodes?.map(n=>n.label)||[]).slice(0,2);labels.forEach((v,j)=>{const q=sourceAt(data,idx[j]??j);if(!q)return;sourceBox(c,853+j*153,128,138,115,q);sourceText(c,v,922+j*153,190,125,25)})}
 c.restore();return true}
/* Neutral two-subject composition. Both objects must be spoken, both must be
   recognizable in the bundled library; no unspoken relationship is asserted. */
const actionWords=new Set('speak speaks speaking said says talk talks talking read reads reading write writes writing open opens opening check checks checking rise rises rising review reviews reviewing count counts counting change changes changing ring rings ringing'.split(' '));
function spokenPair(c,data){if(data.treatment!=='auto'||data.pin||data.layers?.diagram===false)return false;
 const seen=new Set(),pair=[];for(const w of data.words||[]){if(w.s>data.time+.02)break;
  const r=resolve(w.w,data.text,data.assets);if(actionWords.has(clean(w.w)))continue;if(r.tier==='library'&&r.source==='svg'&&!seen.has(r.index)){
   seen.add(r.index);pair.push({word:clean(w.w),at:w.s,index:r.index});if(pair.length===2)break}}
 if(pair.length<2)return false;
 const items=pair.map(v=>({...v,icon:libraryIcon(v.index,data.assets)}));if(items.some(v=>!v.icon?.ok))return false;
 c.save();c.beginPath();c.rect(54,132,612,479);c.clip();items.forEach((item,j)=>{
  const q=ease((data.time-item.at)/(data.motion==='calm'?.7:.34)),x=72+j*294,y=180;
  c.save();c.globalAlpha=q;c.strokeStyle=j?'rgba(247,244,255,.76)':'rgba(247,244,255,.48)';c.lineWidth=1.5;
  c.strokeRect(x,y,276,340);c.fillStyle='rgba(247,244,255,.018)';c.fillRect(x+2,y+2,272,336);
  c.save();c.filter='grayscale(1) brightness(1.35) contrast(1.4)';c.drawImage(item.icon.image,x+49,y+55+(1-q)*18,178,178);c.restore();
  c.fillStyle=PAPER;c.fillRect(x+38,y+260,200,1);title(c,item.word,x+138,y+295,234,38);
  c.restore()});c.restore();return true
}
function renderScene(c,data){background(c);const words=data.words||[],t=data.time;
 let active=words.length?0:-1;for(let k=0;k<words.length;k++)if(t>=words[k].s)active=k;
 const w=active>=0?words[active]:null,markerText=w?.w||data.text||'•',start=w?.s??data.start;
 const sceneProgress=Math.max(.26,clamp((t-data.start)/Math.max(data.motion==='calm'?1.4:.9,Math.min(2,(data.end-data.start)*.4)))),pulse=clamp((t-start)/.3),asset=data.assets||{},hero=data.pin&&asset.scenes?.[data.pin]?{tier:'library',source:'scene',id:data.pin,word:markerText}:heroFor(data),layered=data.layers||{};
 let libraryPainted=false,drawnMedia=false;
 const useMedia=data.media&&layered.media!==false&&(data.treatment==='media'||data.treatment==='auto'&&['balanced','footage'].includes(data.direction));
 const grammar=data.plan?.grammar;
 const sourced=data.direction==='graphics'&&!useMedia&&layered.diagram!==false?sourcePlan(data):null;
 if(sourced&&sourceVisual(c,data,sourced)){rhythm(c,words,active,t);frame(c);return {tier:'source-component',hero:sourced.plan.id||sourced.plan.kind,index:active}}
 if(!data.pin&&!useMedia&&layered.diagram!==false&&grammar?.supported&&
    (data.treatment==='explain'||data.treatment==='auto'&&data.direction!=='stickman')){
  root.VisualGrammar.render(c,grammar,{style:'structural',time:t,revealAt:data.revealAt,calm:data.motion==='calm',getIcon:data.getIcon});
  rhythm(c,words,active,t);frame(c);return{tier:'grounded-diagram',word:markerText,hero:grammar.kind,index:active};
 }
 if(!useMedia&&spokenPair(c,data)){rhythm(c,words,active,t);frame(c);return{tier:'spoken-pair',word:markerText,index:active}}
 c.save();c.beginPath();c.rect(46,110,628,535);c.clip();
 if(useMedia)drawnMedia=media(c,data.media,sceneProgress);
 if(!drawnMedia){if(layered.diagram!==false&&data.treatment!=='typography'&&!(data.treatment==='auto'&&data.plan?.composition==='typography'))narrative(c,data.plan,sceneProgress);
  if(data.treatment==='typography'||data.treatment==='auto'&&data.plan?.composition==='typography')typography(c,markerText,sceneProgress,0);
  else if(hero.tier==='library'&&layered.diagram!==false){libraryPainted=sceneAsset(c,hero,{...data,time:data.start+Math.max(.02,t-data.start)},sceneProgress);if(!libraryPainted)vector(c,{shape:'focus',word:hero.word},sceneProgress,0)}
  else if(hero.tier==='procedural'&&layered.diagram!==false)vector(c,hero,sceneProgress,0);
  else typography(c,hero.word,sceneProgress,0)
 }
 c.restore();
 if(layered.labels!==false&&(drawnMedia||libraryPainted)){
  c.save();c.fillStyle='rgba(17,17,17,.88)';c.fillRect(90,547,540,58);title(c,hero.word,360,575,520,35);c.restore()}
 rhythm(c,words,active,t);frame(c);return {tier:hero.tier,word:markerText,hero:hero.word,index:active};
}
function caption(c,{cue,time,config,hits,safe}){
 root.CaptionPhrase.draw(c,{cue,time,config,hits,style:'structural',accent:'#D7D2E0'});
}
root.StructuralReel={resolve,renderScene,caption,background,frame,grain,ease,sourcePlan,sourceAt,paintWide};
})(window);
