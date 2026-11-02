export const MODES={sinal:{name:'Sinal',size:4,symbols:6,limit:8},ruido:{name:'Ruído',size:5,symbols:7,limit:10}};
export const SYMBOLS=[{id:0,glyph:'●',name:'Círculo'},{id:1,glyph:'▲',name:'Triângulo'},{id:2,glyph:'■',name:'Quadrado'},{id:3,glyph:'◆',name:'Losango'},{id:4,glyph:'✚',name:'Cruz'},{id:5,glyph:'═',name:'Igual'},{id:6,glyph:'✳',name:'Estrela'}];
export function normalizeSeed(value){const n=Number(value);return Number.isFinite(n)?Math.max(1,Math.min(999999,Math.trunc(n))):1;}
export function create(mode='sinal',seed=137){if(!MODES[mode])mode='sinal';seed=normalizeSeed(seed);let state=(seed^(mode==='ruido'?0x2ab799:0x7a221))>>>0;
 const secret=Array.from({length:MODES[mode].size},()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return Math.floor(state/4294967296*MODES[mode].symbols);});
 return {mode,seed,secret,history:[],status:'playing'};}
export function feedback(secret,guess){let exact=0;const a=Array(7).fill(0),b=Array(7).fill(0);for(let i=0;i<secret.length;i++){if(secret[i]===guess[i])exact++;else{a[secret[i]]++;b[guess[i]]++;}}return {exact,misplaced:a.reduce((n,count,i)=>n+Math.min(count,b[i]),0)};}
export function submit(game,guess){const cfg=MODES[game.mode];if(game.status!=='playing')return {game,error:'Esta rodada já terminou.'};
 if(!Array.isArray(guess)||guess.length!==cfg.size||guess.some(n=>!Number.isInteger(n)||n<0||n>=cfg.symbols))return {game,error:'Preencha todas as posições antes de transmitir.'};
 if(game.history.some(h=>h.guess.every((n,i)=>n===guess[i])))return {game,error:'Essa sequência já foi testada. Experimente outra.'};
 const result=feedback(game.secret,guess),history=[...game.history,{guess:[...guess],...result}],status=result.exact===cfg.size?'won':history.length>=cfg.limit?'lost':'playing';
 return {game:{...game,history,status},error:null};
}
export function blank(){return {version:1,sound:false,motion:false,stats:{sinal:{played:0,wins:0,best:null},ruido:{played:0,wins:0,best:null}}};}
export function readSave(raw){try{const s=JSON.parse(raw||'null');if(s?.version!==1||typeof s.sound!=='boolean'||typeof s.motion!=='boolean')return blank();
 for(const mode of Object.keys(MODES)){const t=s.stats?.[mode];if(!t||!Number.isInteger(t.played)||t.played<0||t.played>1000000||!Number.isInteger(t.wins)||t.wins<0||t.wins>t.played||(t.best!==null&&(!Number.isInteger(t.best)||t.best<1||t.best>MODES[mode].limit))||(t.wins===0&&t.best!==null)||(t.wins>0&&t.best===null))return blank();}
 return {version:1,sound:s.sound,motion:s.motion,stats:{sinal:{...s.stats.sinal},ruido:{...s.stats.ruido}}};}catch{return blank();}}
export function record(save,game){if(!['won','lost'].includes(game.status))return save;const old=save.stats[game.mode],win=game.status==='won';return {...save,stats:{...save.stats,[game.mode]:{played:Math.min(1000000,old.played+1),wins:Math.min(1000000,old.wins+(win?1:0)),best:win?Math.min(old.best??Infinity,game.history.length):old.best}}};}
