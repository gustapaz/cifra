import {create,MODES} from '../src/game.js';
const results=document.querySelector('#results'),frame=document.querySelector('#game');localStorage.setItem('cifra.save.v1','{bad');await new Promise(resolve=>{frame.addEventListener('load',resolve,{once:true});frame.src='/';});
const doc=frame.contentDocument,tick=()=>new Promise(r=>setTimeout(r,0)),text=s=>doc.querySelector(s).textContent,items=[];
const check=(name,ok)=>{if(!ok)throw Error(name);items.push(name);const li=document.createElement('li');li.textContent='PASS — '+name;results.append(li);};
const click=async s=>{const el=doc.querySelector(s);if(!el||el.disabled)throw Error('Missing/disabled '+s);el.click();await tick();};
const guess=async a=>{await click('#clear');for(const n of a)await click('#key-'+n);await click('#send');};
await tick();try{
check('corrupt save does not block fresh round',text('#remaining')==='8');
doc.querySelector('#console').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));await tick();check('incomplete keyboard send costs no turn',text('#remaining')==='8'&&text('#status').includes('Preencha'));
for(const key of ['1','2','3','4'])doc.querySelector('#console').dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));await tick();await click('#send');check('numeric keyboard composes and sends real hypothesis',text('#remaining')==='7');
await guess([0,1,2,3]);check('duplicate hypothesis costs no turn',text('#remaining')==='7'&&text('#status').includes('já foi testada'));
frame.contentWindow.dispatchEvent(new Event('blur'));await tick();check('blur opens pause',doc.querySelector('dialog').open);
const before=text('#remaining');doc.querySelector('#console').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));await tick();check('pause blocks keyboard and keeps state',text('#remaining')===before);
doc.querySelector('dialog').dispatchEvent(new Event('cancel',{cancelable:true}));await tick();check('cancel resumes without resetting history',!doc.querySelector('dialog').open&&text('#remaining')==='7');
for(const mode of ['sinal','ruido']){
 const select=doc.querySelector('#mode');select.value=mode;select.dispatchEvent(new Event('change',{bubbles:true}));await tick();
 await guess(create(mode,137).secret);check(mode+' wins via controls',text('#state-title')==='Sinal decifrado.');
 const saved=JSON.parse(localStorage.getItem('cifra.save.v1'));doc.querySelector('#console').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));await tick();check(mode+' result recorded once',JSON.parse(localStorage.getItem('cifra.save.v1')).stats[mode].played===saved.stats[mode].played);
 await click('#again');check(mode+' replay preserves mode and clears attempts',text('#remaining')===String(MODES[mode].limit));
 let n=0;for(let i=0;i<MODES[mode].limit;i++){let a;do{a=Array(MODES[mode].size).fill(0);a[0]=n%MODES[mode].symbols;a[1]=Math.floor(n/MODES[mode].symbols);n++;}while(a.every((v,j)=>v===create(mode,137).secret[j]));await guess(a);}
 check(mode+' loss reveals code after exact limit',text('#state-title')==='O sinal escapou.'&&text('#remaining')==='0'&&text('#reveal')!=='— — — —');
 await click('#again');
}
await click('#key-0');await click('#erase');check('backspace button clears previous slot',doc.querySelector('#slot-0').getAttribute('aria-label').includes('vazia'));
await click('#motion');await click('#sound');const s=JSON.parse(localStorage.getItem('cifra.save.v1'));check('preferences preserve isolated win/loss statistics',s.motion&&s.sound&&s.stats.sinal.played===2&&s.stats.ruido.played===2&&s.stats.sinal.wins===1);
await click('#new');check('new signal differs and starts clean',text('#remaining')==='10'&&doc.querySelector('#seed').value!=='137');
document.title='PASS '+items.length+' — Cifra';
}catch(e){const li=document.createElement('li');li.textContent='FAIL — '+String(e);results.append(li);document.title='FAIL — Cifra';}
