import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {signs,symbols,makeWeek,weeklyOutlook} from '../shared/reading.mjs';

const source=readFileSync(new URL('../public/app.mjs',import.meta.url),'utf8');
test('all-signs panel compares twelve general readings and resets closed',()=>{
 const el=(tag,text,className)=>({tag,textContent:text,className,children:[],attrs:{},append(...children){this.children.push(...children);},setAttribute(k,v){this.attrs[k]=v;}});
 const sky={days:Array.from({length:7},(_,i)=>({date:`2026-10-${10+i}`,positions:[{name:'Sun',longitude:190},{name:'Moon',longitude:100+i*14}]}))};
 const week=makeWeek('Aries',sky,'Balance');
 const context=vm.createContext({el,sky,week,signs,symbols,makeWeek,weeklyOutlook,fmt:date=>date,resultSources:(_,date)=>({tag:'sources',date})});
 vm.runInContext(source.slice(source.indexOf('function renderAllSigns('),source.indexOf('function renderLifeSections(){')),context);
 const panel=vm.runInContext('renderAllSigns()',context);
 assert.equal(panel.open,false);const cards=panel.children.at(-1).children;assert.equal(cards.length,12);
 assert.equal(new Set(cards.map(c=>c.children[1].children[1].textContent)).size,12);
 assert.equal(new Set(cards.map(c=>c.children[2].children[1].textContent)).size,12);
 assert.ok(cards[0].children[0].textContent.includes('Selected sign'));
 assert.equal(cards[0].children[1].children[1].textContent,weeklyOutlook(week).opportunities[0].title);
 panel.open=true;assert.equal(vm.runInContext('renderAllSigns()',context).open,false);
 context.sky={status:'unavailable',days:sky.days.map(d=>({...d,positions:[]}))};context.week=makeWeek('Aries',context.sky);
 const fallback=vm.runInContext('renderAllSigns()',context);
 assert.equal(fallback.children.at(-1).children.length,12);assert.match(fallback.children[2].textContent,/unavailable/);
 assert.ok(source.includes("document.querySelector('main').prepend(allSignsPanel)"));
 context.week=null;
 assert.equal(vm.runInContext("renderAllSigns(sky,makeWeek('Aries',sky))",context).children.at(-1).children.length,12);
});
test('birth chart has a dedicated leading section and resets without natal data',()=>{
 const el=(tag,text,className)=>({tag,textContent:text,className,children:[],append(...items){this.children.push(...items);},addEventListener(){}});
 const birthReading={children:[],replaceChildren(){this.children=[];},append(...items){this.children.push(...items);}};
 const context=vm.createContext({el,birthReading,week:null,sky:{},renderNatal:()=>({tag:'natal-result'})});
 vm.runInContext(source.slice(source.indexOf('function renderBirthReading(){'),source.indexOf('\nrenderBirthReading();')),context);
 vm.runInContext('renderBirthReading()',context);
 assert.equal(birthReading.children[0].children[3].textContent,'Read my birth chart ↗');
 context.week={natal:{}};vm.runInContext('renderBirthReading()',context);
 assert.equal(birthReading.children[0].tag,'natal-result');
 context.week={};vm.runInContext('renderBirthReading()',context);
 assert.equal(birthReading.children.length,1);
 assert.equal(birthReading.children[0].className,'birth-chart-invitation');
 assert.ok(source.includes("document.querySelector('.reading-heading').before(birthReading)"));
 assert.ok(!source.includes('weekly.append(renderNatal'));
});
test('reading mode selector is removed',()=>{
 assert.ok(source.includes('birthReading.before(leadingOutlook)'));
 assert.ok(source.includes('leadingOutlook.replaceChildren(renderOutlook())'));
 assert.ok(!source.includes('weekly.append(renderOutlook()'));
 assert.ok(!source.includes('modeBar'));
 assert.ok(!source.includes('mode-description'));
});
test('outlook cards start hidden, toggle independently, and reset on regeneration',()=>{
 const el=(tag,text,className)=>({tag,textContent:text,className,children:[],attrs:{},hidden:false,
  append(...children){this.children.push(...children);},
  setAttribute(key,value){this.attrs[key]=value;},
  addEventListener(event,handler){this[event]=handler;}});
 const context=vm.createContext({el,week:{},weeklyOutlook:()=>({note:'Test',opportunities:[],challenges:[]})});
 vm.runInContext(source.slice(source.indexOf('function renderOutlook(){'),source.indexOf('function renderLifeSections(){')),context);
 const cards=()=>vm.runInContext('renderOutlook()',context).children[2].children;
 const [good,bad]=cards();
 for(const card of [good,bad]){assert.equal(card.children[2].hidden,true);assert.equal(card.children[3].attrs['aria-expanded'],'false');}
 good.children[3].click();
 assert.equal(good.children[2].hidden,false);
 assert.equal(good.children[3].attrs['aria-expanded'],'true');
 assert.equal(bad.children[2].hidden,true);
 bad.children[3].click();assert.equal(bad.children[2].hidden,false);
 good.children[3].click();assert.equal(good.children[2].hidden,true);
 assert.equal(bad.children[2].hidden,false);
 for(const card of cards())assert.equal(card.children[2].hidden,true);
});
