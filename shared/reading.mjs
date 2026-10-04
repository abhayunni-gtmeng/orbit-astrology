export const signs=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
export const symbols=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map(s=>s+'\uFE0E');
export const elements=['Fire','Earth','Air','Water'];
export function featureCopy(mode,day){
 const labels={reflective:'Reflective',prescriptive:'Prescriptive',both:'Action & reflection'};
 if(!labels[mode])throw Error('Unknown reading mode.');
 if(!day)return {
  reflective:{label:'A MOMENT TO REFLECT',title:'Make space for a new perspective.',copy:'Choose your sign and reveal your week to explore its themes, personal questions and what they bring up for you.'},
  prescriptive:{label:'A NEXT STEP TO TAKE',title:'Turn perspective into a practical plan.',copy:'Choose your sign and reveal your week for concrete actions, priorities and cautions you can use day by day.'},
  both:{label:'REFLECT, THEN ACT',title:'Find perspective. Choose your next step.',copy:'Choose your sign and reveal your week for thoughtful questions paired with practical actions and follow-up check-ins.'}
 }[mode];
 return {label:`${labels[mode].toUpperCase()} / ${day.date} / ${day.focus.toUpperCase()}`,title:mode==='reflective'?`Consider: ${day.title}`:mode==='prescriptive'?`Your next step: ${day.title}`:`Reflect & act: ${day.title}`,copy:mode==='reflective'?day.question:mode==='prescriptive'?day.tryThis:`${day.tryThis} Then reflect: ${day.question}`};
}
export function weeklyOutlook(week){
 const prevention=[
 ['Pick one task before starting anything new.','Pause the other tasks and finish one small step.'],
 ['Wait a day before acting on a nonessential want.','Revisit the choice against your priorities; adjust what you can.'],
 ['Repeat back what you heard before replying.','Ask what you missed, then correct your response.'],
 ['Check your calendar before saying yes.','Renegotiate the time or scope of one commitment.'],
 ['Decide that this activity does not need an audience or a perfect result.','Take a short break, then make one rough version just for yourself.'],
 ['Set a realistic stopping point before beginning work.','Move one nonessential task and take a proper break.'],
 ['State one need clearly before agreeing to a plan.','Reopen the conversation and ask for one specific adjustment.'],
 ['Ask a direct question instead of guessing someone’s intentions.','Separate what happened from what you assumed, then clarify.'],
 ['Complete one small step before redesigning the whole plan.','Choose a ten-minute task and do it before planning further.'],
 ['Separate what you own from what depends on other people.','Explain the dependency and agree on who handles the next step.'],
 ['Check your available time before accepting another invitation.','Decline or reschedule one commitment with a clear, kind message.'],
 ['Schedule a short pause before your day fills up.','Reduce the next task to its essentials and give yourself time to reset.']
 ];
 return {
  opportunities:week.categories.slice(0,2).map((c,i)=>({title:i===0?'Reconnect with someone':'Make progress on one priority',text:i===0?'A conversation or a small invitation could help you reconnect or clear up expectations.':'A clear next step could move a stalled task forward.',action:c.action,reflection:c.question,basis:c.basis})),
  challenges:[week.days[0],week.days[Math.floor(week.days.length/2)]].map(d=>{const index=areas.findIndex(a=>a.watch===d.watchFor);const [avoid,manage]=prevention[index<0?0:index];return {title:d.date,text:d.watchFor,avoid,manage,action:manage,reflection:d.question,basis:d.source};}),
  note:'Potential opportunities and practical heads-ups—not reports or predictions of good or bad events. Use what fits your actual situation.'
 };
}
export const zodiac=longitude=>signs[Math.floor(((longitude%360)+360)%360/30)];
const practicalSteps=[
 'Set a 15-minute timer and complete the smallest first step on one postponed idea.',
 'Choose one priority and reserve a 25-minute block for it. Remove one competing distraction.',
 'Ask one clarifying question in a conversation today, then summarize what you heard before responding.',
 'Spend ten minutes improving one corner of your home or arranging a check-in with someone you trust.',
 'Give a creative activity twenty minutes. Make one rough version without editing it.',
 'Choose one nonessential task to defer, and use the space for a manageable routine.',
 'Make one specific, low-pressure invitation. Include a proposed time and room to decline.',
 'Before a shared commitment, write down what you can offer and ask one question about expectations.',
 'Spend fifteen minutes exploring a viewpoint outside your usual sources. Note one idea worth checking.',
 'Define one small deliverable, write its next step, and reserve twenty minutes to begin.',
 'Send one thoughtful check-in to a friend or offer one specific contribution to a group.',
 'Reserve ten quiet minutes without notifications. Write down one thing you can leave unfinished today.'
];
export function practicalGuidance(sector){return {tryThis:practicalSteps[sector],review:`Afterward, ask: ${areas[sector].question} Note what actually happened and choose whether to repeat, adjust or stop the experiment.`};}
const themes=['Begin again','Find your footing','Say what matters','Make room for yourself','Follow your spark','Simplify your rhythm','Meet in the middle','Go a little deeper','Widen your world','Build something lasting','Find your people','Leave room to dream'];
const actions=['Take one small step toward an idea you have been postponing.','Protect a quiet hour and finish one practical task.','Ask an open question instead of guessing what someone means.','Make time for a familiar place or a person who helps you feel grounded.','Give a creative project twenty minutes without judging the result.','Clear one unnecessary commitment from your calendar.','Make a thoughtful invitation and leave room for an honest answer.','Write down what you need before having an important conversation.','Read, walk, or learn somewhere outside your usual routine.','Choose one achievable milestone and define your next step.','Reconnect with a friend or contribute to a shared project.','Keep a little unplanned time for rest and imagination.'];
export function makeReading(sign,sky,focus='Balance'){
 const index=signs.indexOf(sign);if(index<0)throw Error('Choose a valid star sign.');
 return sky.days.map((day,i)=>{
  const moon=day.positions.find(p=>p.name==='Moon');const sector=moon?(Math.floor(moon.longitude/30)-index+12)%12:(index+i)%12;
  const aspects=findAspects(day.positions);const strongest=aspects[0];
  const pace=['Start by noticing what already has your attention. Write down one intention without turning it into a long to-do list.','Move from intention to a small experiment. Try a different approach to one familiar situation and notice the response.','Check what is working before adding more. A short conversation or a written list can help you separate an assumption from a fact.','Use the middle of your seven-day window to adjust your pace. Keep the useful commitment and renegotiate the one that no longer fits.','Follow through on something you began earlier in the week. Aim for a workable result rather than a perfect finish.','Make room to reconnect with people and interests outside your routine. Let a simple enjoyable activity count as time well spent.','Look back over the week and name one thing to keep, one thing to change, and one thing to let go. Leave a little space before setting a new goal.'][i%7];
  return {date:day.date,title:themes[sector],text:actions[sector],moon:moon?zodiac(moon.longitude):null,focus,source:moon?`Moon in ${zodiac(moon.longitude)}; solar-sign sector ${sector+1} relative to ${sign}. This is not a natal house calculation.`:'Sign-based reflection; sky data unavailable',detail:`${areas[sector].reflection} ${pace}`,...practicalGuidance(sector),watchFor:areas[sector].watch,question:areas[sector].question,aspects,skyNote:strongest?`${strongest.a} ${strongest.type} ${strongest.b}: ${strongest.separation.toFixed(1)}° separation, ${strongest.orb.toFixed(1)}° from exact. ${aspectPrompts[strongest.type]}`:day.positions.length?'No major aspect is within our 3° tolerance at this daily snapshot. This does not rule out aspects between snapshots.':'No verified sky data for this day. These prompts are general reflections.'};
 });
}

