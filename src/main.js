import Alpine from '@alpinejs/csp';
import {create,submit,MODES,SYMBOLS,readSave,record,normalizeSeed} from './game.js';
import './style.css';
Alpine.data('cifra',()=>({
 game:create(),draft:Array(4).fill(null),selected:0,seedInput:'137',save:readSave(null),paused:false,modal:'',message:'Escolha símbolos. Eles podem se repetir.',audio:null,voices:0,
 init(){try{this.save=readSave(localStorage.getItem('cifra.save.v1'));}catch{}this._blur=()=>{if(!this.paused&&this.game.status==='playing')this.open('pause');};this._visibility=()=>{if(document.hidden)this._blur();};window.addEventListener('blur',this._blur);document.addEventListener('visibilitychange',this._visibility);},
 destroy(){window.removeEventListener('blur',this._blur);document.removeEventListener('visibilitychange',this._visibility);this.audio?.close();},
 get cfg(){return MODES[this.game.mode];},get keys(){return SYMBOLS.slice(0,this.cfg.symbols);},get playing(){return this.game.status==='playing'&&!this.paused;},get ended(){return this.game.status!=='playing';},get canSend(){return this.playing&&this.draft.every(n=>n!==null);},
 get statusTitle(){return this.game.status==='won'?'Sinal decifrado.':this.game.status==='lost'?'O sinal escapou.':'O que você consegue deduzir?';},
 get remaining(){return this.cfg.limit-this.game.history.length;},get serial(){return String(this.game.seed).padStart(6,'0');},get currentStats(){return this.save.stats[this.game.mode];},
 get statText(){const s=this.currentStats;return `${s.played} ${s.played===1?'rodada':'rodadas'} · ${s.wins} ${s.wins===1?'vitória':'vitórias'} · melhor: ${s.best===null?'—':s.best+(s.best===1?' tentativa':' tentativas')}`;},
 get slots(){return this.draft.map((n,index)=>({index,glyph:n===null?'·':SYMBOLS[n].glyph,label:`Posição ${index+1}: ${n===null?'vazia':SYMBOLS[n].name}`,number:String(index+1).padStart(2,'0')}));},
 get rows(){return this.game.history.map((row,index)=>({number:String(index+1).padStart(2,'0'),symbols:row.guess.map((n,i)=>({glyph:SYMBOLS[n].glyph,name:SYMBOLS[n].name,key:i})),exact:row.exact,misplaced:row.misplaced,description:`Tentativa ${index+1}: ${row.guess.map(n=>SYMBOLS[n].name).join(', ')}. ${row.exact} exatos e ${row.misplaced} fora de posição.`}));},
 get revealed(){return this.ended?this.game.secret.map(n=>SYMBOLS[n].glyph).join(' '):'— — — —';},
 slotClass(slot){return slot.index===this.selected?'slot active':'slot';},keyLabel(symbol){return `${symbol.id+1} — ${symbol.name}`;},keyId(symbol){return 'key-'+symbol.id;},
 persist(){try{localStorage.setItem('cifra.save.v1',JSON.stringify(this.save));}catch{}},
 start(mode=this.game.mode,seed=this.seedInput){this.game=create(mode,seed);this.seedInput=String(this.game.seed);this.draft=Array(this.cfg.size).fill(null);this.selected=0;this.message='Novo sinal. Construa sua primeira hipótese.';this.$nextTick(()=>{this.$refs.tape.scrollLeft=0;});},
 changeMode(event){this.start(event.target.value,this.game.seed);},repeat(){this.start(this.game.mode,this.game.seed);},tune(){this.start(this.game.mode,this.seedInput);},
 newSignal(){let seed;try{const a=new Uint32Array(1);crypto.getRandomValues(a);seed=a[0]%999999+1;}catch{seed=normalizeSeed(Date.now()%999999);}if(seed===this.game.seed)seed=seed===999999?1:seed+1;this.start(this.game.mode,seed);},
 select(index){if(this.playing)this.selected=index;},
 choose(n){if(!this.playing||!Number.isInteger(n)||n<0||n>=this.cfg.symbols)return;const d=[...this.draft];d[this.selected]=n;this.draft=d;this.selected=(this.selected+1)%this.cfg.size;this.tone(false);},
 erase(){if(!this.playing)return;const d=[...this.draft];if(d[this.selected]===null)this.selected=(this.selected-1+this.cfg.size)%this.cfg.size;d[this.selected]=null;this.draft=d;},
 clear(){if(!this.playing)return;this.draft=Array(this.cfg.size).fill(null);this.selected=0;},
 send(){if(!this.playing)return;const result=submit(this.game,this.draft);if(result.error){this.message=result.error;return;}this.game=result.game;const row=this.game.history.at(-1);this.message=`Tentativa ${this.game.history.length}: ${row.exact} exatos, ${row.misplaced} certos fora de posição. Os marcadores não correspondem a posições específicas.`;
  if(this.ended){this.save=record(this.save,this.game);this.persist();this.message=this.game.status==='won'?`Código encontrado em ${this.game.history.length} ${this.game.history.length===1?'tentativa':'tentativas'}.`:'As tentativas terminaram. O código está revelado abaixo.';}else{this.draft=Array(this.cfg.size).fill(null);this.selected=0;}
  this.tone(this.ended);this.$nextTick(()=>{const tape=this.$refs.tape;tape.scrollTo({left:tape.scrollWidth,behavior:this.save.motion||matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});},
 key(e){if(e.target.matches('input,select')||this.paused)return;if(e.key==='Enter'&&e.target.closest('button'))return;const n=Number(e.key);if(/^[1-7]$/.test(e.key)){e.preventDefault();this.choose(n-1);}else if(e.key==='Enter'){e.preventDefault();this.send();}else if(e.key==='Backspace'){e.preventDefault();this.erase();}else if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();if(this.playing)this.selected=(this.selected+(e.key==='ArrowRight'?1:-1)+this.cfg.size)%this.cfg.size;}else if(e.key.toLowerCase()==='p'){e.preventDefault();this.open('pause');}},
 open(kind){if(this.paused)return;this.paused=true;this.modal=kind;this.$nextTick(()=>this.$refs.dialog.showModal());},resume(){this.$refs.dialog.close();this.paused=false;this.modal='';this.$nextTick(()=>this.$refs.console.focus());},
 toggle(type){this.save={...this.save,[type]:!this.save[type]};this.persist();if(type==='sound')this.tone(false);},
 tone(end){if(!this.save.sound||this.voices>=4)return;try{this.audio??=new AudioContext();void this.audio.resume();const o=this.audio.createOscillator(),g=this.audio.createGain();o.type='sine';o.frequency.value=end?523:180+this.selected*40;g.gain.setValueAtTime(.025,this.audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,this.audio.currentTime+.1);o.connect(g).connect(this.audio.destination);this.voices++;o.onended=()=>{o.disconnect();g.disconnect();this.voices--;};o.start();o.stop(this.audio.currentTime+.12);}catch{}},
 previous(){this.$refs.tape.scrollBy({left:-240,behavior:'instant'});},latest(){this.$refs.tape.scrollTo({left:this.$refs.tape.scrollWidth,behavior:'instant'});}
}));
Alpine.start();
