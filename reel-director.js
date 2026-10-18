/* Local, deterministic audio-transcript scene direction. No remote visual services. */
(function(root){
 'use strict';
 const stop=new Set('a an the is are was were to of in on for with and or but it this that you your i we they he she what why how do does can will if then so by from at as be have has had into its one two three our their just more less बहुत यह है हैं और के की का को में से पर एक आप हम वो ये क्या कैसे लिए तो भी था थी नहीं अब लेकिन'.split(/\s+/));
 const concrete=new Set('book phone money clock habit target brain bulb people heart walk sleep gear shield cart camera mail growth rocket lock eye house home car food dog cat plant computer laptop doctor medicine travel study rain water cricket sport tea coffee road'.split(' '));
 const tangible=new Set('book phone money clock cart camera mail house home car food dog cat plant computer laptop doctor medicine tea coffee road'.split(' '));
 const normalize=s=>String(s||'').normalize('NFC').toLocaleLowerCase();
 const tokens=s=>normalize(s).match(/[\p{L}\p{N}₹]+/gu)||[];
 const subject=(scenes,concepts)=>{
  const texts=scenes.map(normalize),counts=new Map();
  (concepts||[]).forEach(([id,keys],priority)=>{
   // Do not claim a subject on weak connector words such as "today", "what", or "people".
   if(!concrete.has(id))return;
   let hits=0,label='';
   texts.forEach(t=>{const ws=tokens(t);for(const term of keys){const key=normalize(term);if(key.length<3&&key!=='₹')continue;const match=ws.find(w=>w===key||(key.length>=4&&w.startsWith(key)));if(match){hits++;label=label||match;break}}});
   if(hits)counts.set(id,{id,label,hits,score:hits*3+(tangible.has(id)?5:0)+(priority<12?1:0)});
  });
  return [...counts.values()].sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id))[0]||null;
 };
 const analyse=(scenes,concepts)=>{
  const focus=subject(scenes,concepts),series=scenes.map((text,i)=>{
   const words=tokens(text).filter(w=>w.length>2&&!stop.has(w));
   const anchors=words.filter(w=>!focus||w!==focus.label).slice(0,3);
   const uncertainty=!focus||(!tokens(text).includes(focus.label)&&!words.length);
   return {i,subject:focus?.id||null,spokenSubject:focus?.label||null,anchors,uncertain:uncertainty,
    review:uncertainty?'Subject unclear here: check the transcript or choose a scene treatment.':'Scene subject is inferred from the spoken words; review the depiction.'};
  });
  return {focus,scenes:series,source:'spoken transcript only; interpretation is editable'};
 };
 root.ReelDirector={analyse};
})(window);
