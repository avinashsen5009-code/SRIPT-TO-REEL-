/* Grounded visual grammar. No network, generated facts, or inferred statistics.
   Draws only explicitly spoken two-part relationships with identifiable library objects.
   Unknown/ambiguous lines return a review suggestion rather than a false illustration. */
(function(root){'use strict';
 const stop=new Set('a an the this that is are was were you your we it i he she they what why how who where to from of in on with at for and but then because so first next after before instead use make get do can will when if by into one two three यह ये वह वो क्या कैसे है हैं था थी थे में को का की के एक और से पर तो जब तब आप हम फिर लेकिन क्योंकि पहले बाद'.split(' '));
 const token=s=>String(s||'').normalize('NFC').toLowerCase().match(/[\p{L}\p{N}₹]+/gu)||[];
 const candidates=(text,lookup)=>{const ws=token(text),seen=new Set(),hits=[];for(let j=0;j<ws.length;j++){
   if(stop.has(ws[j])||ws[j].length<2)continue;const id=lookup(ws[j]);if(id>=0&&!seen.has(id)){hits.push({id,word:ws[j],wordIndex:j});seen.add(id)}
  }return hits};
 const connectors=[
  {kind:'contrast',re:/\b(?:instead of|rather than|better than|less than|more than|versus|vs\.?|but|whereas)\b|इसके बजाय|की जगह|लेकिन|जबकि|बनाम/iu},
  {kind:'sequence',re:/\b(?:and then|then|next|before|after)\b|फिर|उसके बाद|पहले.{0,30}फिर/iu},
  {kind:'cause',re:/\b(?:because|therefore|so that|leads to|causes)\b|क्योंकि|इसलिए|कारण/iu}
 ];
 function compile(text,lookup){
  const key=String(text||'');
  let found=null;for(const c of connectors){const m=c.re.exec(key);if(m&&(!found||m.index<found.index))found={kind:c.kind,index:m.index,term:m[0],end:m.index+m[0].length}}
  let graph;
  if(!found)graph={supported:false,reason:'No explicit two-part relationship detected. Keep the existing scene treatment.'};
  else{
   let a=key.slice(0,found.index).replace(/^[\s,.:;!?।]+|[\s,.:;!?।]+$/g,''),b=key.slice(found.end).replace(/^[\s,.:;!?।]+|[\s,.:;!?।]+$/g,'');
   if((found.kind==='cause'&&/^(because|क्योंकि)$/iu.test(found.term))||(found.kind==='sequence'&&/^after$/iu.test(found.term)))[a,b]=[b,a];
   const left=candidates(a,lookup),right=candidates(b,lookup),li=left[0],ri=right.find(v=>v.id!==li?.id)||right[0];
   const allWords=key.slice(0,found.end).trim().split(/\s+/).filter(Boolean);
   graph=li&&ri&&li.id!==ri.id?{supported:true,kind:found.kind,connector:found.term,at:Math.max(0,allWords.length-1),
    left:{text:a,icon:li.id,word:li.word},right:{text:b,icon:ri.id,word:ri.word},
    source:key,confidence:'explicit words + two recognized objects'}:
    {supported:false,kind:found.kind,reason:'The relationship is spoken, but two concrete subjects were not recognized. Review this scene or provide a reference image.'};
  }
  return graph;
 }
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
 function render(c,g,opt){
  if(!g?.supported)return false;
  const style=opt.style||'classic',paper=style==='story',struct=style==='structural',sketch=style==='sketch',trend=style==='trend',classic=style==='classic';
  const bg=paper?'#F4EFE4':struct?'#111111':opt.bg||'#101B28',ink=paper?'#1B2B2D':'#F7F4FF';
  const accent=paper?'#D4622B':struct?'#CBC6D0':opt.accent||'#FFB347';
  const second=paper?'#0F3D3F':struct?'#F7F4FF':opt.second||accent;
  c.save();c.fillStyle=bg;c.fillRect(0,0,720,1280);
  if(paper){c.fillStyle='rgba(27,43,45,.08)';for(let y=100;y<680;y+=42)c.fillRect(45,y,630,1)}
  if(struct){c.strokeStyle='rgba(247,244,255,.05)';c.lineWidth=1;c.beginPath();for(let x=0;x<=720;x+=40){c.moveTo(x,0);c.lineTo(x,690)}for(let y=0;y<690;y+=40){c.moveTo(0,y);c.lineTo(720,y)}c.stroke()}
  const left={x:48,y:166,w:282,h:456},right={x:390,y:166,w:282,h:456};
  const reveal=smooth((opt.time-opt.revealAt)/Math.max(.25,opt.calm?.68:.38));
  function card(pos,item,color,alpha){
   c.save();c.globalAlpha=alpha;
   c.fillStyle=paper?'#FBF8F0':struct?'#111111':trend?'#161826':sketch?'#182331':'rgba(11,25,39,.9)';
   c.strokeStyle=color;c.lineWidth=sketch?4:struct?1.5:3;
   c.beginPath();c.rect(pos.x,pos.y,pos.w,pos.h);c.fill();c.stroke();
   if(paper){c.fillStyle=color;c.fillRect(pos.x,pos.y,10,pos.h)}
   if(trend){c.fillStyle=color;c.fillRect(pos.x,pos.y,pos.w,14);c.fillRect(pos.x+pos.w-25,pos.y+pos.h-25,25,25)}
   if(classic){c.strokeStyle='rgba(247,244,255,.27)';c.lineWidth=1;c.strokeRect(pos.x+9,pos.y+9,pos.w-18,pos.h-18)}
   if(sketch){c.strokeStyle='rgba(247,244,255,.35)';c.lineWidth=1;c.beginPath();c.moveTo(pos.x+5,pos.y-5);c.lineTo(pos.x+pos.w+3,pos.y+7);c.moveTo(pos.x+pos.w-4,pos.y+pos.h+7);c.lineTo(pos.x-3,pos.y+pos.h-2);c.stroke()}
   const img=opt.getIcon(item.icon);if(img?.im){const ar=img.ar||1,w=ar>1?150:150*ar,h=ar>1?150/ar:150;
    if(struct)c.filter='grayscale(1) contrast(1.2)';c.drawImage(img.im,pos.x+pos.w/2-w/2,pos.y+55+(150-h)/2,w,h);if(struct)c.filter='none'}
   else{c.strokeStyle=color;c.lineWidth=4;c.strokeRect(pos.x+64,pos.y+65,pos.w-128,137)}
   const txt=item.word.toLocaleUpperCase(),font=(paper?'700 34px Lora,Georgia,serif':struct?'600 32px Georgia,serif':'700 36px Hind,sans-serif');
   c.font=font;c.fillStyle=ink;c.textAlign='center';c.textBaseline='middle';
   let label=txt;while(c.measureText(label).width>pos.w-30&&label.length>1)label=label.slice(0,-1);c.fillText(label,pos.x+pos.w/2,pos.y+296);
   c.fillStyle=color;c.fillRect(pos.x+45,pos.y+342,pos.w-90,3);c.restore()
  }
  card(left,g.left,accent,1);card(right,g.right,second,Math.max(.08,reveal));
  c.strokeStyle=second;c.fillStyle=second;c.lineWidth=struct?2:5;c.lineCap='round';
  if(g.kind==='contrast'){
   c.font='700 32px Hind,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('VS',360,385)
  }else{
   const x=342+reveal*35,y=390;c.beginPath();c.moveTo(338,y);c.lineTo(x,y);c.stroke();
   if(reveal>.7){c.beginPath();c.moveTo(371,y-10);c.lineTo(380,y);c.lineTo(371,y+10);c.stroke()}
  }
  /* The cue is a relationship diagram, not a substitute for the existing editable captions. */
  c.restore();return true;
 }
 root.VisualGrammar={compile,render};
})(window);
