import {zodiac,findAspects,signs} from '/shared/reading.mjs';
import {nasaResultUrl} from '/result-sources.mjs';
const $=id=>document.getElementById(id),node=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e;};
const query=new URLSearchParams(location.search),date=query.get('date')||new Date().toISOString().slice(0,10);
function skyDiagram(day){
 const section=node('section','');section.className='calculation-card';section.append(node('h2','Where the planets sit in the zodiac'));
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 600 600');svg.setAttribute('class','sky-diagram');svg.setAttribute('role','img');svg.setAttribute('aria-label','Earth-centered zodiac longitude diagram for '+day.date+'. Numbered markers correspond to the planetary legend below.');
 const add=(tag,attrs,text)=>{const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));if(text)e.textContent=text;svg.append(e);return e;};
 const xy=(angle,r)=>[300+r*Math.cos(angle*Math.PI/180),300-r*Math.sin(angle*Math.PI/180)];
 add('circle',{cx:300,cy:300,r:240,fill:'#f0f3e6',stroke:'#9cab91'});add('circle',{cx:300,cy:300,r:180,fill:'none',stroke:'#d3dcc9'});
 signs.forEach((sign,i)=>{const [x,y]=xy(i*30,240);add('line',{x1:300,y1:300,x2:x,y2:y,stroke:'#d3dcc9'});const [tx,ty]=xy(i*30+15,267);add('text',{x:tx,y:ty,'text-anchor':'middle','dominant-baseline':'middle','font-size':13,fill:'#304b3b'},sign);});
 const colors=['#88621d','#365d80','#7f4c73','#49794e','#ab503c'];
 day.positions.forEach((p,i)=>{const [x,y]=xy(p.longitude,120+i*23);add('line',{x1:300,y1:300,x2:x,y2:y,stroke:colors[i],'stroke-width':2});add('circle',{cx:x,cy:y,r:12,fill:colors[i]});add('text',{x,y:y+4,'text-anchor':'middle','font-size':12,fill:'white'},String(i+1));});
 add('circle',{cx:300,cy:300,r:16,fill:'#24392f'});add('text',{x:300,y:329,'text-anchor':'middle','font-size':12,fill:'#24392f'},'Earth');section.append(svg);
 day.positions.forEach((p,i)=>section.append(node('p',`${i+1}. ${p.name} · ${zodiac(p.longitude)} ${(p.longitude%30).toFixed(2)}° · longitude ${p.longitude.toFixed(2)}°`)));
 section.append(node('p','Positions use the NASA snapshot. Angle increases counterclockwise from 0° Aries at the right. Marker radii are staggered only for readability: this is not an orbital-distance map, constellation map or natal-house wheel.'));return section;
}
$('calculation-date').textContent=date+' · 00:00 UTC · Earth-centered tropical ecliptic-of-date coordinates';
try{
 const response=await fetch('/api/sky?date='+encodeURIComponent(date),{cache:'no-store'});if(!response.ok)throw Error('Planetary data unavailable for this date. Return to the reading and retry.');
 const sky=await response.json(),day=sky.days[0];
 $('calculations').append(skyDiagram(day));
 $('calculation-status').textContent='NASA retrieved '+new Date(sky.fetchedAt).toLocaleString()+'. Separate calculation: Astronomy Engine. Values are rounded for display; differences use unrounded values.';
 for(const p of day.positions){
  const card=node('section','');card.className='calculation-card';card.id=p.name.toLowerCase();card.append(node('h2',p.name));
  const wrap=node('div','');wrap.className='table-wrap';const table=node('table','');
  for(const [label,value] of [['Calculation','Longitude'],['NASA/JPL Horizons',p.longitude.toFixed(6)+'°'],['Astronomy Engine',p.comparison?p.comparison.longitude.toFixed(6)+'°':'Unavailable'],['Absolute angular difference',p.comparison?p.comparison.difference.toFixed(6)+'°':'Unavailable']]){const row=node('tr','');row.append(node('th',label),node('td',value));table.append(row);}wrap.append(table);card.append(wrap);
  card.append(node('p',`Zodiac calculation: floor(${p.longitude.toFixed(6)} / 30) = ${Math.floor(p.longitude/30)} → ${zodiac(p.longitude)}. Degrees within sign: ${p.longitude.toFixed(6)} mod 30 = ${(p.longitude%30).toFixed(6)}°.`));
  card.append(node('p',`Separate calculation: Ecliptic(GeoVector('${p.name}', '${date}T00:00:00Z', true)).elon. GeoVector includes light-travel time and aberration; Ecliptic converts to true ecliptic-of-date coordinates. This is a separate software calculation, not independent observational evidence.`));
  const a=node('a','Open NASA input/output for this result ↗');a.href=nasaResultUrl(p.name,date);a.target='_blank';a.rel='noopener noreferrer';card.append(a);$('calculations').append(card);
 }
 const aspects=node('section','');aspects.className='calculation-card';aspects.append(node('h2','Major aspects at this snapshot'));
 const matches=findAspects(day.positions);for(const a of matches)aspects.append(node('p',`${a.a} ${a.type} ${a.b}: separation ${a.separation.toFixed(6)}°, target ${a.angle}°, orb ${a.orb.toFixed(6)}° ≤ 3°.`));if(!matches.length)aspects.append(node('p','None within the selected 3° tolerance.'));$('calculations').append(aspects);
 const target=day.positions.find(p=>p.name.toLowerCase()===location.hash.slice(1));if(target)$(target.name.toLowerCase()).scrollIntoView();
}catch(error){$('calculation-status').textContent=error.message;}
