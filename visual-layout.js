/* Source-grounded word selection and motion profile; rendering stays in the five original style modules. */
(function(root){'use strict';
const pace=()=>document.getElementById('motion')?.value==='standard'?'standard':'calm';
function keyword(text,lookup){for(const word of String(text||'').split(/[\s,.;:!?।]+/))if(word&&lookup(word)>=0)return word;return ''}
const progress=(elapsed,duration)=>{const d=pace()==='calm'?Math.min(1.8,Math.max(.85,duration*.58)):Math.min(.55,Math.max(.22,duration*.2));const p=Math.max(0,Math.min(1,elapsed/d));return p*p*(3-2*p)};
root.VisualLayout={pace,keyword,progress};
})(window);
