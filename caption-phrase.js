/* Caption phrases are verbatim editable cue words; never replace narration by a keyword.
   Word positions and hit rectangles share the same layout for preview and export. */
(function(root){'use strict';
 function draw(c,{cue,time,config,hits,style='explainer',accent='#1F4FE0',night=false,y}){
  hits.length=0;if(!config?.on||!cue?.words?.length||time<cue.words[0].s-.01)return;
  const structural=style==='structural',ws=cue.words,baseY=y??config.y*1280;
  let size=(structural?56:59)*config.size/100;
  const maxW=structural?610:625,pad=structural?17:14;
  c.save();c.textBaseline='middle';c.textAlign='left';
  const family=structural?'Georgia,serif':'Hind,Arial,sans-serif';
  function layout(){
   c.font=(structural?'600 ':'800 ')+size+'px '+family;
   const widths=ws.map(o=>c.measureText(o.w).width),gap=size*.24,lines=[];let line=[],span=0;
   widths.forEach((w,k)=>{if(line.length&&span+gap+w>maxW){lines.push(line);line=[];span=0}
    line.push(k);span+=(line.length>1?gap:0)+w});if(line.length)lines.push(line);
   return{widths,gap,lines};
  }
  let L=layout();while(size>31&&(L.lines.length>2||Math.max(...L.widths)>maxW)){size-=2;L=layout()}
  const tallest=Math.max(...L.lines.map(line=>line.reduce((a,k,j)=>a+L.widths[k]+(j?L.gap:0),0)),1);
  if(structural){c.fillStyle='rgba(17,17,17,.88)';c.fillRect(360-tallest/2-pad,baseY-L.lines.length*size*.65-pad,tallest+pad*2,L.lines.length*size*1.3+pad*2)}
  else{c.fillStyle=night?'rgba(11,18,48,.9)':'rgba(251,248,240,.94)';c.fillRect(360-tallest/2-pad,baseY-L.lines.length*size*.64-pad,tallest+pad*2,L.lines.length*size*1.28+pad*2)}
  L.lines.forEach((line,j)=>{const width=line.reduce((a,k,m)=>a+L.widths[k]+(m?L.gap:0),0),lineY=baseY+(j-(L.lines.length-1)/2)*size*1.2;let x=360-width/2;
   line.forEach(k=>{const w=L.widths[k],o=ws[k],current=time>=o.s&&(!ws[k+1]||time<ws[k+1].s),spoken=time>=o.s;
    c.fillStyle=current?accent:structural?'#F7F4FF':night?'#FFFFFF':'#101828';
    if(!spoken)c.globalAlpha=.62;else c.globalAlpha=1;
    c.fillText(o.w,x,lineY);
    if(current){c.fillRect(x,lineY+size*.55,w,Math.max(2,size*.065))}
    hits.push({si:cue.si,ci:cue.ci,k:cue.idx+k,x0:x-2,x1:x+w+2,y0:lineY-size*.55,y1:lineY+size*.55});x+=w+L.gap
   });
  });c.restore();
 }
 root.CaptionPhrase={draw};
})(window);
