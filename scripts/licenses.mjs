import {readFileSync,writeFileSync} from 'node:fs';
let notices='Cifra — third-party notices\n\n';
for(const name of ['@alpinejs/csp','@vue/reactivity','@vue/shared']){const root='node_modules/'+name+'/',pkg=JSON.parse(readFileSync(root+'package.json','utf8'));notices+=name+' '+pkg.version+'\n'+readFileSync(name==='@alpinejs/csp'?'vendor-licenses/alpine-MIT.txt':root+'LICENSE','utf8')+'\n\n';}
writeFileSync('public/third-party.txt',notices.replace(/\r\n/g,'\n').trimEnd()+'\n');
