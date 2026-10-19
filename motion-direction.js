/* Reel-wide visual rhythm: deterministic, local and source-grounded.
   Does not alter audio, scene boundaries, captions, manual treatments or user media. */
(function(root){'use strict';
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const PERIOD=2.5,CHAPTER=15;
const WORD=/[\p{L}\p{N}₹]+/u;
const skin=s=>s==='story'?'story':s==='structural'?'structural':s==='explainer'?'explainer':s==='sketch'?'sketch':s==='trend'?'trend':'cinematic';
function focus(words,t,a,b,lookup){
 const k=Math.floor(Math.max(0,t)/PERIOD),low=Math.max(a,k*PERIOD),high=Math.min(b,(k+1)*PERIOD),all=words||[];
 const subjects=all.map(w=>({word:String(w.w||'').match(WORD)?.[0]||'',s:Number(w.s)}))
   .filter(w=>w.word&&Number.isFinite(w.s)&&w.s>=a-.02&&w.s<=b+.02)
   .map(w=>({...w,id:lookup(w.word)})).filter(w=>Number.isInteger(w.id)&&w.id>=0);
 const earlier=subjects.filter(w=>w.s<low-.02).map(w=>w.id);
 // No pseudo-illustration or duplicated subject: cut-ins require a NEW spoken object.
 return earlier.length?subjects.find(w=>w.s>=low-.02&&w.s<high-.01&&!earlier.includes(w.id))||null:null;
}
function state({time,start,end,words,lookup,style='cinematic',calm=false}){
 const t=Math.max(0,Number(time)||0),index=Math.floor(t/PERIOD),phase=clamp((t-index*PERIOD)/PERIOD),kind=skin(style);
 const item=typeof lookup==='function'?focus(words,t,start,end,lookup):null;
 const chapter=Math.round(t/CHAPTER),mark=chapter*CHAPTER,transition=chapter>0&&mark<(end??Infinity)+.001&&Math.abs(t-mark)<.25
  ?smooth((t-(mark-.25))/.5):null;
 return{index,phase,kind,calm,subject:item,transition,chapter:chapter>0?chapter:0,mark};
}
/* Changes composition rather than changing the spoken idea. Eases into each beat
   without shaking, and keeps an extra 12px margin outside caption bounds. */
function reframe(c,s){
 const strength=s.calm?.56:1,drift=s.kind==='structural'?13:s.kind==='story'?18:s.kind==='explainer'?21:24;
 const pose=n=>n<0?{x:0,y:0,zoom:1}:{
  x:(n%2?1:-1)*drift*strength,y:(n%3===2?-8:5)*strength,
  zoom:1+(n%2?1:-1)*(s.kind==='structural'?.013:.022)*strength};
 const prev=pose(s.index-1),next=pose(s.index),q=smooth(Math.min(1,s.phase*PERIOD/(s.calm?.72:.42)));
 const x=prev.x+(next.x-prev.x)*q,y=prev.y+(next.y-prev.y)*q,zoom=prev.zoom+(next.zoom-prev.zoom)*q;
 c.translate(360+x,358+y);c.scale(zoom,zoom);c.translate(-360,-358);
}
function callout(c,s,getIcon){
 if(!s.subject||typeof getIcon!=='function')return false;
 const age=s.phase*PERIOD,show=smooth(age/.3)*(1-smooth((age-1.85)/.4));if(show<=.001)return false;
 const paper=s.kind==='story',plain=s.kind==='structural',editorial=s.kind==='explainer';
 const x=s.index%2?92:468,y=paper?132:plain?139:142,w=160,h=178;
 const art=getIcon(s.subject.id);
 c.save();c.globalAlpha=show;c.translate(x+w/2,y+h/2+(1-show)*18);c.rotate(paper?(s.index%2?.013:-.014):0);c.translate(-w/2,-h/2);
 if(paper){c.fillStyle='#FCFAF5';c.shadowColor='rgba(32,49,52,.18)';c.shadowBlur=12;c.shadowOffsetY=6;c.fillRect(0,0,w,h);c.shadowColor='transparent';c.fillStyle='#B86D48';c.fillRect(0,0,6,h)}
 else if(plain){c.fillStyle='#111111';c.fillRect(0,0,w,h);c.strokeStyle='rgba(247,244,255,.7)';c.lineWidth=1.4;c.strokeRect(.5,.5,w-1,h-1)}
 else{c.fillStyle=editorial?'#F3EEE3':'#101B28';c.fillRect(0,0,w,h);c.strokeStyle=editorial?'#1F4FE0':s.kind==='trend'?'#FFB347':'#5ED3F3';c.lineWidth=editorial?3:2;c.strokeRect(1,1,w-2,h-2)}
 if(art?.im){const ar=art.ar||1,sz=104,iw=ar>=1?sz:sz*ar,ih=ar>=1?sz/ar:sz;
  c.drawImage(art.im,(w-iw)/2,14+(110-ih)/2,iw,ih)}
 else{ // A restrained source-word glyph, never a made-up picture.
  c.strokeStyle=paper?'#174648':plain?'#F7F4FF':'#5ED3F3';c.lineWidth=3;c.beginPath();c.moveTo(35,98);c.lineTo(125,98);c.moveTo(35,77);c.lineTo(125,77);c.stroke()}
 c.fillStyle=paper?'#203134':plain?'#F7F4FF':editorial?'#101828':'#F7F4FF';
 c.font=(paper?'700 ':'600 ')+'22px '+(paper?'Lora,Georgia,serif':'Hind,Arial,sans-serif');c.textAlign='center';c.textBaseline='middle';
 const word=s.subject.word;let label=word;while(label.length>1&&c.measureText(label).width>w-20)label=label.slice(0,-1);
 c.fillText(label,w/2,147,w-18);c.restore();return true
}
/* The wipe touches the visual zone only. Audio, captions, safe-zone and
   user media remain their own layers; no strobe or progress strip. */
function transition(c,s){if(s.transition==null)return false;
 const p=s.transition,w=720,h=674,first=p<=.5,u=first?p*2:(p-.5)*2;
 const color=s.kind==='story'?'#F4EFE4':s.kind==='structural'?'#111111':s.kind==='explainer'?'#F3EEE3':'#101B28';
 const accent=s.kind==='story'?'#B86D48':s.kind==='structural'?'#F7F4FF':s.kind==='explainer'?'#1F4FE0':'#5ED3F3';
 const width=w*smooth(u),x=first?0:width;
 c.save();c.beginPath();c.rect(0,0,w,h);c.clip();c.fillStyle=color;c.globalAlpha=.87;c.fillRect(x,0,first?width:w-width,h);
 c.fillStyle=accent;c.globalAlpha=s.kind==='structural'?.65:.86;
 const edge=first?width:width;c.fillRect(Math.max(0,edge-3),0,3,h);c.restore();return true
}
root.ReelMotion={PERIOD,CHAPTER,state,reframe,callout,transition};
})(window);
