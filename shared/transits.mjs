import {angularDistance,zodiac,practicalGuidance} from './reading.mjs';
const topics={Sun:'identity and direction',Moon:'feelings and familiar needs',Mercury:'communication and learning',Venus:'social connection and values',Mars:'initiative and effort',Jupiter:'growth and perspective',Saturn:'responsibility and boundaries',Uranus:'independence and change',Neptune:'imagination and uncertainty',Pluto:'power and long-term change',Ascendant:'self-expression and first impressions'};
const meanings={conjunction:'Bring these themes into focus together. Choose one way to express them consciously.',sextile:'Look for a modest opening to connect these themes, then decide whether to act on it.',square:'Notice where these themes compete. Slow down and make the trade-off explicit.',trine:'Use a familiar strength to connect these themes without taking the situation for granted.',opposition:'Give both sides of this tension a voice before choosing your response.'};
const houseTopics=['identity','values and resources','communication','home and belonging','creativity','routines','partnerships','shared commitments','learning and perspective','direction and responsibility','community','rest and reflection'];
export function personalTransits(day,natal){
 if(!natal)return [];
 const targets=[...natal.planets,{name:'Ascendant',longitude:natal.ascendant.longitude}];const results=[];
 for(const p of day.positions)for(const n of targets){
  const separation=angularDistance(p.longitude,n.longitude);
  for(const [type,angle] of [['conjunction',0],['sextile',60],['square',90],['trine',120],['opposition',180]]){
   const orb=Math.abs(separation-angle);if(orb>3)continue;
   const house=(Math.floor(p.longitude/30)-Math.floor(natal.ascendant.longitude/30)+12)%12+1;
   results.push({date:day.date,planet:p.name,target:n.name,type,orb,separation,house,title:`${p.name} ${type} natal ${n.name}`,text:`Reflect on ${topics[p.name]} alongside ${topics[n.name]}. ${meanings[type]} The transiting ${p.name} is in your whole-sign house ${house}, a symbolic focus on ${houseTopics[house-1]}.`,basis:`Transiting ${p.name} ${p.longitude.toFixed(1)}° (${zodiac(p.longitude)}); natal ${n.name} ${n.longitude.toFixed(1)}°. Separation ${separation.toFixed(2)}°, orb ${orb.toFixed(2)}°. Snapshot at 00:00 UTC.`});
  }
 }
 return results.sort((a,b)=>a.orb-b.orb);
}
function contactGuidance(t){
 const step=practicalGuidance(t.house-1);
 const approach={conjunction:'Choose one priority before starting.',sextile:'Take one small, reversible opportunity.',square:'Write down the trade-off before acting; keep the step small.',trine:'Use an approach that has worked for you before.',opposition:'Name both needs and choose a step that respects each.'}[t.type];
 return {...step,tryThis:approach+' '+step.tryThis,question:`What do I notice about ${topics[t.planet]} and ${topics[t.target]} in my actual experience?`,guidanceBasis:`Suggested experiment drawn from ${t.title} and whole-sign house ${t.house}. An editorial interpretation, not a predicted result.`};
}
export function personalizeWeek(week,sky,natal){
 if(!natal)return week;
 const days=week.days.map((d,i)=>{const transits=personalTransits(sky.days[i],natal);return {...d,...(transits[0]?contactGuidance(transits[0]):{}),transits,detail:d.detail+(transits[0]?` Your closest sampled natal contact: ${transits[0].title}. ${transits[0].text}`:''),skyNote:transits[0]?transits[0].basis:d.skyNote};});
 const byContact=new Map();for(const d of days)for(const t of d.transits){const key=t.title;if(!byContact.has(key)||t.orb<byContact.get(key).orb)byContact.set(key,t);}
 const contacts=[...byContact.values()].sort((a,b)=>a.orb-b.orb).slice(0,6);
 const categoryTargets=[['Venus'],['Mercury','Saturn'],['Mars','Moon'],['Sun','Ascendant','Jupiter'],['Moon','Ascendant']];
 const categories=week.categories.map((c,i)=>{const match=[...byContact.values()].filter(t=>categoryTargets[i].includes(t.target)).sort((a,b)=>a.orb-b.orb)[0];return match?{...c,headline:match.title,text:match.text,action:contactGuidance(match).tryThis,question:contactGuidance(match).question,basis:`${match.date}: ${match.basis}`}:{...c,basis:c.basis+' No sampled personal contact to the relevant natal points within 3° this week; this section retains the general sun-sign theme.'};});
 return {...week,days,milestones:week.milestones.map(m=>({...m,day:days.find(d=>d.date===m.day.date)})),categories,natal,contacts,overview:`Your natal Sun is in ${natal.planets.find(p=>p.name==='Sun').sign}, Moon in ${natal.planets.find(p=>p.name==='Moon').sign}, and rising sign is ${natal.ascendant.sign}. ${contacts[0]?`The closest sampled personal contact this week is ${contacts[0].title} on ${contacts[0].date}. ${meanings[contacts[0].type]}`:'No personal contacts within the selected orb are available in these snapshots.'} ${week.overview}`};
}
