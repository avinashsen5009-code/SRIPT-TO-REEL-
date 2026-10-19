/* Phase 1: source-grounded scene graph, layout, drawing and clarity checks.
   Pure deterministic rules; no API calls, invented data or fictional citations. */
(function(root){'use strict';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,Number(x)||0));
const WORD=/[\p{L}\p{N}₹$%]+/gu;
const words=s=>[...String(s||'').matchAll(WORD)].map(m=>({text:m[0],start:m.index}));
const clean=s=>String(s||'').trim().replace(/^[\s,.;:!?।]+|[\s,.;:!?।]+$/gu,'');
const short=s=>clean(s).split(/\s+/).slice(0,4).join(' ').slice(0,45);
const roman=s=>String(s||'').toLocaleLowerCase();
const STOP=new Set('a an the is are was were to of in on for with and or but this that it you your we i they he she be one two तीन एक ये वह यह और है हैं का के की को में से पर से भी फिर pehle phir aur hai hain ka ke ki ko se mein'.split(' '));
function fromText(source){
 const text=clean(source),tok=words(text),graph={version:1,idea:text,kind:'statement',nodes:[],links:[],groups:[],values:[],emphasis:[],layout:'focus',review:true,source:text};
 if(!text)return graph;
 function node(label,kind='label',hint=0){label=short(label);if(!label)return null;const w=words(label),at=Math.max(0,tok.findIndex((o,j)=>j>=hint&&roman(o.text)===roman(w[0]?.text)));return{id:'n'+graph.nodes.length,kind,label,at:at<0?0:at}}
 function put(parts,kind,layout,relation){if(kind==='definition'&&parts[1]?.split(/\s+/).length>4){const w=parts[1].split(/\s+/);parts=[parts[0],...Array.from({length:Math.ceil(w.length/4)},(_,k)=>w.slice(k*4,(k+1)*4).join(' '))]}const truncated=parts.some(p=>clean(p).split(/\s+/).length>4);const arr=[];for(const part of parts){const next=node(part,'label',arr.length?arr.at(-1).at+1:0);if(next){next.id='n'+arr.length;next.at=Math.max(arr.length?arr.at(-1).at:0,next.at);arr.push(next)}}if(arr.length<2)return false;graph.kind=kind;graph.layout=layout;graph.nodes=arr;graph.links=arr.slice(1).map((v,j)=>({from:arr[j].id,to:v.id,kind:relation||'arrow',at:v.at}));graph.review=truncated;return true}
 const split=(re)=>{const m=re.exec(text);if(!m)return null;return [clean(text.slice(0,m.index)),clean(text.slice(m.index+m[0].length))]};
 const pair=split(/\b(?:instead of|rather than|versus|vs\.?|whereas|but|lekin|jabki)\b|लेकिन|जबकि|बनाम|के बजाय/iu);
 if(pair&&put(pair,'contrast','split','contrast'))return graph;
 const cause=split(/\b(?:because|therefore|leads to|causes|results in|isliye|kyunki)\b|क्योंकि|इसलिए|से होता है/iu);
 if(cause){const marker=(text.match(/\b(?:because|kyunki)\b|क्योंकि/iu)||[])[0];if(put(cause,'cause','row','arrow')){if(marker)graph.links=[{from:graph.nodes[1].id,to:graph.nodes[0].id,kind:'curve',at:graph.nodes[1].at}];return graph}}
 const def=split(/\b(?:means|is defined as|refers to|ka matlab|matlab hai)\b|का मतलब|की परिभाषा|का अर्थ/iu);
 if(def&&put(def,'definition','column','bracket'))return graph;
 const sequence=text.split(/\b(?:then|next|after that|phir|uske baad)\b|फिर|उसके बाद|इसके बाद/iu).map(clean).filter(Boolean);
 if(sequence.length>=2&&sequence.length<=6&&put(sequence,'steps','column','arrow'))return graph;
 const cycle=/\b(?:cycle|loop|repeat|repeats|dobara|roj|routine)\b|चक्र|दोहर|बार बार/iu.test(text);
 const items=text.split(/[,;،]|\s+\b(?:and|aur)\b\s+|\s+और\s+/iu).map(clean).filter(Boolean);
 if(cycle&&items.length>=3&&put(items,'cycle','cycle','arrow')){graph.links.push({from:graph.nodes.at(-1).id,to:graph.nodes[0].id,kind:'cycle',at:tok.length-1});return graph}
 const hierarchy=split(/\b(?:consists of|contains|includes|made of|has parts|ke hissa)\b|से मिलकर|के हिस्से|के प्रकार/iu);
 if(hierarchy){const children=hierarchy[1].split(/[,;]|\s+and\s+|\s+और\s+|\s+aur\s+/iu);if(children.length>=2&&put([hierarchy[0],...children],'hierarchy','tree','arrow')){graph.links=graph.nodes.slice(1).map(n=>({from:'n0',to:n.id,kind:'elbow',at:n.at}));return graph}}
 if(items.length>=3&&items.length<=6&&put(items,'list','grid','line'))return graph;
 const numerals=[...text.matchAll(/(?:₹|\$)?\d+(?:[.,]\d+)*(?:%| प्रतिशत)?/gu)].map(m=>({label:m[0],at:tok.findIndex(t=>t.start===m.index),value:m[0]}));
 if(numerals.length>=2){graph.kind='numbers';graph.layout='row';graph.nodes=numerals.slice(0,4).map((n,i)=>({id:'n'+i,kind:'counter',label:n.label,at:Math.max(0,n.at)}));graph.values=numerals.slice(0,4).map(v=>v.value);graph.review=false;return graph}
 const w=tok.find(x=>x.text.length>2&&!STOP.has(roman(x.text)))||tok[0];graph.nodes=[{id:'n0',kind:'label',label:short(w?.text||text),at:Math.max(0,tok.indexOf(w))}];return graph
}
const LAYOUTS=['row','column','grid','radial','tree','cycle','layers','timeline','matrix2x2','venn','split','focus'];
function validate(input,source){if(!input||typeof input!=='object'||!Array.isArray(input.nodes))throw Error('Graph needs a nodes array');if(!LAYOUTS.includes(input.layout))throw Error('Choose a supported layout');if(input.nodes.length<1||input.nodes.length>6)throw Error('Use 1–6 nodes; split longer ideas into scenes');const ids=new Set(),n=input.nodes.map((x,i)=>{const label=clean(x.label);if(!label||label.split(/\s+/).length>4||label.length>45)throw Error('Each label needs 1–4 words, at most 45 characters');const id='n'+i;ids.add(id);return{id,kind:['label','counter','icon','box','circle','pill','ring','bar','check','cross'].includes(x.kind)?x.kind:'label',label,at:clamp(Math.floor(x.at),0,Math.max(0,words(source).length-1))}});const links=(input.links||[]).slice(0,8).map(x=>({from:String(x.from),to:String(x.to),kind:['arrow','line','curve','elbow','bracket','cycle','contrast'].includes(x.kind)?x.kind:'arrow',at:clamp(Math.floor(x.at),0,Math.max(0,words(source).length-1))}));if(links.some(x=>!ids.has(x.from)||!ids.has(x.to)))throw Error('Every link must join existing node IDs');return {version:1,source:String(source||''),idea:clean(input.idea)||clean(source),kind:clean(input.kind)||'manual',nodes:n,links,groups:Array.isArray(input.groups)?input.groups.slice(0,6):[],values:Array.isArray(input.values)?input.values.slice(0,6):[],emphasis:Array.isArray(input.emphasis)?input.emphasis.slice(0,6):[],layout:input.layout,review:!!input.review}}
function boxes(g,skin){const n=g.nodes.length,top=skin==='story'?209:485,bottom=skin==='story'?614:901,area=bottom-top,box={x:65,y:top,w:590,h:area},gap=14;
 let layout=g.layout;if(n===1)layout='focus';else if(layout==='focus')layout='grid';if(n>4&&['row','split','tree','venn'].includes(layout))layout='grid';if(n>3&&layout==='column')layout='grid';const out=[];
 for(let i=0;i<n;i++){let x,y,w,h;if(layout==='focus'){[x,y,w,h]=[125,top+area*.24,470,area*.52]}
 else if(layout==='column'||layout==='timeline'){h=Math.min(110,(area-gap*(n-1))/n);w=540;x=90;y=top+i*(h+gap)}
 else if(layout==='row'||layout==='split'||layout==='venn'){w=(590-gap*(n-1))/n;h=Math.min(245,area*.67);x=65+i*(w+gap);y=top+(area-h)/2}
 else if(layout==='tree'){h=n>3?90:120;w= n>3?130:Math.min(230,590/(n-1)-gap);x=i===0?360-110:65+(i-1)*((590-w)/Math.max(1,n-2));y=i===0?top:bottom-h-8;if(i===0)w=220}
 else if(layout==='cycle'||layout==='radial'){w=n>4?125:145;h=n>4?87:105;const ang=-Math.PI/2+i*2*Math.PI/n;x=360+Math.cos(ang)*Math.min(205,(590-w)/2)-w/2;y=top+area/2+Math.sin(ang)*Math.min(140,(area-h)/2)-h/2}
 else{const cols=layout==='layers'?1:2,rows=Math.ceil(n/cols);w=cols===1?520:(590-gap)/2;h=Math.min(135,(area-gap*(rows-1))/rows);x=cols===1?100:65+(i%cols)*(w+gap);y=top+Math.floor(i/cols)*(h+gap)}out.push({x,y,w,h})}
 return out}
