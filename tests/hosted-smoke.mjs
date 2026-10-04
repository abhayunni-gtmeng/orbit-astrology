import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
const call=(path,options)=>worker.fetch(new Request('https://orbit.example'+path,options));
for(const path of ['/','/calculations','/app.mjs','/shared/reading.mjs','/situations-v1.png']){const r=await call(path);assert.equal(r.status,200);assert.ok((await r.arrayBuffer()).byteLength>0);}
const input={date:'2000-01-01',time:'12:00',timezone:'Asia/Kolkata',latitude:19.076,longitude:72.8777};
const natal=await call('/api/natal',{method:'POST',headers:{origin:'https://orbit.example','content-type':'application/json'},body:JSON.stringify(input)});assert.equal(natal.status,200);assert.equal((await natal.json()).planets.length,10);assert.equal(natal.headers.get('cache-control'),'no-store');
assert.equal((await call('/api/natal',{method:'POST',headers:{origin:'https://wrong.example'},body:JSON.stringify(input)})).status,403);
assert.equal((await call('/api/natal',{method:'POST',body:'x'.repeat(5000)})).status,413);
assert.equal((await call('/api/sky?date=invalid')).status,400);
const originalFetch=globalThis.fetch;
globalThis.fetch=async url=>String(url).includes('geocoding')?Response.json({results:[{name:'Mumbai',country:'India',latitude:19,longitude:73,timezone:'Asia/Kolkata'}]}):Response.json({signature:{version:'1.2'},result:'$$SOE\n'+Array.from({length:8},()=> '2026-Oct-05 00:00, , , 106.5871517, 3.4960305,').join('\n')+'\n$$EOE'});
try{const sky=await call('/api/sky');assert.equal(sky.status,200);const data=await sky.json();assert.equal(data.days.length,7);assert.ok(data.days.every(d=>d.positions.length===5&&d.positions.every(p=>Number.isFinite(p.comparison.longitude))));assert.equal((await (await call('/api/places?q=Mumbai')).json()).results[0].timezone,'Asia/Kolkata');}finally{globalThis.fetch=originalFetch;}
console.log('Hosted smoke checks passed: assets, natal chart, HTTPS origin protection, body limit, sky comparisons and place lookup.');
