import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../public/app.mjs',import.meta.url),'utf8');
test('reading mode selector is removed',()=>{
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
