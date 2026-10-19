/* Illustrated cards: adapted from the user-supplied Story style for this editor. */
(()=>{
'use strict';
if(window.StoryStyle)return;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),lerp=(a,b,u)=>a+(b-a)*u,sm=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
const soft=x=>{x=clamp(x,0,1);const c1=.9;return 1+(c1+1)*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const C0={cream:'#F4EFE4',cream2:'#E9E1CF',paper:'#FBF8F0',ink:'#1B2B2D',teal:'#0F3D3F',teal2:'#1B6064',orange:'#D4622B',mustard:'#DBA944',wall:'#DCC8B2',wall2:'#C4A98F',desk:'#4B3024',desk2:'#2F1D15',skin:'#BD7F52',skin2:'#9A6139',hair:'#17110E',shirt:'#12494C'};
const SERIF='Lora,Georgia,"Noto Serif","Noto Serif Devanagari","Hind",serif',SANS='Hind,"Noto Sans Devanagari","Segoe UI",Arial,sans-serif';
const isStory=()=>UI.sty==='story';
const up=s=>String(s).toUpperCase();
const sceneToks=i=>sents[i].split(/\s+/).filter(Boolean);
const STOP=new Set('है हैं था थी थे का की के को में से पर और कि तो भी ही यह ये वह वो एक the a an and or of to in on at for with is are was were it its this that'.split(' '));

/* ---- paper texture (cached) ---- */
let PAPER=null;
function paperTex(){
  if(PAPER)return PAPER;const k=document.createElement('canvas');k.width=k.height=360;const g=k.getContext('2d');let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  for(let n=0;n<140;n++){const x=r()*360,y=r()*360,rad=18+r()*60,gr=g.createRadialGradient(x,y,0,x,y,rad);const dark=r()<.5;gr.addColorStop(0,dark?'rgba(120,100,60,.05)':'rgba(255,255,255,.12)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-rad,y-rad,rad*2,rad*2)}
  return PAPER=k;
}
function paperBg(c,col,dark){
  c.fillStyle=col||C0.cream;c.fillRect(-60,-60,W+120,H+120);
  c.save();c.globalAlpha=dark?.12:.14;const p=c.createPattern(paperTex(),'repeat');c.fillStyle=p;c.fillRect(-60,-60,W+120,H+120);c.restore();
}

/* ---- timing ---- */
const rt=(i,w,f)=>{const ws=wordsT(i),[a,b]=bounds(i);return ws[w]?ws[w].s-a:(b-a)*(f||0)};
const rv=(Z,w,f,d)=>{const pace=document.getElementById('motion')?.value==='calm'?2.15:.68;return clamp((Z.lt-rt(Z.i,w,f))/((d||.4)*pace),0,1)};

/* ---- text ---- */
function fit(c,txt,maxW,px,lines,font){
  let s=px,L=[];
  for(let it=0;it<10;it++){c.font=font(s);const ws=String(txt).split(/\s+/).filter(Boolean);L=[];let cur='';
    for(const w of ws){const t=cur?cur+' '+w:w;if(!cur||c.measureText(t).width<=maxW)cur=t;else{L.push(cur);cur=w}}if(cur)L.push(cur);
    if(L.length<=lines&&Math.max(0,...L.map(l=>c.measureText(l).width))<=maxW)return{L,s};s=Math.floor(s*.9);if(s<16)break}
  s=Math.max(16,s);c.font=font(s);L=L.slice(0,lines).map((l,k)=>{let q=l;while(q.length>2&&c.measureText(q).width>maxW)q=q.slice(0,-1);return q!==l&&k===lines-1?q+'…':q});return{L,s};
}
const heavy=s=>'800 '+s+'px '+SANS,serif=s=>'700 '+s+'px '+SERIF,reg=s=>'600 '+s+'px '+SANS;
function rr(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function shadowed(c,fn,dx,dy,a){c.save();c.shadowColor='rgba(40,24,10,'+(a==null?.28:a)+')';c.shadowBlur=22;c.shadowOffsetX=dx||0;c.shadowOffsetY=dy==null?10:dy;fn();c.restore()}
/* heavy uppercase label blocks that hug each line, like the orange/teal captions in the reference */
function blocks(c,txt,x,y,maxW,px,cols,fg,rot,al,k){
  const f=fit(c,up(txt),maxW,px,3,heavy),h=f.s*1.34;k=clamp(k==null?1:k,0,1);if(k<=0)return;
  c.save();c.translate(x,y);if(rot)c.rotate(rot);c.scale(.94+.06*k,.94+.06*k);c.globalAlpha=Math.min(1,k*1.6);c.font=heavy(f.s);c.textBaseline='middle';
  f.L.forEach((l,j)=>{const w=c.measureText(l).width+f.s*.9,bx=al==='c'?-w/2:0,by=j*(h+3)-(f.L.length*(h+3))/2;
    shadowed(c,()=>{c.fillStyle=cols[j%cols.length];c.fillRect(bx,by,w,h)},0,6,.25);c.fillStyle=Array.isArray(fg)?fg[j%fg.length]:fg;c.textAlign='left';c.fillText(l,bx+f.s*.45,by+h/2+2)});
  c.restore();
}
function sticky(c,txt,x,y,rot,k,w0){
  if(k<=0)return;const f=fit(c,up(txt),(w0||230)-40,40,3,heavy),w=w0||230,h=Math.max(120,f.L.length*f.s*1.15+56);
  c.save();c.translate(x,y);c.rotate(rot||0);c.scale(soft(k),soft(k));
  shadowed(c,()=>{c.fillStyle=C0.mustard;c.fillRect(-w/2,-h/2,w,h)},0,12,.32);
  c.fillStyle='rgba(255,255,255,.18)';c.fillRect(-w/2,-h/2,w,22);
  c.font=heavy(f.s);c.fillStyle=C0.ink;c.textAlign='center';c.textBaseline='middle';f.L.forEach((l,j)=>c.fillText(l,0,(j-(f.L.length-1)/2)*f.s*1.15+10));c.restore();
}
function kicker(c,txt,x,y,col,px){c.save();c.font='700 '+(px||22)+'px '+SANS;c.fillStyle=col||C0.mustard;c.textAlign='center';c.textBaseline='middle';if('letterSpacing' in c)c.letterSpacing='5px';c.fillText(up(txt),x,y);c.restore()}
function note(c,txt,x,y,w,rot,k){   /* white paper quote note */
  if(k<=0)return;const f=fit(c,txt,w-50,34,3,serif),h=f.L.length*f.s*1.3+44;
  c.save();c.translate(x,y);c.rotate(rot||0);c.scale(soft(k),soft(k));shadowed(c,()=>{c.fillStyle=C0.paper;c.fillRect(-w/2,-h/2,w,h)},0,10,.3);
  c.font=serif(f.s);c.fillStyle=C0.ink;c.textAlign='center';c.textBaseline='middle';f.L.forEach((l,j)=>c.fillText(l,0,(j-(f.L.length-1)/2)*f.s*1.3));c.restore();
}
function paper(c,x,y,w,h,bar,k,rot){
  if(k<=0)return;c.save();c.translate(x,y);if(rot)c.rotate(rot);c.scale(k,k);
  shadowed(c,()=>{c.fillStyle=C0.paper;c.fillRect(-w/2,-h/2,w,h)},0,12,.26);
  if(bar){c.fillStyle=bar;c.fillRect(-w/2,-h/2,13,h)}c.restore();
}
const icoQ=new Set();
function icon(txt){const ws=String(txt).split(/\s+/);for(const w of ws){const n=libHit(w);if(n>=0){if(!LC[n]&&!icoQ.has(n)){icoQ.add(n);libImg(n).then(()=>frame())}return LC[n]||null}}return null}
function drawIco(c,r,x,y,s){if(!r)return;const w=r.ar>=1?s:s*r.ar,h=r.ar>=1?s/r.ar:s;c.drawImage(r.im,x-w/2,y-h/2,w,h)}
/* little document thumbnail used when no library picture matches */
function thumb(c,x,y,s,col,seed){c.save();c.translate(x,y);c.fillStyle=col;rr(c,-s/2,-s/2,s,s,10);c.fill();c.fillStyle='rgba(255,255,255,.82)';for(let k=0;k<3;k++){const w=s*(.7-((k+seed)%3)*.12);c.fillRect(-s/2+s*.14,-s/2+s*.2+k*s*.22,w,s*.08)}c.restore()}

/* ---- characters and props ---- */
function bust(c,cx,cy,sc,ex,t){
  c.save();c.translate(cx,cy);c.scale(sc,sc);
  const blink=(t%4.2)<.12?.15:1,br=Math.sin(t*1.6)*2;
  /* white cut-out rim, then body */
  const body=()=>{c.beginPath();c.moveTo(-270,420);c.bezierCurveTo(-270,230,-180,180,-62,160);c.lineTo(62,160);c.bezierCurveTo(180,180,270,230,270,420);c.closePath()};
  c.save();c.translate(0,br);body();c.lineWidth=12;c.strokeStyle='#fff';c.lineJoin='round';c.stroke();c.fillStyle=C0.shirt;c.fill();
  c.fillStyle='rgba(255,255,255,.06)';c.beginPath();c.moveTo(-270,420);c.bezierCurveTo(-270,230,-180,180,-62,160);c.lineTo(-40,420);c.fill();
  c.restore();
  c.save();c.translate(0,br*.5);
  c.fillStyle=C0.skin2;c.beginPath();c.moveTo(-48,90);c.lineTo(48,90);c.lineTo(58,176);c.quadraticCurveTo(0,205,-58,176);c.closePath();c.fill();
  c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(0,118,60,32,0,0,Math.PI);c.fill();
  c.lineWidth=10;c.strokeStyle='#fff';c.beginPath();c.ellipse(0,0,104,128,0,0,7);c.stroke();
  const hg=c.createLinearGradient(-104,0,104,0);hg.addColorStop(0,C0.skin2);hg.addColorStop(.45,C0.skin);hg.addColorStop(1,'#CC9166');
  c.fillStyle=hg;c.beginPath();c.ellipse(0,0,104,128,0,0,7);c.fill();
  c.fillStyle=C0.skin2;[-1,1].forEach(s=>{c.beginPath();c.ellipse(s*104,12,14,26,0,0,7);c.fill()});
  c.fillStyle=C0.hair;c.beginPath();c.moveTo(-108,0);c.bezierCurveTo(-112,-96,-60,-150,0,-150);c.bezierCurveTo(60,-150,112,-96,108,0);c.bezierCurveTo(100,-44,70,-74,28,-66);c.bezierCurveTo(-10,-60,-60,-64,-84,-26);c.bezierCurveTo(-96,-14,-104,-6,-108,0);c.fill();
  /* eyes and brows by expression */
  const E={neutral:{b:[0,0],m:0},worried:{b:[-.3,-.3],m:-.5},angry:{b:[.42,.42],m:-.9},smile:{b:[-.08,-.08],m:1}}[ex]||{b:[0,0],m:0};
  [-1,1].forEach(s=>{
    c.fillStyle='#f6efe4';c.beginPath();c.ellipse(s*42,-2,19,11*blink,0,0,7);c.fill();
    c.fillStyle='#2a1810';c.beginPath();c.ellipse(s*42+Math.sin(t*.7)*2,-2,8.5,8.5*blink,0,0,7);c.fill();
    const k=E.b[0];c.strokeStyle='#17110E';c.lineWidth=8;c.lineCap='round';c.beginPath();c.moveTo(s*66,-34-k*10);c.lineTo(s*20,-34+k*24);c.stroke();
  });
  c.strokeStyle='rgba(80,40,20,.55)';c.lineWidth=5;c.beginPath();c.moveTo(0,-4);c.quadraticCurveTo(-12,34,8,40);c.stroke();
  c.strokeStyle='#5a2a1c';c.lineWidth=7;c.lineCap='round';c.beginPath();c.moveTo(-34,74);c.quadraticCurveTo(0,74+(E.m>0?26*E.m:18*E.m),34,74);c.stroke();
  c.restore();c.restore();
}
function laptopBack(c,cx,y,w){shadowed(c,()=>{c.fillStyle='#232628';rr(c,cx-w/2,y,w,360,24);c.fill()},0,-6,.35);c.fillStyle='rgba(255,255,255,.07)';rr(c,cx-w/2+14,y+14,w-28,40,14);c.fill();c.fillStyle='#3a3e40';c.beginPath();c.arc(cx,y+120,16,0,7);c.fill()}
function hand(c,x,y,sc,rot,t,tap){
  c.save();c.translate(x,y);c.rotate(rot);c.scale(sc,sc);c.translate(0,tap*14);
  c.fillStyle=C0.teal2;c.beginPath();c.moveTo(60,340);c.lineTo(250,340);c.lineTo(220,120);c.lineTo(90,100);c.closePath();c.fill();
  c.fillStyle=C0.skin;c.beginPath();c.moveTo(60,130);c.bezierCurveTo(40,60,50,-20,66,-140);c.bezierCurveTo(72,-176,112,-176,118,-140);c.bezierCurveTo(122,-80,130,-20,150,30);c.bezierCurveTo(176,40,200,80,196,140);c.bezierCurveTo(190,190,150,210,100,196);c.closePath();c.fill();
  c.fillStyle=C0.skin2;[[150,42,96,40],[160,78,92,38],[166,114,84,36]].forEach(([a,b,w,h])=>{c.beginPath();c.ellipse(a+14,b+10,w/2,h/2,.2,0,7);c.fill()});
  c.strokeStyle='rgba(0,0,0,.12)';c.lineWidth=4;c.beginPath();c.moveTo(66,-120);c.lineTo(66,40);c.stroke();c.restore();
}

/* ================= scene kits ================= */
function frameSetup(c,Z,py){const z=1+(document.getElementById('motion')?.value==='calm'?.018:.11)*clamp(Z.lt/Math.max(1,Z.dur),0,1)+(Z.i===0?.03*Math.exp(-Z.lt*1.2):0);c.translate(360,py||560);c.scale(z,z);c.translate(-360,-(py||560))}

function sceneChar(c,Z){
  const {L,plan:p}=Z,t=Z.t,ex=p.role==='problem'?'angry':p.role==='hook'?'worried':p.role==='takeaway'||p.role==='example'?'smile':'neutral';
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,C0.wall);g.addColorStop(.7,C0.wall2);g.addColorStop(1,'#b59a80');c.fillStyle=g;c.fillRect(-60,-60,W+120,H+120);
  c.save();frameSetup(c,Z,600);
  if(L.depth){ /* window, wall shade */
    const wx=Z.flip?60:470;c.fillStyle='#16222d';c.fillRect(wx,150,200,300);c.strokeStyle=C0.wall;c.lineWidth=10;c.strokeRect(wx,150,200,300);c.beginPath();c.moveTo(wx+100,150);c.lineTo(wx+100,450);c.moveTo(wx,300);c.lineTo(wx+200,300);c.stroke();
    const lg=c.createLinearGradient(wx,150,wx+200,450);lg.addColorStop(0,'rgba(180,210,230,.28)');lg.addColorStop(1,'rgba(180,210,230,0)');c.fillStyle=lg;c.fillRect(wx,150,200,300);
    c.fillStyle='rgba(0,0,0,.08)';c.fillRect(Z.flip?0:600,0,120,H);
  }
  if(L.char){bust(c,360+(Z.flip?-12:12),590,1.08,ex,t)}
  if(L.graphic){c.fillStyle=C0.desk2;c.fillRect(-60,860,W+120,H);const dg=c.createLinearGradient(0,830,0,1000);dg.addColorStop(0,C0.desk);dg.addColorStop(1,C0.desk2);c.fillStyle=dg;c.fillRect(-60,830,W+120,H);laptopBack(c,360,790,500)}
  c.restore();
  if(L.deco&&L.type&&!Z.mixed){note(c,Z.quote,Z.flip?500:225,Z.flip?300:290,330,Z.flip?.04:-.04,rv(Z,Z.plan.key.a,.2,.45))}
  if(L.type&&(p.role==='hook'||p.role==='problem'||p.role==='takeaway'))blocks(c,p.key.text,70,880,580,50,p.role==='problem'?[C0.orange,C0.teal]:[C0.teal,C0.orange],'#fff',-.012,'l',rv(Z,p.key.a,.25,.4));
}
function sceneDesk(c,Z){
  const {L,plan:p}=Z,t=Z.t;
  const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#CBB59E');bg.addColorStop(.5,C0.desk);bg.addColorStop(1,C0.desk2);c.fillStyle=bg;c.fillRect(-60,-60,W+120,H+120);
  c.save();frameSetup(c,Z,460);
  if(L.graphic){
    shadowed(c,()=>{c.fillStyle=C0.paper;c.fillRect(76,116,568,674)},0,18,.3);
    c.fillStyle=C0.orange;c.fillRect(76,116,11,674);
    c.strokeStyle='rgba(15,61,63,.23)';c.lineWidth=2;
    for(let y=260;y<=740;y+=56){c.beginPath();c.moveTo(112,y);c.lineTo(606,y);c.stroke()}
    if(L.type){const f=fit(c,p.key.text,440,62,3,serif);c.font=serif(f.s);c.fillStyle=C0.teal;c.textAlign='left';c.textBaseline='middle';
      f.L.forEach((line,j)=>c.fillText(line,128,191+j*f.s*1.16))}
    const ic=icon(Z.subject);if(ic)drawIco(c,ic,492,500,188);
    else{c.fillStyle=C0.mustard;c.beginPath();c.arc(493,496,62,0,7);c.fill();c.strokeStyle=C0.teal;c.lineWidth=5;c.beginPath();c.moveTo(456,496);c.lineTo(530,496);c.stroke()}
    c.fillStyle='#27292A';c.save();c.translate(610,818);c.rotate(-.22);c.fillRect(-10,-140,20,270);c.fillStyle=C0.mustard;c.fillRect(-10,-140,20,28);c.restore();
  }
  c.restore();
  if(L.char)hand(c,Z.flip?60:520,Z.flip?740:700,1.15,-.22,t,Math.max(0,Math.sin(t*3))*.6);
  if(L.type&&!Z.mixed)blocks(c,p.key.text,60,880,590,50,[C0.orange,C0.teal],'#fff',-.012,'l',rv(Z,p.key.a,.25,.4));
  if(L.deco&&p.role==='example')sticky(c,p.key.text,590,200,.05,rv(Z,p.key.a,.2,.4),210);
}
function stackBase(c,Z){paperBg(c,C0.cream);}
function sceneCards(c,Z,items,kind){
  const {L,plan:p}=Z;stackBase(c,Z);c.save();frameSetup(c,Z,560);
  const n=items.length,showSticky=n<=3&&L.deco&&L.type&&!Z.mixed,y0=showSticky?390:170,h=n<=3?150:n===4?128:112,gap=n<=3?40:26,bars=[C0.orange,C0.mustard,C0.teal,C0.orange,C0.mustard];
  if(showSticky)sticky(c,p.key.text,Z.flip?520:200,230,Z.flip?.05:-.06,rv(Z,0,0,.5),250);
  items.forEach((it,k)=>{
    const pr=rv(Z,it.w,k/n,.5),e=soft(pr);if(pr<=0)return;
    const y=y0+k*(h+gap)+h/2,x=360+(1-e)*-90;
    c.save();c.globalAlpha=Math.min(1,pr*2);
    paper(c,x,y,580,h,bars[k],1);
    if(L.graphic){const ic=icon(it.label);if(ic){c.fillStyle='#fff';rr(c,x-262,y-h*.32,h*.64,h*.64,12);c.fill();drawIco(c,ic,x-262+h*.32,y,h*.52)}else thumb(c,x-262+h*.32,y,h*.64,k%2?C0.teal2:C0.teal,k)}
    if(L.type){const shown=Z.sparse?(window.VisualLayout.keyword(it.label,libHit)||it.label.split(/\s+/).slice(0,2).join(' ')):it.label;const f=fit(c,up(shown),340,n<=3?44:38,2,heavy);c.font=heavy(f.s);c.fillStyle=C0.teal;c.textAlign='left';c.textBaseline='middle';f.L.forEach((l,j)=>c.fillText(l,x-262+h*.64+24,y+(j-(f.L.length-1)/2)*f.s*1.12))}
    if(kind==='flow'&&k>0&&it.conn&&L.type){c.font='italic 600 24px '+SERIF;c.fillStyle=C0.orange;c.textAlign='center';c.fillText(it.conn,x+250,y-h/2-gap/2)}
    if(kind==='flow'&&k<n-1){const q=rv(Z,items[k+1].w,(k+1)/n,.5);if(q>0){c.strokeStyle=C0.teal;c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(x,y+h/2+4);c.lineTo(x,y+h/2+4+gap*q);c.stroke()}}
    if(kind==='list'||kind==='flow'){const tk=sm((Z.lt-rt(Z.i,(items[k+1]||{w:99}).w,(k+1)/n)-.1)/.3);if(tk>0||k===n-1&&pr>=1){const q=k===n-1?sm((pr-.7)/.3):tk;c.fillStyle=C0.teal;c.beginPath();c.arc(x+250,y,22,0,7);c.fill();c.strokeStyle='#fff';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(x+240,y);c.lineTo(x+248,y+9*q);c.lineTo(x+262,y-9*q);c.stroke()}}
    c.restore();
  });
  c.restore();
}
function sceneCompare(c,Z){
  const {L,plan:p}=Z,sd=p.data.sides;stackBase(c,Z);c.save();frameSetup(c,Z,560);
  const pa=rv(Z,sd.wa,0,.5),pb=rv(Z,sd.wb,.5,.5),H1=250;
  [[sd.a,pa,300,C0.orange,-1],[sd.b,pb,640,C0.teal2,1]].forEach(([txt,pr,y,bar,s])=>{if(pr<=0)return;const e=soft(pr),x=360+(1-e)*s*120;
    c.save();c.globalAlpha=Math.min(1,pr*2);paper(c,x,y,600,H1,bar,1);
    const ic=L.graphic?icon(txt):null;if(ic){c.fillStyle='#fff';rr(c,x-270,y-70,140,140,14);c.fill();drawIco(c,ic,x-200,y,110)}else if(L.graphic)thumb(c,x-200,y,130,bar,s>0?1:2);
    if(L.type){const shown=Z.sparse?(window.VisualLayout.keyword(txt,libHit)||txt.split(/\s+/).slice(0,2).join(' ')):txt;const f=fit(c,up(shown),300,50,3,heavy);c.font=heavy(f.s);c.fillStyle=C0.teal;c.textAlign='left';c.textBaseline='middle';f.L.forEach((l,j)=>c.fillText(l,x-110,y+(j-(f.L.length-1)/2)*f.s*1.12))}c.restore()});
  if(pb>0){const e=soft(pb);c.save();c.translate(360,470);c.scale(e,e);c.fillStyle=C0.ink;c.beginPath();c.arc(0,0,40,0,7);c.fill();c.lineWidth=6;c.strokeStyle=C0.cream;c.stroke();c.font=heavy(30);c.fillStyle=C0.cream;c.textAlign='center';c.textBaseline='middle';c.fillText('VS',0,2);c.restore()}
  c.restore();
}
function sceneTimeline(c,Z){
  const {L,plan:p}=Z,sq=p.data.seq,n=sq.length;stackBase(c,Z);c.save();frameSetup(c,Z,560);
  if(L.deco&&L.type)sticky(c,p.key.text,360,260,-.05,rv(Z,0,0,.5),300);
  const x0=100,x1=620,y=640;c.strokeStyle='#d8cfbb';c.lineWidth=8;c.lineCap='round';c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();
  let reach=0;sq.forEach((s,k)=>{if(rv(Z,s.w,k/n)>0)reach=k});
  const lastx=x0+(x1-x0)*(reach/(n-1)),nxt=reach<n-1?sm(rv(Z,sq[reach+1].w,(reach+1)/n,.9)):0,fx=lastx+(reach<n-1?(x1-x0)/(n-1)*nxt:0);
  c.strokeStyle=C0.orange;c.beginPath();c.moveTo(x0,y);c.lineTo(Math.min(x1,fx),y);c.stroke();
  sq.forEach((s,k)=>{const pr=rv(Z,s.w,k/n);if(pr<=0)return;const x=x0+(x1-x0)*k/(n-1),e=soft(pr);c.save();c.translate(x,y);c.scale(e,e);c.fillStyle=C0.mustard;c.beginPath();c.arc(0,0,14,0,7);c.fill();c.restore();
    if(L.type){const f=fit(c,up(s.label),(x1-x0)/Math.max(1,n-1)-8,22,3,heavy);c.font=heavy(f.s);c.fillStyle=C0.teal;c.textAlign='center';c.textBaseline='middle';c.globalAlpha=pr;f.L.forEach((l,j)=>c.fillText(l,x,y+40+j*f.s*1.15));c.globalAlpha=1}});
  if(L.char){c.save();c.translate(fx,y-38);c.fillStyle=C0.teal;c.fillRect(-4,-52,8,52);c.fillRect(-4,-52,64,34);c.restore()}
  c.restore();
}
function sceneChart(c,Z){
  const {L,plan:p}=Z,v=p.data.values,n=v.length,mx=Math.max(...v.map(q=>q.v));stackBase(c,Z);c.save();frameSetup(c,Z,560);
  paper(c,360,520,620,640,C0.teal,1);
  if(L.type)blocks(c,p.key.text,60,250,560,40,[C0.orange],'#fff',-.01,'l',rv(Z,0,0,.5));
  const base=760,maxH=330,bw=Math.min(120,440/n-30);
  c.strokeStyle='#cfc7b4';c.lineWidth=5;c.beginPath();c.moveTo(110,360);c.lineTo(110,base);c.lineTo(620,base);c.stroke();
  v.forEach((q,k)=>{const pr=rv(Z,q.w,k/n,.8);if(pr<=0)return;const x=130+(k+.5)*(480/n),h=Math.max(10,maxH*q.v/mx*soft(pr));c.fillStyle=[C0.teal,C0.orange,C0.mustard,C0.teal2][k%4];c.fillRect(x-bw/2,base-h,bw,h);
    if(L.type){c.font=heavy(44);c.fillStyle=C0.ink;c.textAlign='center';c.textBaseline='middle';if(pr>.5)c.fillText(q.txt,x,base-h-34);if(q.label){const f=fit(c,up(q.label),bw+50,22,2,heavy);c.font=heavy(f.s);c.fillStyle=C0.teal;f.L.forEach((l,j)=>c.fillText(l,x,base+30+j*f.s*1.1))}}});
  c.restore();
}
function scenePhone(c,Z){
  const {L,plan:p}=Z,nm=p.data.number;stackBase(c,Z);c.save();frameSetup(c,Z,600);
  if(L.graphic){
    shadowed(c,()=>{c.fillStyle='#161819';rr(c,200,260,320,640,46);c.fill()},0,16,.35);c.fillStyle='#F5F1E6';rr(c,214,274,292,612,34);c.fill();
    c.fillStyle='#8b8574';c.font=heavy(16);c.textAlign='left';c.fillText(up(nm.label||''),236,328);
    c.fillStyle=C0.teal;rr(c,232,350,256,180,16);c.fill();
    const t=Z.lt-rt(Z.i,nm.k,.2),pr=clamp(t/1.1,0,1),val=nm.v*(1-Math.pow(1-pr,3));
    c.fillStyle=C0.mustard;c.font=heavy(18);c.fillText(up(nm.label||''),252,386);c.fillStyle='#fff';c.font=serif(56);c.textAlign='left';const txt=(nm.cur||'')+val.toLocaleString('en-IN',{minimumFractionDigits:nm.dec,maximumFractionDigits:nm.dec})+(nm.unit==='%'?'%':'');c.fillText(txt,252,470,216);

  }
  c.restore();
  if(L.type)blocks(c,p.key.text,60,150,600,48,[C0.orange,C0.teal],'#fff',-.012,'l',rv(Z,0,0,.45));
}
function sceneTitle(c,Z){   /* dark teal title card */
  const {L,plan:p}=Z,nm=p.data.number;paperBg(c,C0.teal,true);c.save();frameSetup(c,Z,600);
  const toks=Z.toks;const pre=toks.slice(Math.max(0,p.key.a-3),p.key.a).filter(w=>!STOP.has(w.toLowerCase())).join(' ');
  if(pre&&L.type)kicker(c,pre,360,330,C0.mustard,26);
  const k1=rv(Z,p.key.a,.2,.6);
  if(nm&&p.eff.treat==='counter'){const t=Z.lt-rt(Z.i,nm.k,.2),pr=clamp(t/1.1,0,1),val=nm.v*(1-Math.pow(1-pr,3));c.globalAlpha=Math.min(1,pr*3);c.font=serif(200);c.fillStyle=C0.cream;c.textAlign='center';c.textBaseline='middle';c.fillText((nm.cur||'')+val.toLocaleString('en-IN',{minimumFractionDigits:nm.dec,maximumFractionDigits:nm.dec})+(nm.unit==='%'?'%':''),360,520,620);c.globalAlpha=1;
    if(L.type&&nm.label){const f=fit(c,up(nm.label),560,54,2,heavy);c.font=heavy(f.s);c.fillStyle=C0.cream;f.L.forEach((l,j)=>c.fillText(l,360,680+j*f.s*1.2))}}
  else if(L.type){const f=fit(c,p.key.text,600,92,2,serif);c.globalAlpha=Math.min(1,k1*1.6);c.font=serif(f.s);c.fillStyle=C0.cream;c.textAlign='center';c.textBaseline='middle';f.L.forEach((l,j)=>c.fillText(l,360,500+(j-(f.L.length-1)/2)*f.s*1.2+(1-soft(k1))*30));c.globalAlpha=1;
    const post=Z.toks.slice(p.key.b+1,p.key.b+5).filter(w=>!STOP.has(w.toLowerCase())).join(' ');if(post){const k2=rv(Z,p.key.b+1,.6,.5);const f2=fit(c,up(post),560,46,2,heavy);c.globalAlpha=k2;c.font=heavy(f2.s);c.fillStyle=C0.mustard;f2.L.forEach((l,j)=>c.fillText(l,360,660+j*f2.s*1.2));c.globalAlpha=1}}
  c.strokeStyle='rgba(244,239,228,.5)';c.lineWidth=3;c.beginPath();c.moveTo(320,600);c.lineTo(400,600);c.stroke();
  c.restore();
}
function sceneBig(c,Z){   /* big heavy words on cream */
  const {L,plan:p}=Z;paperBg(c,C0.cream);c.save();frameSetup(c,Z,540);
  if(L.deco&&L.type)sticky(c,p.role==='takeaway'?'REMEMBER':p.roleName.toUpperCase(),Z.flip?540:180,200,Z.flip?.06:-.06,rv(Z,0,0,.5),220);
  const f=fit(c,up(p.key.text),600,130,3,heavy),k=rv(Z,p.key.a,.25,.5);
  if(L.type){c.globalAlpha=Math.min(1,k*1.8);c.font=heavy(f.s);c.fillStyle=C0.teal;c.textAlign='center';c.textBaseline='middle';f.L.forEach((l,j)=>c.fillText(l,360,470+(j-(f.L.length-1)/2)*f.s*1.1+(1-soft(k))*40));c.globalAlpha=1;
    const post=Z.toks.slice(p.key.b+1,p.key.b+5).map(w=>w.replace(/[,.;।?!]+$/,'')).join(' ');if(post){const k2=rv(Z,p.key.b+1,.6,.5);const f2=fit(c,up(post),600,70,2,heavy);c.globalAlpha=k2;c.font=heavy(f2.s);c.fillStyle=C0.orange;f2.L.forEach((l,j)=>c.fillText(l,360,470+f.L.length*f.s*.62+60+j*f2.s*1.1+(1-soft(k2))*30));c.globalAlpha=1}}
  c.restore();
}
function sceneFootage(c,Z){
  const el=Z.M.el,w=el.videoWidth||el.naturalWidth,h=el.videoHeight||el.naturalHeight;
  c.fillStyle=C0.ink;c.fillRect(-60,-60,W+120,H+120);
  if(w&&h){const fo={x:.5,y:.42},z=1.06+.08*sm(Z.lt/Math.max(2,Z.dur)),sc=Math.max(W/w,H/h)*z,dw=w*sc,dh=h*sc,ox=clamp((.5-fo.x)*(dw-W)*.6,-(dw-W)/2,(dw-W)/2),oy=clamp((.5-fo.y)*(dh-H)*.6,-(dh-H)/2,(dh-H)/2);
    c.drawImage(el,(W-dw)/2+ox,(H-dh)/2+oy,dw,dh);
    if(Z.L.graphic){const fx=(W-dw)/2+ox+fo.x*dw,fy=clamp((H-dh)/2+oy+fo.y*dh,260,820),r=70*soft(rv(Z,0,0,.7));c.strokeStyle=C0.mustard;c.lineWidth=8;c.beginPath();c.ellipse(fx,fy,r*1.25,r,-.1,0,7);c.stroke()}}
  const g=c.createRadialGradient(360,560,260,360,560,900);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,20,20,.55)');c.fillStyle=g;c.fillRect(0,0,W,H);
  if(Z.L.type)blocks(c,Z.plan.key.text,60,880,590,50,[C0.orange,C0.teal],'#fff',-.012,'l',rv(Z,Z.plan.key.a,.25,.4));
}


function sceneMusic(c,Z){
 paperBg(c,C0.cream);c.save();frameSetup(c,Z,490);
 paper(c,360,486,570,570,C0.orange,1,-.025);
 const beats=AIV[Z.i]?.beats||[],ws=wordsT(Z.i),active=beats.reduce((n,b,k)=>ws[b.w0]&&Z.t>=ws[b.w0].s?k:n,0),layers=beats[active]?.L||[];
 const icons=layers.filter(q=>q.im).slice(0,2);
 icons.forEach((q,k)=>{const w=k?145:250,x=k?500:290,y=k?600:442;drawIco(c,{im:q.im,ar:q.ar||1},x,y,w)});
 if(!icons.length){c.fillStyle=C0.teal;c.font=serif(205);c.textAlign='center';c.textBaseline='middle';c.fillText('♪',360,460)}
 c.strokeStyle=C0.orange;c.lineWidth=8;c.beginPath();c.moveTo(135,750);c.lineTo(135+450*sm(Z.lt/Math.max(1,Z.dur)),750);c.stroke();c.restore()
}
/* Render only the visual layer. The main editor owns captions, sync, media, ratios and export. */
function render(c,opts){
 const {i,t,lt,M,col,P,pin,treatment,layers,preferMedia,music,direction,grammar,getIcon,revealAt,calm,variant,captionsOn}=opts;
 const [a,b]=bounds(i),plan=window.StoryDirector.plan(i,sents.length),toks=sceneToks(i),L={
  type:layers?.labels!==false,graphic:layers?.diagram!==false,char:layers?.character!==false,
  deco:layers?.labels!==false,depth:layers?.diagram!==false};
 const Z={c,i,plan,L,t,mixed:UI.sty==='automix',lt:Math.max(0,lt)+(i===0?.3:0),dur:Math.max(.2,b-a),flip:plan.flip,M,toks,
  quote:toks.slice(0,9).join(' ').replace(/[“”"]/g,''),subject:plan.key.text,
  notice:toks.slice(Math.max(0,plan.key.a-1),plan.key.a+3).join(' ')};
 const readyMedia=!!(M&&(M.el.videoWidth||M.el.naturalWidth)),useMedia=readyMedia&&layers?.media!==false&&(treatment==='media'||treatment==='auto'&&preferMedia);
 let T=plan.eff.treat,d=plan.data;
 if(treatment==='typography'||treatment==='focus'||treatment==='payoff')T='kinetic';
 else if(treatment==='demo'||treatment==='hook'||treatment==='obstacle')T='figure';
 else if(treatment==='comparison'&&d.sides)T='compare';
 else if(treatment==='steps'&&d.items)T='list';
 else if(treatment==='flow'&&d.steps)T='flow';
 if(treatment==='auto'&&direction==='stickman'&&L.char)T='figure';
 if(treatment==='auto'&&direction==='graphics')T=d.values?'chart':d.seq?'timeline':d.sides?'compare':d.items?'list':d.steps?'flow':'kinetic';
 if(!L.graphic&&!L.char)T='kinetic';
 Z.plan={...plan,eff:{...plan.eff,treat:T}};
 /* With captions on, illustrated scenes keep one source-grounded keyword instead of
    repeating a quote, sticker, title block and caption simultaneously. */
 const grounded=window.VisualLayout.keyword(plan.key.text,libHit)||window.VisualLayout.keyword(sents[i],libHit);
 if(CAP.on&&L.graphic&&grounded&&T==='kinetic'&&treatment==='auto'&&!music&&!pin&&!useMedia){T='depth';Z.plan={...Z.plan,eff:{...Z.plan.eff,treat:T}}}
 if(CAP.on&&L.graphic&&grounded&&T!=='kinetic'&&T!=='counter'){
  Z.L.deco=false;Z.sparse=treatment==='auto';Z.plan={...Z.plan,key:{...plan.key,text:grounded}};Z.quote=grounded;Z.subject=grounded;
 }
 if(!music&&!pin&&!useMedia&&L.graphic&&opts.eduPlan&&treatment==='auto'){window.EducationalComponents.render(c,opts.eduPlan,{skin:'story',t,start:opts.eduStart,end:opts.eduEnd,words:opts.eduWords,calm});return}
 if(!music&&!pin&&!useMedia&&L.graphic&&opts.propPlan&&treatment==='auto'){window.MetaphorProps.render(c,opts.propPlan,{skin:'story',t,start:opts.propStart,end:opts.propEnd,words:opts.propWords,calm});return}
 if(!music&&!pin&&!useMedia&&L.graphic&&opts.selfPlan&&treatment==='auto'){window.SelfImprovement.render(c,opts.selfPlan,{skin:'story',t,start:opts.selfStart,end:opts.selfEnd,words:opts.selfWords,calm});return}
 if(!music&&!pin&&!useMedia&&L.graphic&&opts.graph&&treatment==='auto'){window.SceneGraph.render(c,opts.graph,{skin:'story',t,start:opts.graphStart,end:opts.graphEnd,words:opts.graphWords,calm});return}
 if(!music&&!pin&&!useMedia&&L.graphic&&grammar?.supported&&(treatment==='explain'||treatment==='auto'&&direction!=='stickman')){
  window.VisualGrammar.render(c,grammar,{style:'story',time:t,revealAt,calm,variant,captionsOn,getIcon});return;
 }
 paperBg(c,C0.cream);
 c.save();c.beginPath();c.rect(0,22,W,648);c.clip();c.translate(100,0);c.scale(.72,.72);
 if(useMedia){Z.M=M;sceneFootage(c,Z)}
 else if(pin){
  paperBg(c,C0.cream);c.save();c.beginPath();c.rect(20,70,680,840);c.clip();
  if(L.graphic||L.char)stageFit(c,pin,Math.max(.02,lt),t,col,P,0,false,sents[i]);
  c.restore();if(L.type)blocks(c,plan.key.text,60,150,600,43,[C0.orange,C0.teal],'#fff',0,'l',rv(Z,0,0,.5));
 }else if(music){ /* use the existing locally generated beat icons inside a Story paper card */
  sceneMusic(c,Z)
 }else if(T==='flow'&&d.steps?.length)sceneCards(c,Z,d.steps,'flow');
 else if(T==='list'&&d.items?.length)sceneCards(c,Z,d.items,'list');
 else if(T==='compare'&&d.sides)sceneCompare(c,Z);
 else if(T==='timeline'&&d.seq?.length)sceneTimeline(c,Z);
 else if(T==='chart'&&d.values?.length)sceneChart(c,Z);
 else if(T==='counter'&&d.number)(plan.comp%2?scenePhone:sceneTitle)(c,Z);
 else if(T==='kinetic')(plan.role==='hook'||plan.comp%2?sceneBig:sceneTitle)(c,Z);
 else if(T==='depth')(plan.comp%2?sceneChar:sceneDesk)(c,Z);
 else (plan.role==='example'||plan.comp%2?sceneDesk:sceneChar)(c,Z);
 c.restore();
 if(i>0&&lt<.3){c.fillStyle='rgba(244,239,228,'+(.52*(1-Math.max(0,lt)/.3))+')';c.fillRect(0,0,W,650)}
 c.fillStyle='rgba(27,43,45,.12)';c.fillRect(60,683,W-120,2);
}
window.StoryStyle={render,plan:i=>window.StoryDirector.plan(i,sents.length)};
})();
