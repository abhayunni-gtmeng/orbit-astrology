import {signs,symbols,elements,zodiac,makeReading,makeWeek,weeklyOutlook,featureCopy,natalExplanationText} from '/shared/reading.mjs';
import {setupBirthForm,requestNatal,renderNatal} from '/birth.mjs';
import {personalizeWeek} from '/shared/transits.mjs';
import {resultSources} from '/result-sources.mjs';
import {relationshipReading} from '/shared/relationships.mjs';
setupBirthForm();
const $=id=>document.getElementById(id);let focus='Balance',reading=[],sky=null,active=0,week=null,viewMode='both';
function el(tag,text,className){const node=document.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;}
const birthReading=el('section',null,'birth-reading');birthReading.id='birth-chart';birthReading.setAttribute('aria-label','Your birth-chart reading');document.querySelector('.reading-heading').before(birthReading);
function renderBirthReading(){
 birthReading.replaceChildren();
 if(week?.natal){birthReading.append(renderNatal(week,sky));return;}
 const intro=el('article',null,'birth-chart-invitation');
 intro.append(el('div','YOUR BIRTH CHART / YOUR PERSONAL BLUEPRINT','eyebrow'),el('h2','More than your star sign.'),el('p','Discover your Sun, Moon and rising sign—and what they symbolically suggest about your personality, emotional needs and how you meet the world.'));
 const button=el('button','Read my birth chart ↗','primary');button.type='button';button.addEventListener('click',()=>{$('use-natal').checked=true;$('use-natal').dispatchEvent(new Event('change'));$('birth').focus();$('birth').scrollIntoView({block:'center',behavior:'smooth'});});
 intro.append(button,el('p','Add your birth date, exact time and birthplace, then reveal your chart. No birth time? You can still explore your sun-sign week.','field-note'));birthReading.append(intro);
}
renderBirthReading();
const leadingOutlook=el('section');leadingOutlook.id='leading-outlook';leadingOutlook.hidden=true;birthReading.before(leadingOutlook);
const relationshipPanel=el('section',null,'relationship-panel');relationshipPanel.id='relationships';leadingOutlook.after(relationshipPanel);let relationshipMode='single';renderRelationships();
const allSignsPanel=el('section');allSignsPanel.id='all-signs';document.querySelector('main').prepend(allSignsPanel);
const initialAllSigns=el('details',null,'all-signs-panel');initialAllSigns.append(el('summary','All 12 signs this week · reveal good news & bad news'));
const allSignsStatus=el('p','Open to compare this week for every sign. No birth details needed.','all-signs-note');allSignsStatus.setAttribute('role','status');initialAllSigns.append(allSignsStatus);allSignsPanel.append(initialAllSigns);
let allSignsLoading=false;
initialAllSigns.addEventListener('toggle',async()=>{
 if(!initialAllSigns.open||allSignsLoading)return;allSignsLoading=true;allSignsStatus.textContent='Loading this week for all 12 signs…';
 const selectedFocus=focus;let comparisonSky=sky;
 if(!comparisonSky){try{const response=await fetch('/api/sky?date='+date,{cache:'no-store'});if(!response.ok)throw Error('unavailable');comparisonSky=await response.json();}catch{comparisonSky={status:'unavailable',days:Array.from({length:7},(_,i)=>({date:new Date(Date.parse(date+'T00:00:00Z')+i*86400000).toISOString().slice(0,10),positions:[]}))};}}
 if(!initialAllSigns.isConnected)return;
 const comparisonWeek=makeWeek($('sign').value,comparisonSky,selectedFocus);const panel=renderAllSigns(comparisonSky,comparisonWeek);panel.open=initialAllSigns.open;allSignsPanel.replaceChildren(panel);
});
const weekly=document.createElement('section');weekly.id='weekly-detail';weekly.hidden=true;document.querySelector('.feature').after(weekly);
const dayDetail=document.createElement('section');dayDetail.id='day-detail';dayDetail.hidden=true;$('daily').after(dayDetail);
function renderFeature(){
 const content=featureCopy(viewMode,reading[active]);
 $('theme-label').textContent=content.label;$('theme-title').textContent=content.title;$('theme-copy').textContent=content.copy;
}
renderFeature();
function renderOutlook(){
 const outlook=weeklyOutlook(week),section=el('section',null,'weekly-outlook');section.append(el('h3','Your weekly predictions: good news & bad news'),el('p',outlook.note,'field-note'));
 const grid=el('div',null,'category-grid');
 for(const [key,label,title,items] of [['good','good news','Good news',outlook.opportunities],['bad','bad news','Bad news',outlook.challenges]]){
  const card=el('article',null,'category-card outlook-'+key);
  const heading=el('h4',title,'outlook-heading');heading.id='outlook-heading-'+key;card.setAttribute('aria-labelledby',heading.id);
  const subtitle=el('p',key==='good'?'Your positive predictions this week':'Your negative predictions this week','outlook-subtitle');
  const button=el('button','Show details','outlook-toggle');button.type='button';button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','outlook-'+key);button.setAttribute('aria-label','Show details '+label);
  const content=el('div');content.id='outlook-'+key;content.hidden=true;
  button.addEventListener('click',()=>{content.hidden=!content.hidden;button.setAttribute('aria-expanded',String(!content.hidden));button.textContent=content.hidden?'Show details':'Show less';button.setAttribute('aria-label',button.textContent+' '+label);});
  card.append(heading,subtitle,content,button);
  for(const item of items){content.append(el('h5',item.title,'outlook-item-title'),el('p',item.text,'outlook-summary'));if(key==='bad'){content.append(el('strong','Avoid it','prescriptive-content'),el('p',item.avoid,'prescriptive-content'),el('strong','Manage it if it happens','prescriptive-content'),el('p',item.manage,'prescriptive-content'));}else{content.append(el('strong','Make the most of it','prescriptive-content'),el('p',item.action,'prescriptive-content'));}content.append(el('strong','Reflect','reflective-content'),el('p',item.reflection,'reflective-content'));const details=el('details');details.append(el('summary','Basis for this theme'),el('p',item.basis));content.append(details,resultSources(sky,item.date||week.days[0].date));}
  grid.append(card);
 }section.append(grid);return section;
}
function renderAllSigns(comparisonSky=sky,comparisonWeek=week){
 const panel=el('details',null,'all-signs-panel');panel.open=false;
 panel.append(el('summary','All 12 signs this week · reveal good news & bad news'));
 panel.append(el('p',`${fmt(comparisonWeek.days[0].date,{month:'short',day:'numeric'})} – ${fmt(comparisonWeek.days.at(-1).date,{month:'short',day:'numeric'})} · Focus: ${comparisonWeek.focus}. General sun-sign astrology predictions, not personal birth-chart readings. Speculative entertainment, not scientifically validated forecasts. NASA data supports positions, not predicted events.`,'all-signs-note'));
 if(comparisonSky.status==='unavailable'||!comparisonSky.days.some(d=>d.positions.length))panel.append(el('p','Live sky data is unavailable. These are general editorial prompts, not transit-based readings.','all-signs-note'));
 const grid=el('div',null,'all-signs-grid');
 signs.forEach((sign,i)=>{
  const overview=weeklyOutlook(makeWeek(sign,comparisonSky,comparisonWeek.focus));const good=overview.opportunities[0],caution=overview.challenges[0];
  const card=el('article',null,'all-sign-card');card.setAttribute('aria-label',sign+' weekly overview');
  card.append(el('h3',`${symbols[i]} ${sign}${sign===comparisonWeek.sign?' · Selected sign':''}`));
  const opportunity=el('div',null,'all-sign-opportunity');opportunity.append(el('span','GOOD NEWS','all-sign-label'),el('h4',good.title),el('p',good.text),el('strong','Make the most of it'),el('p',good.action));
  const warning=el('div',null,'all-sign-warning');warning.append(el('span','BAD NEWS','all-sign-label'),el('h4',caution.title),el('p',caution.text),el('strong','Avoid it'),el('p',caution.avoid),el('strong','If it happens'),el('p',caution.manage));
  const basis=el('details',null,'all-sign-basis');basis.append(el('summary','Why these themes?'),el('p',good.basis),resultSources(comparisonSky,good.date),el('p',caution.basis),resultSources(comparisonSky,caution.date));
  card.append(opportunity,warning,basis);grid.append(card);
 });panel.append(grid);return panel;
}
function renderRelationships(){
 relationshipPanel.replaceChildren(el('h2','Your relationships this week'),el('p','A reading for you—not a compatibility test. No partner’s birth details needed.'));
 const label=el('label','Where are you right now?');label.htmlFor='relationship-mode';const select=el('select');select.id='relationship-mode';
 for(const [value,title] of [['single','Single'],['situationship','Situationship']]){const option=el('option',title);option.value=value;select.append(option);}select.value=relationshipMode;
 select.addEventListener('change',()=>{relationshipMode=select.value;renderRelationships();document.getElementById('relationship-mode').focus();});relationshipPanel.append(label,select);
 if(!week){relationshipPanel.append(el('p','Choose your sign and reveal your week to generate this reading. Add birth details for personal chart factors.','field-note'));return;}
 const result=relationshipReading(week,relationshipMode);relationshipPanel.append(el('p',result.note,'field-note'));
 const grid=el('div',null,'relationship-grid');
 for(const [key,title] of [['good','Good news'],['bad','Bad news']]){
  const item=result[key],card=el('details',null,'relationship-'+key);card.open=false;card.append(el('summary',title+' · reveal prediction'),el('h3',item.title));
  if(key==='good')card.append(el('strong','Make the most of it'),el('p',item.action));
  else card.append(el('strong','Avoid it'),el('p',item.avoid),el('strong','Manage it if it happens'),el('p',item.manage));
  const basis=el('details');basis.append(el('summary','What informs this reading?'),el('p',item.basis),resultSources(sky,item.date));card.append(basis);grid.append(card);
 }relationshipPanel.append(grid);
}
function renderLifeSections(){
 const categories=el('section',null,'life-sections');categories.setAttribute('aria-label','Your life this week');categories.append(el('h3','Your life this week'));const grid=el('div',null,'category-grid');const order=['Social','Growth','Personal','Work & money','Energy & wellbeing'];for(const title of order){const item=week.categories.find(c=>c.title===title);if(!item)continue;const card=el('article',null,'category-card');card.append(el('h4',item.title,'life-section-title'),el('p',item.headline,'life-section-theme'),el('p',item.text,'reflective-content'),el('strong','Put it into practice','prescriptive-content'),el('p',item.action,'prescriptive-content'),el('strong','Reflect on it','reflective-content'),el('p',item.question,'reflective-content'),el('strong','Keep in mind'),el('p',item.caution));const details=el('details');details.append(el('summary','Why this theme?'),el('p',item.basis));card.append(details,resultSources(sky,item.basis.match(/^\d{4}-\d{2}-\d{2}/)?.[0]||week.days[0].date));grid.append(card);}categories.append(grid);return categories;
}
function renderWeek(){
 renderBirthReading();leadingOutlook.replaceChildren(renderOutlook());leadingOutlook.hidden=false;weekly.replaceChildren();weekly.hidden=false;weekly.append(renderLifeSections());
 renderRelationships();
 allSignsPanel.replaceChildren(renderAllSigns());allSignsPanel.hidden=false;
 const scene=el('figure',null,'situation-figure');const illustration=el('img');illustration.src='/situations-v1.png';illustration.alt='AI illustration of journaling, friends talking over tea, and creative planning.';illustration.loading='lazy';scene.append(illustration,el('figcaption','Illustrated possibilities: reflection, connection and creative action. AI-generated artwork—not a prediction of events.'));weekly.append(scene);
 weekly.append(el('h3','The bigger picture'),el('p',week.overview,'weekly-overview reflective-content'));
 const arc=el('div',null,'week-arc');for(const item of week.milestones){const box=el('article');box.append(el('span',item.label,'eyebrow'),el('small',fmt(item.day.date,{weekday:'short',month:'short',day:'numeric'})),el('h4',item.day.title),el('p',item.day.tryThis,'prescriptive-content'),el('p',item.day.question,'reflective-content'));arc.append(box);}weekly.append(arc);
 const evidence=el('details',null,'evidence');evidence.append(el('summary','The sky behind this week'));
 evidence.append(el('p','These are angles between transiting planets, shared by everyone—not aspects to your birth chart. Major aspects use a fixed 3° tolerance in Orbit. Dates below are the closest daily samples in this seven-day window, not exact event times.'));
 for(const a of week.highlights)evidence.append(el('p',`${fmt(a.date,{month:'short',day:'numeric'})}: ${a.a} ${a.type} ${a.b} · ${a.separation.toFixed(1)}° separation · ${a.orb.toFixed(1)}° from exact.`));
 if(!week.highlights.length)evidence.append(el('p',sky.status==='unavailable'?'No verified aspects available.':'No major aspects within our tolerance at the sampled times.'));
 evidence.append(el('p','Solar-sign sectors count signs from your selected sun sign. They are symbolic editorial prompts, not calculated natal houses. The general sky section includes five transiting bodies; personal natal contacts, when enabled, are shown separately above.'));
 const link=el('a','Aspect conventions: Astrodienst ↗');link.href='https://www.astro.com/astrowiki/en/Aspect';link.target='_blank';link.rel='noreferrer';evidence.append(link);weekly.append(evidence,el('h3','Your day-by-day guide'));
}
function renderDayDetail(r){dayDetail.hidden=false;dayDetail.replaceChildren(el('p',r.detail,'day-story reflective-content'));const grid=el('div',null,'daily-actions');for(const [title,text] of [['Do this today',r.tryThis],['Watch for',r.watchFor],['Reflect on this',r.question],['Check back afterward',r.review]]){const box=el('div',null,title==='Do this today'?'prescriptive-content':title==='Reflect on this'?'reflective-content':'');box.append(el('h4',title),el('p',text));grid.append(box);}const details=el('details',null,'evidence');details.append(el('summary','What informs today’s reading?'),el('p',r.guidanceBasis||'Suggested actions are editorial experiments linked to the daily theme. Adapt or skip them based on your circumstances.'),el('p',r.source),el('p',r.skyNote));dayDetail.append(grid,details,resultSources(sky,r.date));}
const today=new Date();const date=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
const fmt=(date,options)=>new Intl.DateTimeFormat('en',options).format(new Date(date+'T12:00:00Z'));