function contrast(fg,bg){const color=x=>{let z=x.replace('#','');if(z.length===3)z=z.split('').map(v=>v+v).join('');const a=[0,2,4].map(k=>parseInt(z.slice(k,k+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return a[0]*.2126+a[1]*.7152+a[2]*.0722};const a=color(fg),b=color(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)}
const colors=(skin,night,accent)=>skin==='story'?{bg:'#F4EFE4',card:'#FFFFFF',ink:'#1B2B2D',accent:'#0F3D3F',line:'#D4622B'}:night?{bg:'#0B1230',card:'#152548',ink:'#FFFFFF',accent:'#FFFFFF',line:'#8DC6FF'}:{bg:'#F3EEE3',card:'#FFFFFF',ink:'#101828',accent:'#1F4FE0',line:'#1F4FE0'};
function lint(graph,skin='explainer',night=false){const g=validate(graph,graph.source),rects=boxes(g,skin),paint=colors(skin,night),issues=[];if(g.nodes.length>6)issues.push('too many nodes');let minFont=Infinity;for(let i=0;i<g.nodes.length;i++){const b=rects[i],size=g.nodes.length===1?58:b.w<190?32:Math.max(32,Math.min(49,b.w/Math.max(5,g.nodes[i].label.length*.52)));minFont=Math.min(minFont,size);if(size<32)issues.push('small body text');if(g.nodes[i].label.split(/\s+/).length>4)issues.push('long label');for(let j=0;j<i;j++){const q=rects[j];if(b.x<q.x+q.w&&b.x+b.w>q.x&&b.y<q.y+q.h&&b.y+b.h>q.y)issues.push('overlap '+i+' '+j)}}if(contrast(paint.ink,paint.card)<4.5)issues.push('low contrast');if(g.nodes.some((x,i)=>i>0&&x.at<g.nodes[i-1].at))issues.push('speech order differs');return{idea:g.idea,nodeCount:g.nodes.length,minFontSize:Math.round(minFont),contrast:+contrast(paint.ink,paint.card).toFixed(2),overlap:issues.some(x=>x.startsWith('overlap')),revealOrder:g.nodes.map(x=>x.at),issues,review:g.review}}
function path(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function motion(v){v=clamp(v);return 1+2.45*(v-1)**3+1.45*(v-1)**2}
const BACKGROUNDS=new Map();
function background(skin,col,night){const id=skin+(night?'night':'paper');if(BACKGROUNDS.has(id))return BACKGROUNDS.get(id);if(typeof document==='undefined')return null;const off=document.createElement('canvas');off.width=720;off.height=1280;const c=off.getContext('2d');c.fillStyle=col.bg;c.fillRect(0,0,720,1280);if(skin==='story'){c.strokeStyle='#D6CDC0';for(let y=167;y<900;y+=49){c.beginPath();c.moveTo(46,y);c.lineTo(674,y);c.stroke()}}else{c.strokeStyle=night?'#25365B':'#D8E2EA';for(let x=44;x<700;x+=48){c.beginPath();c.moveTo(x,140);c.lineTo(x,1008);c.stroke()}}BACKGROUNDS.set(id,off);return off}
function render(c,g,opts){const skin=opts.skin==='story'?'story':'explainer',col=colors(skin,opts.night),rects=boxes(g,skin),ws=opts.words||[],time=Number(opts.t)||0,start=Number(opts.start)||0,end=Number(opts.end)||start+2,dur=Math.max(.2,end-start);c.save();const bg=background(skin,col,opts.night);if(bg)c.drawImage(bg,0,0);else{c.fillStyle=col.bg;c.fillRect(0,0,720,1280)}
 const limit=(idx)=>Math.max(0,Math.min(ws.length-1,idx)),at=(i)=>ws.length?Number(ws[limit(i)]?.s)??start+i*dur/(g.nodes.length+1):start+i*dur/(g.nodes.length+1);
 const p=i=>clamp((time-at(g.nodes[i].at)) / (opts.calm?.72:.27));
 for(const edge of g.links){const a=g.nodes.findIndex(n=>n.id===edge.from),b=g.nodes.findIndex(n=>n.id===edge.to);if(a<0||b<0)continue;const A=rects[a],B=rects[b],q=p(b);if(q<=0)continue;const x=A.x+A.w/2,y=A.y+A.h/2,u=B.x+B.w/2,v=B.y+B.h/2;c.save();c.strokeStyle=col.line;c.lineWidth=3;c.globalAlpha=.75;c.setLineDash([5,5]);c.beginPath();c.moveTo(x,y);if(edge.kind==='elbow'){c.lineTo(u,y);c.lineTo(u,y+(v-y)*q)}else if(edge.kind==='curve'||edge.kind==='cycle'){c.quadraticCurveTo((x+u)/2,Math.min(y,v)-70,x+(u-x)*q,y+(v-y)*q)}else c.lineTo(x+(u-x)*q,y+(v-y)*q);c.stroke();c.setLineDash([]);c.restore()}
 for(let i=0;i<g.nodes.length;i++){const n=g.nodes[i],b=rects[i],q=p(i);if(q<=0)continue;c.save();c.globalAlpha=.25+.75*q;c.translate(b.x+b.w/2,b.y+b.h/2+(1-q)*17);const sc=1+(motion(q)-1)*.16;c.scale(sc,sc);c.translate(-b.w/2,-b.h/2);c.fillStyle=col.card;path(c,0,0,b.w,b.h,skin==='story'?10:16);c.fill();c.strokeStyle=col.line;c.lineWidth=skin==='story'?3:2;c.stroke();c.fillStyle=col.line;c.fillRect(14,12,Math.min(52,b.w-28),4);
  const tokens=n.label.split(/\s+/),id=typeof opts.lookup==='function'?tokens.map(x=>opts.lookup(x)).find(x=>x>=0):-1;
  const sourced=id>=0?tokens.find(x=>opts.lookup(x)===id):null;
  const display=opts.captionsOn?(sourced||tokens.find(x=>/[0-9०-९]/u.test(x))||tokens.find(x=>!STOP.has(roman(x)))||tokens[0]):n.label;
  const icon=sourced&&typeof opts.getIcon==='function'?opts.getIcon(id):null;
  const ix=icon?.im?Math.min(84,b.h*.65,b.w*.23):0;
  if(ix){const ar=icon.ar||1,iw=ar>=1?ix:ix*ar,ih=ar>=1?ix/ar:ix;
   c.drawImage(icon.im,20+(ix-iw)/2,(b.h-ih)/2,iw,ih)}
  const tx=ix?ix+23:0,available=b.w-tx-27;
  let size=opts.captionsOn?Math.min(40,b.h*.42):g.nodes.length===1?58:b.w<190?32:Math.max(32,Math.min(49,b.w/Math.max(5,n.label.length*.52)));
  size=Math.max(22,size);c.fillStyle=col.ink;c.textAlign='center';c.textBaseline='middle';
  const bits=display.split(/\s+/),lines=[];let line='';for(const word of bits){const next=line?line+' '+word:word;c.font='700 '+size+'px Hind,Arial,sans-serif';if(line&&c.measureText(next).width>available){lines.push(line);line=word}else line=next}if(line)lines.push(line);
  while(size>22&&lines.some(v=>{c.font='700 '+size+'px Hind,Arial,sans-serif';return c.measureText(v).width>available}))size-=2;
  c.font='700 '+size+'px Hind,Arial,sans-serif';for(let j=0;j<Math.min(2,lines.length);j++)c.fillText(lines[j],tx+(b.w-tx)/2,b.h/2+(j-(Math.min(2,lines.length)-1)/2)*size*1.15,available);c.restore()}
 c.restore();return true}
root.SceneGraph={fromText,validate,lint,render,boxes,layouts:LAYOUTS,contrast};
})(window);