const areas=[
 {name:'identity and initiative',reflection:'Let your own preferences have a voice. This symbolic theme invites you to distinguish what you actually want from what you feel expected to want.',watch:'Starting several things at once just to feel momentum.',question:'What would I choose if I did not need to impress anyone?'},
 {name:'values and resources',reflection:'Pay attention to what feels sustainable. Time, attention and money are all resources; consider whether your recent choices match your priorities.',watch:'Confusing a momentary want with a lasting need.',question:'What deserves more of my time, and what deserves less?'},
 {name:'communication and learning',reflection:'Make room for curiosity in everyday exchanges. A clear question can do more than a polished answer, especially when two people are making different assumptions.',watch:'Replying before you have understood the real question.',question:'Which conversation would benefit from more listening?'},
 {name:'home and belonging',reflection:'Return to the people, places and habits that help you feel at home. A small improvement to your environment can be a useful way to express care.',watch:'Agreeing to something out of obligation without checking your capacity.',question:'What makes an ordinary day feel more secure?'},
 {name:'creativity and enjoyment',reflection:'Treat enjoyment as something worth making room for. Choose a creative or playful activity that lets you participate without having to prove anything.',watch:'Turning every hobby or interaction into a performance.',question:'What would I create if the result could remain imperfect?'},
 {name:'routines and practical care',reflection:'Look for a manageable rhythm rather than a complete reinvention. One realistic change to your routine is more useful than a plan that leaves no room for ordinary life.',watch:'Measuring your worth by how much you get done.',question:'Which small habit would make tomorrow a little easier?'},
 {name:'partnership and reciprocity',reflection:'Consider how you share space, decisions and responsibility with other people. Naming a preference kindly can be more helpful than expecting someone to infer it.',watch:'Keeping the peace by leaving your own needs unspoken.',question:'Where could I ask for a fairer exchange?'},
 {name:'trust and shared commitments',reflection:'Give complicated commitments a little extra attention. Explore where clearer boundaries, expectations or agreements might make a relationship feel more straightforward.',watch:'Reading hidden meaning into a situation before asking directly.',question:'What needs to be clarified before I commit further?'},
 {name:'perspective and exploration',reflection:'Step outside a familiar way of thinking. Learning from someone with a different experience can open a possibility without requiring an immediate decision.',watch:'Using a new plan to avoid a practical next step.',question:'Which belief could I hold a little more lightly?'},
 {name:'direction and responsibility',reflection:'Reconnect your effort with a purpose you can describe. Focus on a meaningful next step and make your expectations visible to anyone involved.',watch:'Taking responsibility for outcomes you cannot control.',question:'What would meaningful progress look like this week?'},
 {name:'friendship and community',reflection:'Notice the connections that make a shared idea possible. Offer something specific, ask for help where useful, and let collaboration be an exchange rather than an obligation.',watch:'Overcommitting to stay included.',question:'Who could I support or reconnect with in a simple way?'},
 {name:'rest and inner reflection',reflection:'Leave some room to process what has been happening. Quiet time can help you recognize an unfinished feeling or decision without forcing an immediate resolution.',watch:'Mistaking a need for a pause for a personal failure.',question:'What could I set down for a while?'}
];
const aspectPrompts={conjunction:'As a symbolic prompt, bring the two themes together and decide what deserves focus.',sextile:'As a symbolic prompt, look for a modest opportunity that still needs your participation.',square:'As a symbolic prompt, notice competing priorities and choose a practical compromise.',trine:'As a symbolic prompt, use a familiar strength deliberately rather than taking it for granted.',opposition:'As a symbolic prompt, consider both sides of a situation before choosing your response.'};
export const angularDistance=(a,b)=>Math.abs(((a-b)%360+540)%360-180);
export function findAspects(positions,orbLimit=3){
 const results=[];
 for(let i=0;i<positions.length;i++)for(let j=i+1;j<positions.length;j++){
  const a=positions[i],b=positions[j];if(!Number.isFinite(a.longitude)||!Number.isFinite(b.longitude))continue;
  const separation=angularDistance(a.longitude,b.longitude);
  for(const [type,angle] of [['conjunction',0],['sextile',60],['square',90],['trine',120],['opposition',180]]){
   const orb=Math.abs(separation-angle);if(orb<=orbLimit)results.push({a:a.name,b:b.name,type,angle,separation,orb});
  }
 }
 return results.sort((a,b)=>a.orb-b.orb);
}
export function makeWeek(sign,sky,focus='Balance'){
 const index=signs.indexOf(sign);if(index<0)throw Error('Choose a valid star sign.');
 const days=makeReading(sign,sky,focus);if(!days.length)throw Error('No days to interpret.');
 const first=sky.days[0].positions;
 const planetInfo=name=>{const p=first.find(p=>p.name===name);if(!p)return null;const sector=(Math.floor(p.longitude/30)-index+12)%12;return {name,sign:zodiac(p.longitude),sector,area:areas[sector],basis:`${name} in ${zodiac(p.longitude)} at the opening snapshot; solar-sign sector ${sector+1} relative to ${sign}.`};};
 const venus=planetInfo('Venus'),mercury=planetInfo('Mercury'),mars=planetInfo('Mars');
 const grounding=['Let enthusiasm begin the conversation, then give yourself time to follow through.','Use your preference for something tangible: choose a small action you can repeat.','Put an idea into words, then check it against what is actually happening.','Name the feeling, but give yourself time before deciding what it means.'][index%4];
 const category=(title,planet,intro,action,caution)=>({title,headline:planet?themes[planet.sector]:'Return to the essentials',text:`${intro} ${planet?planet.area.reflection:grounding}`,action,question:planet?planet.area.question:'Which part of this plan fits my actual circumstances?',caution,basis:planet?planet.basis:'General sign-based reflection; the relevant planetary position is unavailable.'});
 const categories=[
  category('Social relationships',venus,'The social lens this week is about friendships, community and the give-and-take of everyday connections.','Reach out to a friend, make space for someone in a group conversation, or suggest a simple shared activity. Ask what support would be useful rather than assuming.','Avoid reading too much into a delayed reply. Check in directly and respect other people’s time and boundaries.'),
  category('Work & money',mercury,'Use this week to make your priorities and agreements easier to understand.','Choose one deliverable, clarify the next step with anyone involved, and review an ordinary expense against your own budget.','Keep financial choices tied to your circumstances and evidence; no transit establishes a profitable date.'),
  category('Energy & wellbeing',mars,'Consider how you spend effort and where you could make your pace more sustainable.','Alternate focused effort with a realistic pause. Choose an accessible activity you enjoy and leave room to adjust to how you actually feel.','Do not read a planetary position as a measure of your health or physical capacity.'),
  category('Personal growth',planetInfo('Sun'),'The growth lens invites you to notice the role you want to play in your own week.','Pick one of the daily journal questions. Answer it at the start of the week, then revisit it at the end to see what changed.','A symbolic description is an invitation to reflect, not a fixed description of your personality.')
 ];
 const uniqueMoon=[...new Set(days.map(d=>d.moon).filter(Boolean))];
 const overview=uniqueMoon.length?`Across these seven daily snapshots, the Moon moves through ${uniqueMoon.join(' → ')}. For ${sign}, the opening reflection is “${days[0].title.toLowerCase()}”; the closing reflection is “${days.at(-1).title.toLowerCase()}”. Use that progression as a structure for your week: notice what matters, take one manageable action, and then review what you learned. ${grounding}`:`Live sky data is unavailable, so this is a general ${sign} reflection plan rather than a transit-based reading. ${grounding} Begin by choosing a realistic intention, make room to review it midway through the week, and finish by noticing what you would like to carry forward.`;
 const milestones=[{label:'Open the week',day:days[0]},{label:'Midweek check-in',day:days[Math.floor(days.length/2)]},{label:'Close the week',day:days.at(-1)}];
 const events=sky.days.flatMap(day=>findAspects(day.positions).map(a=>({...a,date:day.date})));
 const closest=new Map();for(const e of events){const key=e.a+e.type+e.b;if(!closest.has(key)||e.orb<closest.get(key).orb)closest.set(key,e);}
 const highlights=[...closest.values()].sort((a,b)=>a.orb-b.orb).slice(0,4);
 return {overview,categories,milestones,highlights,days,focus};
}
