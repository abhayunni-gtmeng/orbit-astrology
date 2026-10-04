import {resultSources} from '/result-sources.mjs';
const $=id=>document.getElementById(id);
const node=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e;};
export function setupBirthForm(){
 const box=document.createElement('div');box.innerHTML=`<label class="unknown-time"><input id="use-natal" type="checkbox"> Personalize with my birth chart</label><div id="birth-place-fields" hidden><label for="birthplace">BIRTHPLACE</label><input id="birthplace" placeholder="City or town" autocomplete="off"><button type="button" id="find-place">Find birthplace</button><p id="place-status" class="field-note" role="status"></p><label for="place-results">MATCHING PLACES</label><select id="place-results"><option value="">Choose a place after searching</option></select><details><summary>Coordinates & timezone · check or enter manually</summary><label for="latitude">LATITUDE (−66 to 66)</label><input id="latitude" type="number" step="any" min="-66" max="66"><label for="longitude">LONGITUDE (east positive)</label><input id="longitude" type="number" step="any" min="-180" max="180"><label for="timezone">BIRTHPLACE TIMEZONE</label><input id="timezone" placeholder="e.g. Asia/Kolkata"></details><p class="field-note">Place search uses Open-Meteo / GeoNames. Historical timezone rules are applied to your birth date. Check the location and timezone against your birth record.</p></div>`;
 $('birth-time-note').before(box);
 $('birth-time-note').textContent='Exact date, local birth time and birthplace calculate your rising sign and whole-sign houses. Unknown time uses a sun-sign reading, without inventing a rising sign. Supported birth years: 1900 onward; latitudes: 66°S–66°N.';
 document.querySelector('.privacy').textContent='No account or saved profile. Birth details are processed by Orbit’s server and are not saved as a profile. Place searches go to Open-Meteo; your name stays in the tab.';
 const sync=()=>{$('birth-place-fields').hidden=!$('use-natal').checked;};
 $('use-natal').addEventListener('change',()=>{if($('use-natal').checked){$('birth-time-unknown').checked=false;$('birth-time').disabled=false;}sync();});
 $('birth-time').addEventListener('change',()=>{if($('birth-time').value){$('use-natal').checked=true;sync();}});
 $('birth-time-unknown').addEventListener('change',()=>{if($('birth-time-unknown').checked){$('use-natal').checked=false;sync();}});
 let places=[];
 $('find-place').addEventListener('click',async()=>{
  $('find-place').disabled=true;$('place-status').textContent='Finding places…';$('place-results').replaceChildren(new Option('Choose a place',''));places=[];
  try{const response=await fetch('/api/places?q='+encodeURIComponent($('birthplace').value.trim()));const data=await response.json();if(!response.ok)throw Error(data.error||'Place lookup failed.');places=data.results;places.forEach((p,i)=>$('place-results').append(new Option(p.name,String(i))));$('place-status').textContent=places.length?'Choose the matching birthplace below.':'No matches. Try a nearby town or enter coordinates and timezone manually.';}
  catch(e){$('place-status').textContent=e.message;}finally{$('find-place').disabled=false;}
 });
 $('place-results').addEventListener('change',()=>{const p=places[$('place-results').value];if(!p)return;$('latitude').value=p.latitude;$('longitude').value=p.longitude;$('timezone').value=p.timezone;$('place-status').textContent=`${p.name} · ${p.timezone}`;});
}
export async function requestNatal(){
 if(!$('use-natal').checked||$('birth-time-unknown').checked)return null;
 if(!['birth','birth-time','latitude','longitude','timezone'].every(id=>$(id).value.trim()))throw Error('For a birth chart, enter date, time and select a birthplace (or enter coordinates and timezone).');
 const response=await fetch('/api/natal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({date:$('birth').value,time:$('birth-time').value,latitude:Number($('latitude').value),longitude:Number($('longitude').value),timezone:$('timezone').value.trim()})});
 const chart=await response.json();if(!response.ok)throw Error(chart.error||'Unable to calculate birth chart.');return chart;
}
export function renderNatal(week,sky){
 const chart=week.natal,section=node('section','');section.className='natal-card';section.append(node('h3','Your birth chart'),node('p',chart.system));
 const trio=node('div','');trio.className='week-arc';for(const p of [chart.planets[0],chart.planets[1],{name:'Rising',sign:chart.ascendant.sign,longitude:chart.ascendant.longitude}]){const card=node('article','');card.append(node('small',p.name),node('h4',p.sign),node('p',`${(p.longitude%30).toFixed(1)}° within sign`));trio.append(card);}section.append(trio);
 const details=node('details','');details.append(node('summary','All natal placements & calculation details'));for(const p of chart.planets)details.append(node('p',`${p.name}: ${p.sign} ${(p.longitude%30).toFixed(1)}° · house ${p.house}`));details.append(node('p',`Birth instant: ${chart.utc} · ${chart.timezone} (${chart.offset}). ${chart.source}. ${chart.precision}`),node('p','House signs: '+chart.houses.map(h=>`${h.number} ${h.sign}`).join(' · ')));section.append(details,node('h4','Personal contacts this week'));
 for(const t of week.contacts){const card=node('article','');card.append(node('strong',`${t.date} · ${t.title}`),node('p',t.text),node('small',t.basis),resultSources(sky,t.date,[t.planet]));section.append(card);}
 if(!week.contacts.length)section.append(node('p','No personal contacts available within 3° in the weekly snapshots.'));
 section.append(node('p','Five transiting bodies are compared with ten natal planets and your ascendant. Dates are closest midnight-UTC samples, not exact event times. General daily prompts remain sun-sign based.'));
 return section;
}
