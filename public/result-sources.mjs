const ids={Sun:'10',Moon:'301',Mercury:'199',Venus:'299',Mars:'499'};
export function nasaResultUrl(name,date){
 const stop=new Date(Date.parse(date+'T00:00:00Z')+86400000).toISOString().slice(0,10);
 const params=new URLSearchParams({format:'json',COMMAND:`'${ids[name]}'`,CENTER:"'500@399'",START_TIME:`'${date}'`,STOP_TIME:`'${stop}'`,STEP_SIZE:"'1 d'",QUANTITIES:"'31'",CSV_FORMAT:"'YES'",OBJ_DATA:"'NO'"});
 return 'https://ssd.jpl.nasa.gov/api/horizons.api?'+params;
}
export function resultSources(sky,date,names=Object.keys(ids)){
 const box=document.createElement('details');box.className='result-sources';
 const summary=document.createElement('summary');summary.textContent='Source data & independent calculation';box.append(summary);
 const text=value=>{const p=document.createElement('p');p.textContent=value;box.append(p);};
 const link=(label,url)=>{const a=document.createElement('a');a.textContent=label+' ↗';a.href=url;a.target='_blank';a.rel='noopener noreferrer';box.append(a);};
 link('View calculation page','/calculations?date='+encodeURIComponent(date)+(names.length===1?'#'+names[0].toLowerCase():''));
 const day=sky?.days.find(d=>d.date===date);
 text(`${date} · 00:00 UTC · geocentric, tropical ecliptic longitude. Raw NASA links include the following boundary day; compare the first row.`);
 for(const name of names){
  if(!ids[name])continue;const p=day?.positions.find(p=>p.name===name);
  link(`${name}: NASA data`,nasaResultUrl(name,date));
  if(p){text(`${name} · NASA: ${p.longitude.toFixed(5)}°${p.comparison?` · Astronomy Engine: ${p.comparison.longitude.toFixed(5)}° · difference: ${p.comparison.difference.toFixed(5)}°`:' · independent calculation unavailable in this response.'}`);}else text(`${name}: no retrieved position available for this result.`);
 }
 link('Astronomy Engine: calculation implementation','https://github.com/cosinekitty/astronomy');
 link('Astrodienst: external ephemeris tables','https://www.astro.com/swisseph/swepha_e.htm');
 text('Astronomy Engine is a separate calculation, not independent observational evidence. Astrodienst tables are a manual cross-check, not fetched here. Agreement on positions does not validate astrological advice.');
 return box;
}