function renderSources(start){
 const section=el('section',null,'source-links');section.id='source-links';
 const link=(label,url)=>{const a=el('a',label+' ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;};
 section.append(el('h3','Sources & independent cross-checks'),el('p','Astronomical data supports the positions. The suggested actions and reflection questions are Orbit’s editorial interpretations, not guidance issued by NASA or the sources below.'));
 const nasa=el('article');nasa.append(el('h4','NASA/JPL · weekly data'),link('Horizons explorer','https://ssd.jpl.nasa.gov/horizons/app.html'),link('API documentation','https://ssd-api.jpl.nasa.gov/doc/horizons.html'));
 nasa.append(el('p',`Reproduce this week: ${start}, seven daily readings at 00:00 UTC; Earth center (500@399), apparent ecliptic-of-date longitude/latitude (quantity 31). Raw responses also include the next boundary day, which Orbit discards. These links request data afresh, not an archived response.`));
 const stop=new Date(Date.parse(start+'T00:00:00Z')+7*86400000).toISOString().slice(0,10);
 for(const [name,id] of [['Sun','10'],['Moon','301'],['Mercury','199'],['Venus','299'],['Mars','499']]){
 const params=new URLSearchParams({format:'json',COMMAND:`'${id}'`,CENTER:"'500@399'",START_TIME:`'${start}'`,STOP_TIME:`'${stop}'`,STEP_SIZE:"'1 d'",QUANTITIES:"'31'",CSV_FORMAT:"'YES'",OBJ_DATA:"'NO'"});
 nasa.append(link(name+' · raw NASA data','https://ssd.jpl.nasa.gov/api/horizons.api?'+params));
 }
 const independent=el('article');independent.append(el('h4','Independent publishers & calculation tools'),link('Astrodienst · annual ephemeris tables','https://www.astro.com/swisseph/swepha_e.htm'),link('Swiss Ephemeris · data provenance','https://www.astro.com/swisseph/swephinfo_e.htm'),link('Astronomy Engine · natal calculation code','https://github.com/cosinekitty/astronomy'));
 independent.append(el('p','Astrodienst provides an external table for manual cross-checking. Swiss Ephemeris is largely based on JPL ephemerides, so it is an independent publisher/software implementation—not wholly independent underlying observations. Astronomy Engine is the library Orbit uses for natal calculations, not a separate validation of Orbit.'));
 independent.append(el('p','For comparisons, match the date and UTC time, geocentric origin and tropical zodiac. “Current planets” at the present time will differ from our midnight snapshots. Each retrieved weekly longitude is compared with Astronomy Engine on the result. Astrodienst tables are not automatically fetched.'));
 const conventions=el('article');conventions.append(el('h4','Interpretation conventions'),link('Astrodienst · aspect definitions','https://www.astro.com/astrowiki/en/Aspect'),el('p','Orbit uses Western tropical astrology, whole-sign houses and a fixed 3° major-aspect tolerance. Its practical suggestions are optional, low-stakes experiments: act, reflect, then check what really happened.'));
 section.append(nasa,independent,conventions);$('source-note').after(section);
}
renderSources(date);

$('birth').max=date;
$('birth-time-unknown').addEventListener('change',()=>{
 const unknown=$('birth-time-unknown').checked;
 $('birth-time').disabled=unknown;
 if(unknown)$('birth-time').value='';
});
signs.forEach((name,i)=>{const option=document.createElement('option');option.value=name;option.textContent=`${symbols[i]}  ${name}`;$('sign').append(option);});
function updateSign(){const i=signs.indexOf($('sign').value);$('sign-symbol').textContent=symbols[i];$('sign-name').textContent=signs[i];$('sign-element').textContent=elements[i%4]+' sign';}
$('sign').addEventListener('change',updateSign);
updateSign();
$('birth').addEventListener('change',()=>{if(!$('birth').value)return;const [,m,d]=$('birth').value.split('-').map(Number);const cuts=[20,19,21,20,21,21,23,23,23,23,22,22];const i=(m+(d<cuts[m-1]?-1:0)+9)%12;$('sign').value=signs[i];updateSign();});
document.querySelectorAll('#focuses button').forEach(b=>b.addEventListener('click',()=>{focus=b.textContent;document.querySelectorAll('#focuses button').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));});}));
const focusPrompts={Balance:'Your prompt: Where could you trade urgency for intention?','Social relationships':'Your prompt: Who could you reconnect with, listen to, or include today?',Work:'Your prompt: Which one task deserves your clearest attention?',Growth:'Your prompt: What is one thing you could try without needing to be good at it?'};
function showDay(i){active=i;const r=reading[i];renderFeature();renderDayDetail(r);document.querySelectorAll('.day-tabs button').forEach((b,j)=>{b.classList.toggle('active',i===j);b.setAttribute('aria-pressed',String(i===j));});$('daily-date').textContent=fmt(r.date,{weekday:'long',month:'short',day:'numeric'}).toUpperCase();$('daily-title').textContent=r.title;$('daily-copy').textContent=r.tryThis;$('daily-copy').className='prescriptive-content';$('focus-copy').className='reflective-content';$('focus-copy').textContent=focusPrompts[r.focus];$('moon-note').textContent=r.moon?`Moon in ${r.moon}`:'Lunar data unavailable';$('positions').replaceChildren();const positions=sky.days[i].positions;if(!positions.length){$('positions').textContent='No verified planetary positions available. This reading uses sign-based reflection only.';}for(const p of positions){const card=document.createElement('div');card.className='position';for(const [tag,text] of [['span',p.name],['strong',zodiac(p.longitude)],['small',`${(p.longitude%30).toFixed(1)}° · tropical zodiac`]]){const e=document.createElement(tag);e.textContent=text;card.append(e);}card.append(resultSources(sky,r.date,[p.name]));$('positions').append(card);}}
$('profile').addEventListener('submit',async e=>{e.preventDefault();let sign=$('sign').value;let natal=null;const chosenFocus=focus;const name=$('name').value.trim();$('generate').disabled=true;$('status').textContent='Calculating your chart…';try{natal=await requestNatal();if(natal){sign=natal.planets.find(p=>p.name==='Sun').sign;$('sign').value=sign;updateSign();}}catch(error){$('status').textContent=error.message;$('generate').disabled=false;return;}$('status').textContent='Reading the sky… retrieving five bodies from NASA/JPL.';try{const response=await fetch('/api/sky?date='+date,{cache:'no-store'});if(!response.ok)throw Error('unavailable');sky=await response.json();$('status').textContent='NASA/JPL observations connected · seven daily snapshots';$('source-note').textContent=`${sky.reference}. Retrieved ${new Date(sky.fetchedAt).toLocaleString()}. NASA data supports positions, not personal predictions.`;}catch{sky={status:'unavailable',days:Array.from({length:7},(_,i)=>({date:new Date(Date.parse(date+'T00:00:00Z')+i*86400000).toISOString().slice(0,10),positions:[]}))};$('status').textContent='NASA/JPL unavailable. Showing sign-based reflections only. Reveal again to retry.';$('source-note').textContent='No live NASA data is being used. Planetary positions are intentionally not estimated.';}finally{$('generate').disabled=false;}
week=personalizeWeek(makeWeek(sign,sky,chosenFocus),sky,natal);reading=week.days;renderWeek();$('reading-title').textContent=name?`${name}, here’s your week.`:`Your ${sign} week.`;$('date-range').textContent=fmt(reading[0].date,{month:'short',day:'numeric'})+' – '+fmt(reading[6].date,{month:'short',day:'numeric'});$('theme-label').textContent=`${sign.toUpperCase()} / ${chosenFocus.toUpperCase()}`;$('theme-title').textContent=reading[0].title;$('theme-copy').textContent=`A week of small, intentional choices. Explore ${chosenFocus.toLowerCase()} with a concrete action, a reflection question and a check-in each day. Adapt the suggestions to your life; astrology does not guarantee an outcome.`;$('feature-symbol').textContent=symbols[signs.indexOf(sign)];$('day-tabs').replaceChildren();reading.forEach((r,i)=>{const b=document.createElement('button');b.type='button';b.textContent=fmt(r.date,{weekday:'short'});const strong=document.createElement('strong');strong.textContent=fmt(r.date,{day:'numeric'});b.append(strong);b.addEventListener('click',()=>showDay(i));$('day-tabs').append(b);});$('daily').hidden=false;$('save').hidden=false;showDay(0);
});
$('save').addEventListener('click',()=>{const text=[$('reading-title').textContent,'Astrological reflection, not a prediction.','Sky data: '+sky.status,'Reading style: '+viewMode,...(viewMode!=='prescriptive'?[week.overview]:[]),weeklyOutlook(week).note,...['opportunities','challenges'].flatMap(kind=>[kind.toUpperCase(),...weeklyOutlook(week)[kind].map(t=>[t.title,t.text,viewMode!=='reflective'?(t.avoid?'Avoid it: '+t.avoid+'\nManage it: '+t.manage:'Make the most of it: '+t.action):'',viewMode!=='prescriptive'?t.reflection:'',t.basis].filter(Boolean).join('\n'))]),...(week.natal?[natalExplanationText(week.natal),week.natal.system,`Birth UTC: ${week.natal.utc}; timezone: ${week.natal.timezone}`,`Rising: ${week.natal.ascendant.sign} ${(week.natal.ascendant.longitude%30).toFixed(1)}°`,...week.natal.planets.map(p=>`${p.name}: ${p.sign} ${(p.longitude%30).toFixed(1)}°; house ${p.house}`),...week.contacts.map(t=>`${t.date}: ${t.title}\n${t.text}\n${t.basis}`)]:[]),...week.categories.map(c=>`${c.title}: ${c.headline}\n${viewMode!=='prescriptive'?c.text:''}\n${viewMode!=='reflective'?'Try this week: '+c.action:''}\n${viewMode!=='prescriptive'?'Reflect: '+c.question:''}\nKeep in mind: ${c.caution}\nBasis: ${c.basis}`),'Sampled aspects (3° tolerance; not exact event times):',...week.highlights.map(a=>`${a.date}: ${a.a} ${a.type} ${a.b}, separation ${a.separation.toFixed(1)}°, orb ${a.orb.toFixed(1)}°.`),...reading.map(r=>`${r.date} — ${r.title}\n${viewMode!=='prescriptive'?r.detail:''}\n${viewMode!=='reflective'?'Try: '+r.tryThis:''}\nWatch for: ${r.watchFor}\n${viewMode!=='prescriptive'?'Reflect: '+r.question:''}\nCheck back: ${r.review}\n${viewMode!=='prescriptive'?focusPrompts[r.focus]:''}\n${r.source}\n${r.skyNote}`)].join('\n\n');const url=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download=`orbit-week-${date}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
