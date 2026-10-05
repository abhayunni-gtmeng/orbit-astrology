import test from 'node:test';
import assert from 'node:assert/strict';
import * as A from 'astronomy-engine';
import {birthInstant,calculateNatal,ascendant,houseFor} from '../shared/natal.mjs';
import {comparePosition} from '../shared/natal.mjs';
import {nasaResultUrl} from '../public/result-sources.mjs';
test('per-result comparison and NASA links use the requested body and date',()=>{
 const c=comparePosition('Moon','2026-10-04',106.5871517);assert.ok(c.difference<0.05);assert.equal(c.source,'Astronomy Engine');
 const url=new URL(nasaResultUrl('Moon','2026-12-31'));assert.equal(url.searchParams.get('COMMAND'),"'301'");assert.equal(url.searchParams.get('START_TIME'),"'2026-12-31'");assert.equal(url.searchParams.get('STOP_TIME'),"'2027-01-01'");
});
import {personalTransits,personalizeWeek} from '../shared/transits.mjs';
import {angularDistance,makeWeek} from '../shared/reading.mjs';
const input={date:'2000-01-01',time:'12:00',timezone:'Asia/Kolkata',latitude:19.076,longitude:72.8777};
test('action, reflection and review are present with or without natal contacts',()=>{
 const natal=calculateNatal(input),sky={days:Array.from({length:7},(_,i)=>({date:`2026-10-${String(i+4).padStart(2,'0')}`,positions:[{name:'Sun',longitude:natal.planets[0].longitude}]}))};
 const base=makeWeek('Capricorn',sky),personal=personalizeWeek(base,sky,natal);
 for(const week of [base,personal]){assert.ok(week.days.every(d=>d.tryThis&&d.question&&d.review));assert.ok(week.categories.every(c=>c.action&&c.question));}
 assert.notEqual(base.days[0].tryThis,personal.days[0].tryThis);assert.ok(personal.days[0].guidanceBasis.includes('whole-sign house'));assert.equal(personal.milestones[0].day,personal.days[0]);
});
test('historical timezone conversion and invalid or ambiguous dates',()=>{
 assert.equal(birthInstant(input).utc.toISOString(),'2000-01-01T06:30:00.000Z');
 assert.equal(birthInstant({...input,date:'2000-07-01',timezone:'Europe/London'}).offset,'+01:00');
 assert.equal(birthInstant({...input,timezone:'Europe/London'}).offset,'+00:00');
 for(const [date,time] of [['2024-03-10','02:30'],['2024-11-03','01:30'],['2024-02-30','12:00']])assert.throws(()=>birthInstant({...input,date,time,timezone:'America/New_York'}));
 assert.throws(()=>calculateNatal({...input,latitude:70}));
});
test('rising sign lies on the eastern geometric horizon across dates and hemispheres',()=>{
 for(const latitude of [-60,-20,0,30,60])for(const longitude of [-150,0,80]){
  const date=new Date('2000-01-01T06:30:00Z'),angle=ascendant(date,latitude,longitude)*Math.PI/180,time=A.MakeTime(date);
  const vector=A.RotateVector(A.Rotation_ECT_EQD(time),new A.Vector(Math.cos(angle),Math.sin(angle),0,time));
  const eq=A.EquatorFromVector(vector),h=A.Horizon(time,new A.Observer(latitude,longitude,0),eq.ra,eq.dec);
  assert.ok(Math.abs(h.altitude)<1e-7);assert.ok(h.azimuth>0&&h.azimuth<180);
 }
});
test('planet positions agree with NASA/JPL October 4 2026 fixtures within 0.05 degrees',()=>{
 const fixtures={Sun:190.7896639,Moon:106.5871517,Mercury:214.5554146,Venus:218.4816963,Mars:123.42789};
 for(const [name,longitude] of Object.entries(fixtures)){const p=A.Ecliptic(A.GeoVector(name,new Date('2026-10-04T00:00:00Z'),true));assert.ok(angularDistance(p.elon,longitude)<0.05,`${name}: ${p.elon}`);}
});
test('time affects ascendant, ten natal planets and twelve whole-sign houses are returned',()=>{
 const chart=calculateNatal(input),later=calculateNatal({...input,time:'18:00'});
 assert.equal(chart.planets.length,10);assert.equal(chart.houses.length,12);assert.notEqual(chart.ascendant.sign,later.ascendant.sign);assert.equal(houseFor(359,0),12);assert.equal(houseFor(0,359),2);
 assert.ok(chart.planets.every(p=>Number.isFinite(p.longitude)&&p.house>=1&&p.house<=12));
});
test('personal contacts use natal points, exact 3 degree orb and graceful unavailable sky',()=>{
 const natal=calculateNatal(input),sun=natal.planets[0].longitude;
 assert.ok(personalTransits({date:'2026-10-04',positions:[{name:'Sun',longitude:sun+3}]},natal).some(t=>t.target==='Sun'&&t.type==='conjunction'));
 assert.ok(!personalTransits({date:'2026-10-04',positions:[{name:'Sun',longitude:sun+3.01}]},natal).some(t=>t.target==='Sun'&&t.type==='conjunction'));
 const sky={status:'unavailable',days:Array.from({length:7},()=>({date:'2026-10-04',positions:[]}))},week=makeWeek('Capricorn',sky);
 assert.equal(personalizeWeek(week,sky,null),week);assert.equal(personalizeWeek(week,sky,natal).contacts.length,0);
});

import {explainNatal,natalExplanationText} from '../shared/reading.mjs';
test('personality follows calculated placements and remains separate from weekly data',()=>{
 const chart=calculateNatal(input),portrait=explainNatal(chart);
 assert.equal(portrait.bigThree[0].sign,chart.planets.find(p=>p.name==='Sun').sign);
 assert.equal(portrait.bigThree[1].sign,chart.planets.find(p=>p.name==='Moon').sign);
 assert.equal(portrait.bigThree[2].sign,chart.ascendant.sign);
 assert.equal(portrait.placements.length,8);
 const later=calculateNatal({...input,time:'18:00'});
 assert.notEqual(explainNatal(later).summary,portrait.summary);
 for(const p of portrait.placements)assert.ok(p.text.includes(`house ${p.house}`));
 assert.ok(portrait.placements.find(p=>p.name==='Pluto').text.includes('generation'));
 assert.ok(natalExplanationText(chart).includes(portrait.summary));
 assert.ok(natalExplanationText(chart).includes('Mars in '+chart.planets.find(p=>p.name==='Mars').sign));
 assert.equal(explainNatal(null),null);assert.equal(natalExplanationText(null),'');
});
