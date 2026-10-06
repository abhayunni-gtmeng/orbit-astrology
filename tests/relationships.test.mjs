import test from 'node:test';
import assert from 'node:assert/strict';
import {makeWeek,signs} from '../shared/reading.mjs';
import {relationshipReading} from '../shared/relationships.mjs';
const sky={days:[{date:'2026-10-06',positions:[{name:'Venus',longitude:220},{name:'Moon',longitude:100}]}]};
test('relationship predictions vary by sign and relationship status',()=>{
 for(const mode of ['single','situationship']){
  const readings=signs.map(sign=>relationshipReading(makeWeek(sign,sky),mode));
  for(const kind of ['good','bad'])assert.equal(new Set(readings.map(r=>r[kind].title)).size,12);
  assert.ok(readings.every(r=>r.bad.avoid&&r.bad.manage&&r.good.action&&r.note.includes('cannot reveal')));
 }
 const week=makeWeek('Aries',sky);
 assert.notDeepEqual(relationshipReading(week,'single'),relationshipReading(week,'situationship'));
 assert.deepEqual(relationshipReading(week),relationshipReading(week));
 assert.throws(()=>relationshipReading(week,'married'));
});
test('relationship basis follows natal contacts or calculated whole-sign house',()=>{
 const week=makeWeek('Aries',sky);week.natal={ascendant:{sign:'Libra'}};
 assert.equal(relationshipReading(week).good.sector,1);
 week.days[0].transits=[{target:'Venus',type:'trine',house:5,orb:1,date:'2026-10-06',title:'Moon trine natal Venus',basis:'Sampled contact'},{target:'Moon',type:'square',house:3,orb:2,date:'2026-10-06',title:'Mars square natal Moon',basis:'Sampled contact'}];
 const r=relationshipReading(week);assert.equal(r.good.sector,4);assert.equal(r.bad.sector,2);assert.match(r.good.basis,/Moon trine natal Venus/);
 const fallback=relationshipReading(makeWeek('Pisces',{days:[{date:'2026-10-06',positions:[]}]}));
 assert.match(fallback.good.basis,/unavailable/);assert.match(fallback.bad.basis,/not a calculated/);
});
