/* Purpose-built, source-grounded visual layouts for Classic and Trending.
   These render only automatic scenes; manual treatments/media/pins use original tools. */
(function(root){'use strict';
 const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)};
 function source(words,t,lookup){
  const seen=new Set(),out=[];
  for(const w of words||[]){if(w.s>t+.02)break;
   const raw=String(w.w||'').match(/[\p{L}\p{N}₹$]+/u)?.[0]||'',id=raw?lookup(raw):-1;
   if(id>=0&&!seen.has(id)){seen.add(id);out.push({id,word:raw,at:w.s})}}
  return out.slice(0,3);
 }
 function image(c,art,x,y,size,alpha=1){if(!art?.im)return false;const ar=art.ar||1,w=ar>1?size:size*ar,h=ar>1?size/ar:size;c.save();c.globalAlpha=alpha;c.drawImage(art.im,x-w/2,y-h/2,w,h);c.restore();return true}
 function title(c,value,x,y,w,size,color,align='center'){
  c.fillStyle=color;c.font='700 '+size+'px Hind,Arial,sans-serif';c.textAlign=align;c.textBaseline='middle';
  let v=String(value||'');while(v.length>1&&c.measureText(v).width>w)v=v.slice(0,-1);c.fillText(v,x,y,w)
 }
 function classic(c,{i,t,a,b,words,lookup,getIcon,accent,calm}){
  const known=source(words,t,lookup),first=known[0],next=known[1],art=first&&getIcon(first.id);
  if(!art?.im)return false;
  const q=ease((t-first.at)/(calm?.65:.32)),r=next?ease((t-next.at)/(calm?.65:.3)):0;
  const x=next?245:360,second=next&&getIcon(next.id);
  c.save();c.fillStyle='#111B24';c.fillRect(20,110,680,552);
  c.fillStyle='rgba(255,255,255,.035)';c.fillRect(49,145,622,449);
  c.strokeStyle='rgba(231,238,239,.3)';c.lineWidth=1.5;c.strokeRect(49.5,145.5,621,448);
  c.strokeStyle=accent;c.lineWidth=3;c.beginPath();c.moveTo(49,145);c.lineTo(49+Math.min(112,622*q),145);c.stroke();
  // Balanced editorial framing; no dummy progress bar or fake icon placeholder.
  c.save();c.translate(x,356+(1-q)*22);c.globalAlpha=q;
  c.fillStyle='rgba(238,243,239,.055)';c.beginPath();c.arc(0,0,next?153:186,0,7);c.fill();
  image(c,art,0,-8,next?205:260);c.restore();
  title(c,first.word,x,548,next?275:500,36,'#F7F4FF');
  if(next&&second?.im&&r>.01){c.save();c.globalAlpha=r;c.strokeStyle='rgba(247,244,255,.36)';c.beginPath();c.moveTo(418,249);c.lineTo(418,514);c.stroke();
   c.fillStyle='rgba(247,244,255,.08)';c.fillRect(444,247,194,221);image(c,second,541,348,138);
   title(c,next.word,541,548,177,31,'#F7F4FF');c.restore()}
  c.restore();return true;
 }
 function trend(c,{i,t,a,b,words,lookup,getIcon,accent,calm}){
  const known=source(words,t,lookup),first=known[0],next=known[1],art=first&&getIcon(first.id);
  if(!art?.im)return false;
  const q=ease((t-first.at)/(calm?.6:.24)),r=next?ease((t-next.at)/(calm?.6:.24)):0,flip=i%2?1:-1;
  c.save();c.fillStyle='#0D1020';c.fillRect(20,110,680,552);
  c.fillStyle='rgba(255,255,255,.035)';c.fillRect(36,169,648,421);
  c.save();c.translate(360+flip*46,350+(1-q)*30);c.globalAlpha=q;c.rotate(flip*.025*(1-q));
  c.fillStyle=accent;c.fillRect(-180,-154,350,308);c.fillStyle='#11192B';c.fillRect(-169,-144,328,286);
  image(c,art,-3,-10,250);c.restore();
  // Single purposeful keyword; spoken sentence remains in caption layer.
  c.fillStyle='#F7F4FF';c.fillRect(flip<0?82:394,530,244,5);
  title(c,first.word,flip<0?82:638,588,320,48,'#F7F4FF',flip<0?'left':'right');
  if(next&&r>.01&&getIcon(next.id)?.im){c.save();c.globalAlpha=r;c.fillStyle='#F7F4FF';c.fillRect(flip<0?488:55,167,164,163);
   image(c,getIcon(next.id),flip<0?570:137,240,112);
   title(c,next.word,flip<0?570:137,365,164,26,accent);c.restore()}
  c.restore();return true;
 }
 function render(c,opts){if(typeof opts.lookup!=='function'||typeof opts.getIcon!=='function')return false;
  return opts.style==='classic'?classic(c,opts):opts.style==='trend'?trend(c,opts):false}
 root.EditorialVisuals={render,source};
})(window);
