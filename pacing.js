/* Local, source-preserving pacing. A scene boundary is chosen from speech timing
   or punctuation; it never changes the recording or invents transcript words. */
(function(root){'use strict';
 const tok=s=>String(s||'').trim().split(/\s+/u).filter(Boolean);
 const terminal=w=>/[।?!]|(?<!\d)\.(?!\d)/u.test(w.slice(-1));
 const clause=w=>/[,;:،]$/u.test(w);
 function script(text){
  const paragraphs=String(text||'').split(/\n+/u).map(s=>s.trim()).filter(Boolean),out=[];
  for(const p of paragraphs){let words=tok(p),start=0;
   while(start<words.length){const left=words.length-start;
    if(left<=17){out.push(words.slice(start).join(' '));break}
    const lo=start+8,hi=Math.min(words.length-5,start+17);
    let best=-1,score=-1e9;
    for(let k=lo;k<=hi;k++){
     const s=(terminal(words[k-1])?9:clause(words[k-1])?5:0)-Math.abs(k-(start+12))*.5;
     if(s>score){best=k;score=s}
    }
    if(best<=start)best=Math.min(words.length,start+12);
    out.push(words.slice(start,best).join(' '));start=best;
   }
  }
  return out;
 }
 function timed(words){
  const out=[];let start=0;
  while(start<words.length){let chosen=-1,score=-1e9;
   for(let end=start+1;end<=words.length;end++){
    const count=end-start,dur=(words[end-1].e||words[end-1].s+.25)-(words[start].s||0);
    if(count<5&&end<words.length&&dur<3.3)continue;
    const gap=end<words.length?Math.max(0,(words[end].s||0)-(words[end-1].e||0)):0;
    const shortTail=end<words.length&&words.length-end<4;
    const s=(terminal(words[end-1].w)?6:clause(words[end-1].w)?3:0)
     +Math.min(gap,.8)*4-Math.abs(dur-3.25)*1.1-Math.abs(count-10)*.25
     +(end===words.length?3:0)-(shortTail?5:0);
    if(s>score){score=s;chosen=end}
    if((dur>5.4||count>=17)&&end<words.length)break;
   }
   if(chosen<=start)chosen=Math.min(words.length,start+1);
   out.push(words.slice(start,chosen));start=chosen;
  }
  // Attach stray very short final fragments without dropping their timestamps.
  if(out.length>1&&out.at(-1).length<3)out[out.length-2].push(...out.pop());
  return out;
 }
 root.ReelPacing={script,timed};
})(window);
