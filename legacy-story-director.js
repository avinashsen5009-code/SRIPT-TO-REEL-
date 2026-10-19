/* Adapted from the supplied story-director.js for the current Reel Studio.
   Pure planning: does not overwrite the editor's UI, captions, or saved state. */
(function(root){'use strict';
const STOP=new Set('है हैं था थी थे का की के को में से पर और कि तो भी ही यह ये वह वो एक जो क्या अब जब तब the a an and or of to in on at for with is are was were it its this that be been as by from hai hain tha thi ka ki ke ko mein se par aur ne nahi nhi toh bhi hi yeh woh ek kya tab jab ab tak तक till'.split(' '));
const cl=w=>String(w).normalize('NFC').toLowerCase().replace(/^[^\p{L}\p{N}₹$]+|[^\p{L}\p{N}%]+$/gu,'');
const CON=/^(लेकिन|मगर|परंतु|जबकि|but|however|while|vs|versus|lekin|magar|jabki)$/i,SEQ=/^(फिर|then|next|phir|अगला)$/i,AND=/^(और|and|aur|तथा|&)$/i,CUR=/^(रुपये|रुपए|rupees|rupaye|rs|₹|inr)$/i;
const ROLE={hook:'Hook',takeaway:'Takeaway',problem:'Problem',example:'Example',body:'Point'};
function plan(i,n){
  const tk=sents[i].split(/\s+/).filter(Boolean),L=tk.length,cs=tk.map(cl);
  const pw=(a,b)=>tk.slice(a,b).map(w=>w.replace(/[,.;:!?।—"“”]+$/g,'')).join(' ');
  let ka=0,sc=-1;cs.forEach((c,k)=>{if(!c||STOP.has(c))return;const s=(/\d/.test(c)?9:0)+(libHit(tk[k])>=0?6:0)+Math.min(c.length,9)/2;if(s>sc){sc=s;ka=k}});
  let kb=ka;if(ka+1<L&&cs[ka+1]&&!STOP.has(cs[ka+1])&&!CON.test(cs[ka+1])&&!/\d/.test(cs[ka+1]))kb=ka+1;
  const key={a:ka,b:kb,text:pw(ka,kb+1)},hasCon=cs.findIndex((c,k)=>k>0&&k<L-1&&CON.test(c));
  const role=i===0?'hook':i===n-1&&n>2?'takeaway':hasCon>0?'problem':/^(jaise|example|उदाहरण)$/.test(cs[0]||'')?'example':'body';
  const d={},nums=[];
  cs.forEach((c,k)=>{const m=c.replace(/,/g,'').replace(/^[₹$]/,'').match(/^(\d+(?:\.\d+)?)(%?)$/);if(m&&!/^(19|20)\d\d$/.test(c.replace(/,/g,'')))nums.push({k,v:parseFloat(m[1]),dec:(m[1].split('.')[1]||'').length,pct:!!m[2]})});
  const nx=nums.map(o=>{const nt=cs[o.k+1]||'',cur=/^₹/.test(cs[o.k])||CUR.test(nt)?'₹':/^\$/.test(cs[o.k])?'$':'';
    const lab=(cur?'':nt&&!STOP.has(nt)?nt:'')||(cs[o.k-1]&&!STOP.has(cs[o.k-1])?cs[o.k-1]:'');
    return{v:o.v,k:o.k,dec:o.dec,cur,unit:o.pct||/^(percent|प्रतिशत|%)$/.test(nt)?'%':'',label:lab}});
  const years=cs.map((c,k)=>/^(19|20)\d\d$/.test(c)?k:-1).filter(k=>k>=0);
  const split=re=>{const s=[0];tk.forEach((w,k)=>{if(k>0&&(/[,;]$/.test(tk[k-1])||re.test(cs[k-1])))s.push(k)});return s.filter((v,j,a)=>a.indexOf(v)===j)};
  const segs=re=>{const s=split(re);return s.map((a,j)=>{let b=j+1<s.length?s[j+1]:L;return{w:a,label:pw(a,Math.min(b,a+3)).replace(/^(और|and|aur|फिर|then)\s+/i,'')}})};
  if(nx.length>=2&&/(\b(?:vs|versus|compared|comparison|from|to)\b|बनाम|तुलना|से.{0,20}तक)/i.test(sents[i]))d.values=nx.map(o=>({w:o.k,v:o.v,txt:(o.cur||'')+o.v.toLocaleString('en-IN')+(o.unit==='%'?'%':''),label:o.label||''}));
  if(nx.length)d.number=nx[0];
  if(years.length>=2)d.seq=years.map(k=>({w:k,label:pw(k,k+1)}));
  if(hasCon>0)d.sides={a:pw(Math.max(0,hasCon-5),hasCon),b:pw(hasCon+1,Math.min(L,hasCon+7)),wa:0,wb:hasCon+1};
  const it=segs(AND);if(it.length>=3)d.items=it.slice(0,5);
  const st=segs(SEQ);if(st.length>=2&&cs.some((c,k)=>SEQ.test(c)&&!/^(bhi|भी)$/.test(cs[k+1]||'')))d.steps=st.slice(0,5);
  const treat=d.values?'chart':d.seq?'timeline':d.sides?'compare':d.items?'list':d.steps?'flow':d.number?'counter':(role==='hook'&&L<=9)||role==='takeaway'?'kinetic':i%3===0?'depth':'figure';
  return{key,role,roleName:ROLE[role],flip:i%2,comp:i,tr:2,data:d,eff:{treat,layers:{type:true,deco:true,graphic:true,char:true,depth:true}}};
}

root.LegacyStoryDirector={plan};
})(window);
