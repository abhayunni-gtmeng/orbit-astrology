import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../public/app.mjs',import.meta.url),'utf8');
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
