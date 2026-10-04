import {parseHorizons} from './horizons.mjs';
import {comparePosition} from './natal.mjs';
const cache=new Map();let queue=Promise.resolve();
const dateAt=(date,n)=>new Date(Date.parse(date+'T00:00:00Z')+n*86400000).toISOString().slice(0,10);
async function loadSky(date){
 const days=Array.from({length:7},(_,i)=>({date:dateAt(date,i),positions:[]}));
 for(const [name,id] of [['Sun','10'],['Moon','301'],['Mercury','199'],['Venus','299'],['Mars','499']]){
  const params=new URLSearchParams({format:'json',COMMAND:`'${id}'`,CENTER:"'500@399'",START_TIME:`'${date}'`,STOP_TIME:`'${dateAt(date,7)}'`,STEP_SIZE:"'1 d'",QUANTITIES:"'31'",CSV_FORMAT:"'YES'",OBJ_DATA:"'NO'"});
  const response=await fetch('https://ssd.jpl.nasa.gov/api/horizons.api?'+params,{signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('JPL service unavailable');
  parseHorizons(await response.json()).forEach((p,i)=>days[i].positions.push({name,...p,comparison:comparePosition(name,days[i].date,p.longitude)}));
 }
 return {days,source:'NASA/JPL Horizons',status:'live',fetchedAt:new Date().toISOString(),reference:'Geocentric apparent ecliptic of date; sampled at 00:00 UTC',url:'https://ssd.jpl.nasa.gov/horizons/'};
}
export function getSky(date){if(cache.has(date))return cache.get(date);const pending=queue.then(()=>loadSky(date));queue=pending.catch(()=>{});cache.set(date,pending);pending.catch(()=>cache.delete(date));if(cache.size>16)cache.delete(cache.keys().next().value);return pending;}
