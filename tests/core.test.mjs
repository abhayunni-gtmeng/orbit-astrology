import test from 'node:test';import assert from 'node:assert/strict';import {zodiac,makeReading,signs} from '../shared/reading.mjs';import {parseHorizons} from '../shared/horizons.mjs';
import {angularDistance,findAspects,makeWeek} from '../shared/reading.mjs';
import {weeklyOutlook} from '../shared/reading.mjs';
import {featureCopy} from '../shared/reading.mjs';
test('headline card changes for each mode before and after generation',()=>{
 const modes=['reflective','prescriptive','both'];
 assert.equal(new Set(modes.map(m=>featureCopy(m).title)).size,3);
 const day={date:'2026-10-04',focus:'Work',title:'Say what matters',question:'What needs clarity?',tryThis:'Ask one clarifying question.'};
 assert.equal(featureCopy('reflective',day).copy,day.question);
 assert.equal(featureCopy('prescriptive',day).copy,day.tryThis);
 assert.ok(featureCopy('both',day).copy.includes(day.tryThis)&&featureCopy('both',day).copy.includes(day.question));
 assert.equal(new Set(modes.map(m=>featureCopy(m,day).title)).size,3);
});
test('weekly outlook offers sourced opportunities and cautions even in fallback mode',()=>{
 const sky={status:'unavailable',days:Array.from({length:7},(_,i)=>({date:`2026-10-${i+10}`,positions:[]}))};
 const outlook=weeklyOutlook(makeWeek('Aries',sky));
 assert.equal(outlook.opportunities.length,2);assert.equal(outlook.challenges.length,2);
 assert.ok(outlook.challenges.every(c=>c.avoid&&c.manage&&c.avoid!==c.manage));
 assert.equal(outlook.opportunities[0].title,'Reconnect with someone');
 assert.ok([...outlook.opportunities,...outlook.challenges].every(x=>x.text&&x.action&&x.reflection&&x.basis));
 assert.ok(outlook.opportunities.every(x=>x.basis.includes('unavailable')));assert.ok(outlook.note.includes('not reports or predictions'));
});
test('aspect angles wrap and honor the inclusive 3 degree tolerance',()=>{assert.equal(angularDistance(359,1),2);assert.equal(angularDistance(10,190),180);for(const [angle,type] of [[0,'conjunction'],[60,'sextile'],[90,'square'],[120,'trine'],[180,'opposition']])assert.equal(findAspects([{name:'A',longitude:0},{name:'B',longitude:angle}])[0].type,type);assert.equal(findAspects([{name:'A',longitude:359},{name:'B',longitude:2}]).length,1);assert.equal(findAspects([{name:'A',longitude:359},{name:'B',longitude:2.1}]).length,0);});
test('richer week includes five categories, seven distinct daily narratives and auditable aspects',()=>{const sky={days:Array.from({length:7},(_,i)=>({date:`2026-10-${i+10}`,positions:[{name:'Sun',longitude:190},{name:'Moon',longitude:100+i*14},{name:'Venus',longitude:220},{name:'Mercury',longitude:221},{name:'Mars',longitude:123}]}))};const week=makeWeek('Libra',sky,'Love');assert.equal(week.categories.length,5);assert.equal(week.milestones.length,3);assert.equal(new Set(week.days.map(d=>d.detail)).size,7);assert.ok(week.highlights.some(a=>a.a==='Venus'&&a.b==='Mercury'));assert.ok(week.categories.every(c=>c.text.length>150&&c.basis.includes('relative to Libra')));assert.ok(week.days.every(d=>d.question&&d.watchFor&&d.detail));});
test('weekly outage never claims a transit or aspect',()=>{const week=makeWeek('Pisces',{status:'unavailable',days:Array.from({length:7},()=>({date:'2026-10-04',positions:[]}))});assert.equal(week.highlights.length,0);assert.ok(week.overview.includes('unavailable'));assert.ok(week.categories.every(c=>c.basis.includes('unavailable')));assert.throws(()=>makeWeek('Pisces',{days:[]}));});
test('zodiac wraps correctly at boundaries',()=>{assert.equal(zodiac(0),'Aries');assert.equal(zodiac(30),'Taurus');assert.equal(zodiac(359.9),'Pisces');assert.equal(zodiac(360),'Aries');assert.equal(zodiac(-1),'Pisces');});
test('all signs get seven deterministic readings informed by lunar positions',()=>{const sky={days:Array.from({length:7},(_,i)=>({date:`2026-10-${String(i+4).padStart(2,'0')}`,positions:[{name:'Moon',longitude:100+i*14}]}))};for(const s of signs){assert.equal(makeReading(s,sky).length,7);assert.deepEqual(makeReading(s,sky),makeReading(s,sky));}assert.notDeepEqual(makeReading('Aries',sky),makeReading('Taurus',sky));assert.throws(()=>makeReading('bad',sky));});
test('fallback never invents moon positions',()=>{assert.equal(makeReading('Aries',{days:[{date:'2026-10-04',positions:[]} ]})[0].moon,null);});
test('parse NASA format and reject bad data/version',()=>{const result='$$SOE\n'+Array.from({length:8},()=> '2026-Oct-04 00:00, , , 106.5871517, 3.4960305,').join('\n')+'\n$$EOE';assert.equal(parseHorizons({signature:{version:'1.2'},result})[0].longitude,106.5871517);assert.equal(parseHorizons({signature:{version:'1.3'},result}).length,7);assert.throws(()=>parseHorizons({signature:{version:'9'},result}));assert.throws(()=>parseHorizons({signature:{version:'1.2'},result:'bad'}));});
