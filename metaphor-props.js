/* Phase 4: offline, deterministic, source-grounded vector metaphors.
   Illustrative props, not photographs, factual diagrams, fabricated metrics or AI images. */
(function(root){'use strict';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,Number(x)||0)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},W=720,H=1280;
const SPECS=[
 ['iceberg',['iceberg','हिमखंड','barf ka pahaad'],/(?:melt|पिघल|pighal)/iu],
 ['seedtree',['seed','tree','sapling','बीज','पौधा','पेड़','beej','paudha','ped'],/(?:grow|sprout|plant|बढ़|उग|रोप|lagao|ugao|badh)/iu],
 ['mountainflag',['mountain','peak','पहाड़','पर्वत','pahaad','pahad'],/(?:reach|climb|flag|शिखर|चढ़|झंडा|chadho)/iu],
 ['snappingrope',['rope','रस्सी','rassi'],/(?:snap|break|cut|तोड़|टूट|kaato|todo)/iu],
 ['hourglass',['hourglass','रेतघड़ी','रेत घड़ी','ret ghadi'],/(?:turn|pass|flow|उलट|बह|behta)/iu],
 ['flamestreak',['flame','fire','streak flame','लौ','ज्वाला','आग','aag','lau'],/(?:burn|light|ignite|जल|jalaa|streak|लगातार)/iu],
 ['braingears',['brain','mind gears','दिमाग','मस्तिष्क','dimaag','dimag'],/(?:think|work|turn|सोच|चल|socho)/iu],
 ['battery',['battery','बैटरी','energy meter','ऊर्जा मीटर','baitari'],/(?:charge|drain|fill|खत्म|भर|घट|charge karo)/iu],
 ['anchor',['anchor','लंगर','लंगर डाल','langar'],/(?:drop|hold|steady|डाल|थाम|roko)/iu],
 ['mazeexit',['maze','labyrinth','भूलभुलैया','भूल भुलैया','bhulbhulaiya'],/(?:exit|solve|escape|बाहर|निकास|niklo)/iu],
 ['mirror',['mirror','आईना','आईने','दर्पण','aaina'],/(?:reflect|look|देख|dekh)/iu],
 ['keylock',['key','lock','unlock','चाबी','ताला','कुंजी','chaabi','tala'],/(?:unlock|open|खोल|kholo|खुल)/iu],
 ['compass',['compass','दिशासूचक','कम्पास','kampas'],/(?:turn|choose|direction|दिशा|मुड़|mod)/iu],
 ['dumbbell',['dumbbell','weightlift','डम्बल','डंबल','वजन','dambal'],/(?:lift|raise|उठा|uthao)/iu],
 ['candle',['candle','मोमबत्ती','mombatti'],/(?:blow|extinguish|बुझ|जल|bujhao)/iu],
 ['ladder',['ladder','सीढ़ी','सीढ़ियाँ','seedhi'],/(?:climb|step|चढ़|chadho)/iu],
 ['scale',['balance scale','weighing scale','तराजू','संतुलन तराजू','tarazu'],/(?:tilt|balance|weigh|तोल|झुक|tol)/iu],
 ['dominochain',['domino','dominoes','डोमिनो','domino chain'],/(?:fall|knock|chain|गिर|गिराओ|girao)/iu],
 ['lightbulb',['lightbulb','bulb','बल्ब','लाइटबल्ब','bulb idea'],/(?:light|switch on|idea|जल|विचार|soch)/iu],
 ['bookstack',['book stack','books stacked','stack of books','किताबों का ढेर','किताबों की ढेर','kitab stack','kitabein stack'],/(?:stack|add|pile|जमा|रख|badhao)/iu],
 ['graduationcap',['graduation cap','graduate','graduation','डिग्री टोपी','स्नातक टोपी','graduation topi'],/(?:graduate|throw|उछाल|पास|pass)/iu],
 ['calendar',['calendar','कैलेंडर','दिनदर्शिका','calendar date','kalendar'],/(?:mark|check|tick|चिह्न|निशान|marked)/iu],
 ['clock',['clock','घड़ी','घंटाघर','ghadi'],/(?:tick|turn|घूम|बजे|baje)/iu]
];
const IDS=SPECS.map(x=>x[0]);
function phraseMatch(text,term){const esc=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return new RegExp('(^|[^\\p{L}\\p{M}\\p{N}])'+esc+'(?=$|[^\\p{L}\\p{M}\\p{N}])','iu').exec(text)}
function findAction(pattern,text){const re=new RegExp(pattern.source,'giu');for(const m of text.matchAll(re)){if(!/^[a-z]/i.test(m[0]))return m;const before=text.slice(0,m.index),after=text.slice(m.index+m[0].length),prior=before.match(/\p{L}$/u),tail=after.match(/^\p{L}*/u)?.[0]||'';const final=m[0].at(-1);if(!prior&&(!tail||['s','es','ed','ing','d','en',final+'ing',final+'ed'].includes(tail.toLowerCase())))return m}return null}
function plan(input){const text=String(input||'').normalize('NFC'),low=text.toLowerCase();if(!low.trim())return null;let best=null;for(const [id,names,action] of SPECS)for(const term of names){const m=phraseMatch(low,term);if(!m)continue;const score=term.length+(term.includes(' ')?4:0),at=m.index+m[1].length;if(!best||score>best.score)best={id,score,at,term,action}}
 if(!best)return null;const toks=[...text.matchAll(/[\p{L}\p{M}\p{N}₹$%]+/gu)],at=Math.max(0,toks.findIndex(m=>m.index>=best.at)),actionMatch=findAction(best.action,text),actAt=actionMatch?Math.max(0,toks.findIndex(m=>m.index>=actionMatch.index)):-1;
 const spokenCount=text.match(/(?:\b\d{1,3}\b|[०-९]{1,3})\s*(?:day|days|din|दिन|streak)|(?:streak|लगातार)\s*(?:\d{1,3}|[०-९]{1,3})/iu)?.[0]||'';
 const countMatch=spokenCount.match(/[\d०-९]+/u),countOffset=countMatch?text.indexOf(countMatch[0]):0;
 const hour=text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(?:am|pm)\b|([०-९]{1,2})\s*बजे/iu);
 const hourNum=hour?.[0]?.match(/[\d०-९]+/u),hourOffset=hourNum?text.indexOf(hourNum[0],hour.index):0;
 const pct=text.match(/\b(\d+(?:\.\d+)?)\s*%/u);
 const pctOffset=pct?text.indexOf(pct[1],pct.index):0,lowWord=text.match(/\b(?:low|empty|drained)\b|कम|खाली/iu),valueOffset=pct?pctOffset:lowWord?.index||0;const idx=offset=>Math.max(0,toks.findIndex(m=>m.index>=offset));
 return{id:best.id,term:best.term,source:text,at:at<0?0:at,action:!!actionMatch,actionAt:actAt,count:countMatch?.[0]||'',countAt:idx(countOffset),hour:hour?.[0]||'',hourAt:idx(hourOffset),percentage:pct?.[1]||'',valueAt:idx(valueOffset),review:false,interpretation:'literal spoken prop; action only if explicitly spoken'}
}
function reg({id,job,accepts,draw,duration='scene'}){if(REGISTRY[id])throw Error('Duplicate prop '+id);REGISTRY[id]={id,job,accepts,draw,duration};return REGISTRY[id]}
const REGISTRY={};
const rr=(c,x,y,w,h,r)=>{r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()};
function line(c,color,w,...pts){c.strokeStyle=color;c.lineWidth=w;c.beginPath();pts.forEach(([x,y],j)=>j?c.lineTo(x,y):c.moveTo(x,y));c.stroke()}
function circ(c,x,y,r,col){c.fillStyle=col;c.beginPath();c.arc(x,y,Math.max(0,r),0,Math.PI*2);c.fill()}
function label(c,text,x,y,w,size,ink){const str=String(text||'').trim().split(/\s+/).slice(0,4).join(' ').slice(0,38);c.fillStyle=ink;c.textAlign='center';c.textBaseline='middle';c.font='700 '+size+'px Hind,Arial,sans-serif';c.fillText(str,x,y,w)}
const palette=o=>o.skin==='story'?{bg:'#F4EFE4',paper:'#FFFEFB',ink:'#1B2B2D',primary:'#0F3D3F',accent:'#D4622B',wash:'#D6E4DF'}:o.night?{bg:'#0B1230',paper:'#142648',ink:'#FFFFFF',primary:'#8DC6FF',accent:'#E6A93A',wash:'#27416A'}:{bg:'#F3EEE3',paper:'#FFFFFF',ink:'#101828',primary:'#1F4FE0',accent:'#D68B28',wash:'#E4EDFA'};
function backdrop(c,o,P){c.fillStyle=P.bg;c.fillRect(0,0,720,1280);c.strokeStyle=o.skin==='story'?'#D9CEC0':o.night?'#2B4067':'#D7E2EB';c.lineWidth=1;for(let x=55;x<700;x+=57){c.beginPath();c.moveTo(x,142);c.lineTo(x,1008);c.stroke()}}
function coords(o){return o.skin==='story'?{top:206,bottom:628,cy:403}:{top:466,bottom:921,cy:686}}
function progress(o,idx){const at=o.words?.[Math.max(0,idx)]?.s??(Number(o.start)||0);return ease(((Number(o.t)||0)-at)/(o.calm?.75:.32))}
function glyph(c,id,P,q,act,planData,o){const a=P.primary,b=P.accent,d=P.wash;c.lineCap='round';c.lineJoin='round';c.strokeStyle=a;c.fillStyle=d;c.lineWidth=6;
 switch(id){
 case'iceberg':{c.fillStyle=d;c.fillRect(-165,0,330,95);c.save();c.scale(1-act*.42*q,1-act*.36*q);c.beginPath();c.moveTo(-120,0);c.lineTo(-8,-132);c.lineTo(70,-26);c.lineTo(118,82);c.lineTo(-153,82);c.closePath();c.fill();c.strokeStyle=a;c.stroke();c.restore();line(c,b,4,[-171,0],[171,0]);break}
 case'seedtree':{circ(c,0,90,24,b);if(act){line(c,a,9,[0,75],[0,75-157*q]);for(const dir of [-1,1]){c.fillStyle=d;c.beginPath();c.ellipse(dir*58,-25*q,68*q,25*q,dir*.5,0,7);c.fill();c.stroke()}}else{c.fillStyle=d;rr(c,-80,111,160,15,6);c.fill()}break}
 case'mountainflag':{c.fillStyle=d;c.beginPath();c.moveTo(-166,120);c.lineTo(-47,-92);c.lineTo(6,4);c.lineTo(66,-86);c.lineTo(168,120);c.closePath();c.fill();c.stroke();if(act&&q>.02){line(c,a,5,[66,-86],[66,-86-80*q]);c.fillStyle=b;c.beginPath();c.moveTo(66,-86-80*q);c.lineTo(138,-67-80*q);c.lineTo(66,-41-80*q);c.fill()}break}
 case'snappingrope':{if(!act){line(c,a,21,[-156,-30],[156,6]);break}for(const dir of [-1,1]){c.save();c.translate(dir*(act?31*q:0),0);line(c,a,21,[dir*-156,-30],[dir*-4,6]);c.restore()}if(act){line(c,b,4,[-7,-36],[-19,-55]);line(c,b,4,[7,43],[18,65])}break}
 case'hourglass':{line(c,a,8,[-93,-137],[93,-137]);line(c,a,8,[-93,138],[93,138]);line(c,a,6,[-78,-125],[78,125]);line(c,a,6,[78,-125],[-78,125]);c.fillStyle=b;c.beginPath();c.moveTo(-50,-100);c.lineTo(50,-100);c.lineTo(0,-15);c.fill();if(act){line(c,b,4,[0,-9],[0,27+40*q]);c.beginPath();c.moveTo(-64,112);c.lineTo(64,112);c.lineTo(0,112-79*q);c.fill()}break}
 case'flamestreak':{c.fillStyle=b;c.beginPath();c.moveTo(0,-133);c.bezierCurveTo(-42,-44,-105,-37,-71,68);c.bezierCurveTo(-34,154,76,151,82,43);c.bezierCurveTo(84,-22,22,-56,0,-133);c.fill();c.fillStyle=d;c.beginPath();c.ellipse(0,59,24,40,0,0,7);c.fill();if(planData.count&&progress(o,planData.countAt)>.25)label(c,planData.count,0,157,100,43,a);break}
 case'braingears':{c.fillStyle=d;c.beginPath();c.moveTo(0,-111);c.bezierCurveTo(-92,-149,-151,-37,-113,47);c.bezierCurveTo(-101,122,-13,124,0,85);c.bezierCurveTo(33,125,119,110,126,38);c.bezierCurveTo(148,-34,80,-148,0,-111);c.fill();c.stroke();line(c,a,3,[0,-110],[0,85]);for(const x of [-55,55]){c.save();c.translate(x,7);c.rotate(act?q*.7:0);c.strokeStyle=b;c.lineWidth=5;c.strokeRect(-17,-17,34,34);circ(c,0,0,6,b);c.restore()}break}
 case'battery':{c.strokeStyle=a;c.lineWidth=7;rr(c,-149,-76,298,160,18);c.stroke();c.fillStyle=a;c.fillRect(150,-29,21,58);const n=planData.percentage?clamp(Number(planData.percentage)/100):null;if(n!==null)c.fillRect(-133,-59,267*n*progress(o,planData.valueAt),126);else if(/\b(?:low|empty|drained)\b|कम|खाली/iu.test(planData.source)&&progress(o,planData.valueAt)>.25)c.fillRect(-133,-59,52,126);else for(let k=0;k<3;k++){c.fillStyle=d;c.fillRect(-130+k*85,-57,65,120)}break}
 case'anchor':{c.save();c.translate(0,act?-70*(1-q):0);line(c,a,8,[0,-124],[0,85]);circ(c,0,-132,15,d);line(c,a,7,[-68,-87],[68,-87]);c.beginPath();c.arc(0,50,112,.12,Math.PI-.12);c.stroke();line(c,b,7,[-116,67],[-130,76]);line(c,b,7,[116,67],[130,76]);c.restore();break}
 case'mazeexit':{c.strokeStyle=a;c.lineWidth=7;for(const [x,y,w,h] of [[-148,-117,298,235],[-103,-74,207,149],[-56,-27,113,56]]){c.strokeRect(x,y,w,h)}c.fillStyle=P.paper;c.fillRect(135,-40,26,65);if(act){c.save();c.globalAlpha*=q;c.strokeStyle=b;c.lineWidth=7;c.beginPath();c.moveTo(-123,95);c.lineTo(-123,-96);c.lineTo(75,-96);c.lineTo(75,47);c.lineTo(157,47);c.stroke();c.restore()}break}
 case'mirror':{c.strokeStyle=a;c.lineWidth=8;c.beginPath();c.ellipse(0,-18,120,134,0,0,7);c.stroke();line(c,a,6,[0,115],[0,150]);line(c,a,6,[-74,151],[74,151]);if(act){line(c,b,4,[-59,-40],[-36,-69]);line(c,b,4,[40,9],[63,-20])}break}
 case'keylock':{c.strokeStyle=a;c.lineWidth=7;c.beginPath();c.arc(59,-35,62,Math.PI,2*Math.PI);c.stroke();c.fillStyle=d;rr(c,-12,-35,146,145,14);c.fill();c.stroke();circ(c,57,26,10,a);c.save();c.translate(-112+72*q,-20);c.rotate(act?q*.28:0);circ(c,0,0,31,b);circ(c,0,0,13,P.paper);c.fillStyle=b;c.fillRect(23,-10,95,20);c.fillRect(91,3,16,30);c.restore();break}
 case'compass':{c.strokeStyle=a;c.lineWidth=6;c.beginPath();c.arc(0,0,132,0,7);c.stroke();for(const theta of [0,Math.PI/2,Math.PI,Math.PI*1.5]){const x=Math.sin(theta),y=-Math.cos(theta);line(c,a,3,[x*105,y*105],[x*120,y*120])}c.save();c.rotate(act?q*.85:0);c.fillStyle=b;c.beginPath();c.moveTo(0,-104);c.lineTo(-22,8);c.lineTo(22,8);c.fill();c.fillStyle=d;c.beginPath();c.moveTo(0,104);c.lineTo(-22,-8);c.lineTo(22,-8);c.fill();c.restore();break}
 case'dumbbell':{c.save();c.translate(0,act?-25*q:0);line(c,a,17,[-116,0],[116,0]);for(const x of [-134,-99,99,134]){c.fillStyle=x<0?b:d;rr(c,x-14,-66,28,132,7);c.fill();c.strokeStyle=a;c.stroke()}c.restore();break}
 case'candle':{c.fillStyle=d;rr(c,-43,-14,86,146,11);c.fill();c.strokeStyle=a;c.stroke();line(c,a,4,[0,-14],[0,-55]);if(!act||!/(?:blow|extinguish|बुझ|bujhao)/iu.test(planData.source)||q<.55){c.fillStyle=b;c.beginPath();c.moveTo(0,-131);c.bezierCurveTo(-44,-84,-17,-60,0,-62);c.bezierCurveTo(30,-62,40,-95,0,-131);c.fill()}else{c.save();c.globalAlpha*=q;c.strokeStyle=b;c.lineWidth=3;c.beginPath();c.arc(14,-97,23,-.6,2.1+q);c.stroke();c.restore()}break}
 case'ladder':{line(c,a,8,[-75,133],[-45,-124]);line(c,a,8,[75,133],[45,-124]);for(let k=0;k<6;k++){const y=102-k*41;line(c,b,5,[-67+k*5,y],[67-k*5,y])}if(act&&q>.03)circ(c,0,102-q*205,11,b);break}
 case'scale':{line(c,a,8,[0,-125],[0,134]);line(c,a,6,[-117,133],[117,133]);const tilt=act&&/(?:tilt|झुक)/iu.test(planData.source)?(.12*q):0;c.save();c.rotate(tilt);line(c,a,6,[-152,-76],[152,-76]);for(const x of [-112,112]){line(c,a,3,[x,-76],[x-45,27],[x+45,27],[x,-76]);c.fillStyle=d;c.beginPath();c.moveTo(x-45,27);c.quadraticCurveTo(x,79,x+45,27);c.fill()}c.restore();break}
 case'dominochain':{for(let k=0;k<5;k++){c.save();c.translate(-145+k*72,43);c.rotate(act&&q>k*.17?Math.min(1,(q-k*.17)*6)*.87:0);c.fillStyle=k%2?d:b;rr(c,-20,-80,40,102,6);c.fill();c.strokeStyle=a;c.lineWidth=3;c.stroke();circ(c,0,-48,5,P.paper);c.restore()}break}
 case'lightbulb':{c.strokeStyle=a;c.lineWidth=7;c.beginPath();c.arc(0,-40,84,Math.PI*.15,Math.PI*.85);c.bezierCurveTo(-114,-7,-26,46,-30,62);c.lineTo(30,62);c.bezierCurveTo(26,46,114,-7,80,-91);c.stroke();c.fillStyle=d;rr(c,-35,67,70,29,7);c.fill();line(c,a,6,[-26,109],[26,109]);if(act&&q>.25){c.save();c.globalAlpha*=q;for(let k=0;k<7;k++){const t=k*2*Math.PI/7;line(c,b,4,[Math.cos(t)*113,Math.sin(t)*113-43],[Math.cos(t)*137,Math.sin(t)*137-43])}c.restore()}break}
 case'bookstack':{for(let k=0;k<4;k++){const y=109-k*60;if(act&&q<k*.25)continue;c.save();c.translate(0,act&&q<k*.25+.2?(1-q)*-25:0);c.fillStyle=k%2?d:b;rr(c,-137+(k%2)*9,y-42,275,48,6);c.fill();c.strokeStyle=a;c.lineWidth=4;c.stroke();line(c,a,3,[95,y-40],[95,y+3]);c.restore()}break}
 case'graduationcap':{c.save();c.translate(0,act?-37*q:0);c.fillStyle=a;c.beginPath();c.moveTo(0,-112);c.lineTo(156,-46);c.lineTo(0,17);c.lineTo(-156,-46);c.closePath();c.fill();c.fillStyle=d;rr(c,-78,15,156,63,8);c.fill();line(c,b,5,[142,-42],[142,83]);circ(c,142,93,13,b);c.restore();break}
 case'calendar':{c.fillStyle=P.paper;rr(c,-141,-115,282,239,15);c.fill();c.strokeStyle=a;c.lineWidth=6;c.stroke();c.fillStyle=b;c.fillRect(-139,-113,278,45);for(const x of [-76,76])line(c,a,6,[x,-133],[x,-86]);for(let k=0;k<12;k++){const x=-95+(k%4)*63,y=-38+Math.floor(k/4)*52;c.strokeStyle=a;c.lineWidth=2;c.strokeRect(x-15,y-16,36,32)}if(act&&q>.25){line(c,b,6,[-100,-32],[-87,-18],[-62,-51])}if(planData.count&&progress(o,planData.countAt)>.25){label(c,planData.count,0,39,120,50,a)}break}
 case'clock':{c.strokeStyle=a;c.lineWidth=7;c.beginPath();c.arc(0,0,128,0,7);c.stroke();for(let k=0;k<12;k++){const th=k*Math.PI/6;const x=Math.sin(th),y=-Math.cos(th);line(c,a,3,[x*105,y*105],[x*117,y*117])}if(planData.hour&&progress(o,planData.hourAt)>.25){const mh=planData.hour.match(/[\d०-९]{1,2}/u)?.[0]||'0';const h=Number(mh.replace(/[०-९]/gu,x=>String('०१२३४५६७८९'.indexOf(x)))),theta=(h%12)*Math.PI/6-Math.PI/2;line(c,b,7,[0,0],[Math.cos(theta)*75,Math.sin(theta)*75])}else{circ(c,0,0,9,b);if(act&&q>.02)line(c,b,5,[0,0],[Math.sin(q*.7)*81,-Math.cos(q*.7)*81])}break}
 }
}
for(const [id,names] of SPECS)reg({id,job:'literal '+id+' visual metaphor',accepts:names,draw:(c,P,q,act,p,o)=>glyph(c,id,P,q,act,p,o)});
function render(c,p,o){if(!p||!REGISTRY[p.id])return false;const P=palette(o),R=coords(o),q=progress(o,p.at),a=p.action?progress(o,p.actionAt>=0?p.actionAt:p.at):0;c.save();if(o.skin==='story')backdrop(c,o,P);c.fillStyle=P.paper;rr(c,64,R.top+16,592,R.bottom-R.top-40,18);c.fill();c.strokeStyle=P.primary;c.lineWidth=2;c.stroke();c.fillStyle=P.primary;c.fillRect(87,R.top+37,64,5);c.save();c.translate(360,R.cy-32+Math.sin((Number(o.t)||0)*.7)*2);c.globalAlpha=q;REGISTRY[p.id].draw(c,P,a,p.action,p,o);c.restore();c.save();c.globalAlpha=q;label(c,p.term,360,R.bottom-69,472,38,P.ink);c.restore();c.restore();return true}
function paintGlyph(c,p,o,x,y,scale=.68){if(!p||!REGISTRY[p.id])return false;const q=progress(o,p.at),act=p.action?progress(o,p.actionAt>=0?p.actionAt:p.at):0;c.save();c.translate(x,y);c.scale(scale,scale);c.globalAlpha*=q;REGISTRY[p.id].draw(c,palette(o),act,p.action,p,o);c.restore();return true}
for(const id of IDS){const key='prop-'+id;if(root.ExplainerStyle?.components[key])throw Error('Duplicate prop in component registry');const component=(c,o)=>render(c,o.propPlan||plan(o.text),{skin:'explainer',night:o.theme==='night',t:o.t,start:o.start,end:o.end,words:o.graphWords||[],calm:o.motion==='calm'});component.job=REGISTRY[id].job;component.accepts=REGISTRY[id].accepts;component.duration='scene';root.ExplainerStyle.components[key]=component}
root.MetaphorProps={plan,render,paintGlyph,register:reg,registry:REGISTRY,ids:IDS};
})(window);
