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
// Editorial possibilities keyed to calculated sectors, never promised events.
const opportunityThemes=[
 ['Stop waiting for permission to begin','That idea you keep postponing could finally become a real experiment. Take the smallest step you control, rather than waiting for someone else to make the opening.'],
 ['Reclaim time for what you actually want','An overlooked commitment may be taking more than it gives. Reviewing where your time and resources go could free up room for a priority you keep putting last.'],
 ['One clear question could break the deadlock','If a task or conversation has stalled, the missing piece may be clarity rather than more effort. Ask the question everyone seems to be working around.'],
 ['Turn home into a place you can exhale','A small change to your space or a clearer household agreement could remove a daily source of friction. Start with the thing that repeatedly gets in your way.'],
 ['Get your idea out of the drafts folder','Something you have been imagining could become a first version worth building on. Give it a short, protected stretch of time without demanding a polished result.'],
 ['Win back a part of your day','One recurring task may be more complicated than it needs to be. Drop an unnecessary step and use the breathing room for something that supports you.'],
 ['Ask for the arrangement you actually need','A one-to-one partnership could become more balanced if you make a specific request. Say what would work for you, while leaving space for the other person to respond.'],
 ['Replace an awkward assumption with a clear agreement','A shared task could feel lighter once everyone knows what they are responsible for. Put the expectations into words before doing another round of guesswork.'],
 ['A different approach could reopen a stuck problem','You may not need to push harder on the same solution. A new source, short lesson or unfamiliar perspective could give you something practical to try.'],
 ['Give your effort a result you can point to','A longer-term goal could gain traction through one small finished deliverable. Define what done looks like, then protect enough time to reach it.'],
 ['Turn a shared interest into a shared effort','A group idea could move beyond conversation if you offer one concrete contribution. Ask who wants to join in, rather than taking the whole project on yourself.'],
 ['Create enough quiet to hear your own answer','Stepping away from constant input could help you recognize what matters and what no longer deserves your attention. Leave one pocket of time unfilled.']
];
const challengeThemes=[
 ['Too many fresh starts could stall your progress','The risk is chasing the next exciting idea before the current one has a chance to work. Activity can feel like momentum even when nothing is getting finished.'],
 ['A quick want could crowd out a real priority','Something appealing may compete with the time or resources you meant to protect. Pause before treating a passing urge as something you need to act on.'],
 ['A rushed reply could create avoidable friction','You could answer the assumption in your head rather than the question someone actually asked. One extra moment of listening may save a longer clarification later.'],
 ['A quick yes could become a heavy obligation','Agreeing to keep someone comfortable can leave your own needs squeezed out. Check what a request really involves before making space for it.'],
 ['Perfectionism could keep a good idea invisible','If every creative attempt has to impress someone, you may stop before you have something to develop. Watch for editing an idea out of existence.'],
 ['Your to-do list could take over your day','Treating every task as equally urgent can leave no room to recover or adjust. Being busy is not the same as giving the important things enough attention.'],
 ['Keeping the peace could hide a real disagreement','Saying everything is fine when it is not can make a shared plan feel unfair. A small, clear request is easier to work with than resentment that stays unspoken.'],
 ['Guessing intentions could undermine trust','A gap in information can turn into a convincing story about what someone meant. Check the facts before reacting to an interpretation.'],
 ['The next big plan could become another detour','Exploring alternatives is useful until it replaces taking a practical step. Notice when more research is helping you avoid the uncomfortable part of starting.'],
 ['You could take ownership of what you cannot control','A shared outcome may depend on decisions that are not yours to make. Carrying all the responsibility can obscure the one part you can actually move forward.'],
 ['Being available to everyone could leave no room for you','Too many invitations or group commitments can turn connection into obligation. Watch for accepting another role before checking your capacity.'],
 ['Pushing through could make a simple task feel harder','Ignoring your need for a pause can turn unfinished work into self-criticism. A temporary reset may be more useful than another round of forcing progress.']
];
// Speculative event-style astrology copy; positions do not establish that events will occur.
const goodPredictions=[
 ['A stalled personal plan could finally move','You may get the time or encouragement to begin something you have been putting off this week. A small first result could restore your confidence.'],
 ['You could get back some time you thought was spoken for','A commitment may become simpler or take less effort than expected, leaving room for something you actually want to do.'],
 ['An answer you have been waiting for may arrive','A message or conversation could clear up a misunderstanding and let a delayed task move forward.'],
 ['A tense situation at home could ease','A practical problem may get sorted out, or a conversation with someone close could make your shared space feel calmer.'],
 ['A creative effort could get an encouraging response','Something you make or share may spark interest. The response could give you a reason to keep developing it.'],
 ['A recurring task could become much easier','You may find a simpler way through a job that has been draining your time, making the rest of your week feel more manageable.'],
 ['Someone could meet you halfway','A one-to-one conversation may lead to a fairer arrangement or a shared plan that works better for both of you.'],
 ['A shared responsibility could finally get sorted','You may reach a clearer agreement about who is doing what, taking some uncertainty out of a joint commitment.'],
 ['A new idea could solve an old problem','Something you learn or hear this week may offer an approach you had not considered and get a stuck plan moving again.'],
 ['Your work could reach a satisfying milestone','A project may move from ongoing effort to a concrete result. You could finish a piece of work that has been hanging over you.'],
 ['A group plan could turn into something real','A friend or teammate may follow through on an idea you share, giving a joint activity the momentum it has been missing.'],
 ['A difficult decision could become clearer','A quieter moment may help you recognize what you want to continue and what you are ready to leave behind.']
];
const badPredictions=[
 ['A new plan could stall before it gets going','Competing priorities may interrupt something you are trying to start, leaving several loose ends and less progress than you wanted.'],
 ['A last-minute request could eat into your free time','Something that initially sounds small may take more time or effort than expected, squeezing out a plan you were looking forward to.'],
 ['A message could be taken the wrong way','A hurried exchange may cause a misunderstanding or an awkward disagreement that takes extra effort to put right.'],
 ['A home commitment could disrupt your plans','A household request or an expectation from someone close may interfere with time you had set aside for yourself.'],
 ['A creative plan could hit a frustrating delay','Revisions, second thoughts or a disappointing response may slow something you were excited to finish or share.'],
 ['Extra tasks could crowd out your original plan','Routine demands may build up and leave less time for the work or rest you had intended to protect.'],
 ['A disagreement could surface in a close relationship','Different expectations may become hard to ignore. A plan that seemed settled could need an uncomfortable conversation or a compromise.'],
 ['An unclear agreement could cause friction','You and someone else may discover that you understood a shared commitment differently, creating avoidable frustration.'],
 ['New information could send a plan back to the drawing board','An approach you were counting on may turn out to need another step, forcing you to reconsider how to proceed.'],
 ['Someone else’s delay could hold up your progress','A missing answer or unfinished handover may prevent you from completing a task when you hoped to.'],
 ['A group plan could become more demanding than expected','Other people may look to you to organise or finish more than you agreed to, making a social or team activity feel like extra work.'],
 ['An unfinished issue could keep interrupting your focus','A decision you have put off may keep returning to mind, making it harder to settle into the work or downtime you had planned.']
];
function weeklyOpportunities(week){
 const personal=week.days.flatMap(d=>d.transits||[]).filter(t=>['sextile','trine'].includes(t.type)).sort((a,b)=>a.orb-b.orb).map(t=>({sector:t.house-1,date:t.date,planet:t.planet,basis:`${t.date}: ${t.title}; whole-sign house ${t.house}. ${t.basis} Selected as a traditionally supportive aspect, not evidence of a future event.`}));
 const preferred={'Work':'Mercury','Social relationships':'Venus','Growth':'Mars','Balance':'Sun'}[week.focus]||'Sun';
 const general=[...(week.opportunityFactors||[])].sort((a,b)=>(a.planet===preferred?0:1)-(b.planet===preferred?0:1)||a.date.localeCompare(b.date));
 const chosen=[];const seen=new Set();
 for(const candidate of [...personal,...general]){if(seen.has(candidate.sector))continue;seen.add(candidate.sector);chosen.push(candidate);if(chosen.length===2)break;}
 if(!chosen.length){const index=signs.indexOf(week.sign);for(const sector of [Math.max(index,0),(Math.max(index,0)+4)%12])chosen.push({sector,date:week.days[0].date,basis:`General ${week.sign||'sign-based'} editorial prompt; relevant sky data unavailable. This is not a calculated transit or a timed opportunity.`});}
 return chosen.map(c=>{const [title,text]=goodPredictions[c.sector];return {...c,title,text,action:practicalGuidance(c.sector).tryThis,reflection:areas[c.sector].question};});
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
  opportunities:weeklyOpportunities(week),
  challenges:[week.days[0],week.days[Math.floor(week.days.length/2)]].map(d=>{const index=areas.findIndex(a=>a.watch===d.watchFor);const sector=index<0?0:index;const [avoid,manage]=prevention[sector];const [title,text]=badPredictions[sector];return {title,date:d.date,sector,text,avoid,manage,action:manage,reflection:areas[sector].question,basis:`${d.date}: ${d.source} Speculative astrology scenario; these positions do not establish that an event will occur.`};}).filter((item,i,items)=>items.findIndex(x=>x.sector===item.sector)===i),
  note:'Speculative astrology predictions for entertainment—not scientifically validated forecasts. NASA data supports planetary positions, not these predicted events.'
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
  category('Social',venus,'The social lens this week is about friendships, community and the give-and-take of everyday connections.','Reach out to a friend, make space for someone in a group conversation, or suggest a simple shared activity. Ask what support would be useful rather than assuming.','Avoid reading too much into a delayed reply. Check in directly and respect other people’s time and boundaries.'),
  category('Work & money',mercury,'Use this week to make your priorities and agreements easier to understand.','Choose one deliverable, clarify the next step with anyone involved, and review an ordinary expense against your own budget.','Keep financial choices tied to your circumstances and evidence; no transit establishes a profitable date.'),
  category('Energy & wellbeing',mars,'Consider how you spend effort and where you could make your pace more sustainable.','Alternate focused effort with a realistic pause. Choose an accessible activity you enjoy and leave room to adjust to how you actually feel.','Do not read a planetary position as a measure of your health or physical capacity.'),
  category('Growth',planetInfo('Sun'),'The growth lens invites you to notice the role you want to play in your own week.','Pick one of the daily journal questions. Answer it at the start of the week, then revisit it at the end to see what changed.','A symbolic description is an invitation to reflect, not a fixed description of your personality.'),
  category('Personal',planetInfo('Moon'),'Your personal lens makes room for emotional needs, private life and boundaries. Notice what helps you feel settled, and where you need space to be yourself.','Name one need you have been putting aside. Reserve a small amount of time for it, and communicate one boundary kindly and clearly.','A passing feeling does not have to become a lasting conclusion. Check what you need before making assumptions about yourself.')
 ];
 const uniqueMoon=[...new Set(days.map(d=>d.moon).filter(Boolean))];
 const overview=uniqueMoon.length?`Across these seven daily snapshots, the Moon moves through ${uniqueMoon.join(' → ')}. For ${sign}, the opening reflection is “${days[0].title.toLowerCase()}”; the closing reflection is “${days.at(-1).title.toLowerCase()}”. Use that progression as a structure for your week: notice what matters, take one manageable action, and then review what you learned. ${grounding}`:`Live sky data is unavailable, so this is a general ${sign} reflection plan rather than a transit-based reading. ${grounding} Begin by choosing a realistic intention, make room to review it midway through the week, and finish by noticing what you would like to carry forward.`;
 const milestones=[{label:'Open the week',day:days[0]},{label:'Midweek check-in',day:days[Math.floor(days.length/2)]},{label:'Close the week',day:days.at(-1)}];
 const events=sky.days.flatMap(day=>findAspects(day.positions).map(a=>({...a,date:day.date})));
 const closest=new Map();for(const e of events){const key=e.a+e.type+e.b;if(!closest.has(key)||e.orb<closest.get(key).orb)closest.set(key,e);}
 const highlights=[...closest.values()].sort((a,b)=>a.orb-b.orb).slice(0,4);
 const opportunityFactors=sky.days.flatMap(day=>day.positions.filter(p=>['Sun','Moon','Mercury','Venus','Mars'].includes(p.name)&&Number.isFinite(p.longitude)).map(p=>({sector:(Math.floor(((p.longitude%360)+360)%360/30)-index+12)%12,date:day.date,planet:p.name,basis:`${day.date}: ${p.name} in ${zodiac(p.longitude)}; solar-sign sector ${(Math.floor(((p.longitude%360)+360)%360/30)-index+12)%12+1} relative to ${sign}. Selected from daily snapshots for an editorial opportunity prompt; not a natal house or prediction.`})));
 return {overview,categories,milestones,highlights,days,focus,sign,opportunityFactors};
}

// Orbit's editorial interpretations are separate from astronomical calculations.
const natalStyles={
 Aries:{style:'direct, energetic and willing to initiate',need:'freedom to act and try things for yourself',strength:'courage and initiative',edge:'moving faster than others can follow'},
 Taurus:{style:'steady, sensory and patient',need:'reliability, comfort and time to settle',strength:'persistence and a grounding presence',edge:'holding on after a situation has changed'},
 Gemini:{style:'curious, adaptable and conversational',need:'variety, conversation and room to explore',strength:'connecting ideas and seeing alternatives',edge:'scattering your attention across too many possibilities'},
 Cancer:{style:'protective, receptive and attentive to belonging',need:'emotional safety and trusted connections',strength:'care and sensitivity to the atmosphere around you',edge:'retreating instead of stating what you need'},
 Leo:{style:'warm, expressive and creatively confident',need:'genuine appreciation and room for self-expression',strength:'generosity and the ability to encourage others',edge:'letting recognition become the measure of your worth'},
 Virgo:{style:'observant, practical and attentive to detail',need:'useful routines and a sense of making things better',strength:'discernment and thoughtful problem-solving',edge:'expecting perfection from yourself or others'},
 Libra:{style:'considerate, collaborative and sensitive to balance',need:'fairness, companionship and room to weigh options',strength:'diplomacy and seeing another point of view',edge:'delaying a choice to keep everyone comfortable'},
 Scorpio:{style:'focused, private and drawn to depth',need:'trust, honesty and meaningful connection',strength:'commitment and willingness to face difficult feelings',edge:'protecting yourself so tightly that others cannot reach you'},
 Sagittarius:{style:'open, exploratory and drawn to possibility',need:'freedom, learning and a sense of direction',strength:'optimism and the ability to see the bigger picture',edge:'promising more than you can realistically sustain'},
 Capricorn:{style:'deliberate, responsible and oriented toward progress',need:'clear commitments and something worthwhile to build',strength:'patience and dependable follow-through',edge:'measuring yourself only by what you achieve'},
 Aquarius:{style:'independent, inventive and interested in the collective',need:'intellectual freedom and connection around shared ideas',strength:'originality and questioning outdated assumptions',edge:'staying with an idea when a feeling needs attention'},
 Pisces:{style:'imaginative, compassionate and receptive',need:'space to dream, recover and feel connected',strength:'empathy and creative imagination',edge:'absorbing others’ needs without protecting your own limits'}
};
const natalRoles={
 Sun:['Identity & motivation','Your Sun symbolizes the qualities you grow into and what gives you a sense of purpose.','Your sense of identity may be'],
 Moon:['Emotional needs','Your Moon symbolizes instinctive reactions, comfort and the way you nurture yourself.','Your emotional responses may be'],
 Rising:['First impressions & approach','Your rising sign is the zodiac sign on the eastern horizon at birth. It symbolizes how you enter new situations and the approach others may notice first.','Your outward approach may be'],
 Mercury:['Thinking & communication','Mercury symbolizes how you process ideas, learn and express yourself.','Your communication style may be'],
 Venus:['Affection & values','Venus symbolizes what you appreciate and how you express affection and seek connection.','Your way of connecting may be'],
 Mars:['Drive & assertion','Mars symbolizes how you pursue what you want, take initiative and handle friction.','Your way of taking action may be'],
 Jupiter:['Growth & perspective','Jupiter symbolizes exploration, meaning and the ways you seek to expand your world.','Your approach to growth may be'],
 Saturn:['Commitment & boundaries','Saturn symbolizes structure, responsibility and skills developed through practice.','Your approach to commitment may be'],
 Uranus:['Change & independence','Uranus symbolizes experimentation and departures from established patterns.','Your approach to change may be'],
 Neptune:['Imagination & ideals','Neptune symbolizes imagination, ideals and the search for connection beyond the everyday.','Your imaginative style may be'],
 Pluto:['Depth & transformation','Pluto symbolizes themes of power, letting go and deep renewal.','Your approach to deep change may be']
};
const natalHouseThemes=['self-expression and first impressions','personal resources and values','learning and everyday communication','home, roots and private life','creativity, play and self-expression','daily routines, service and wellbeing','one-to-one relationships and partnership','shared resources, trust and vulnerability','study, exploration and worldview','public contribution and long-term direction','friendships, communities and shared hopes','solitude, rest and inner reflection'];
const portraitOpenings={
 Aries:'You tend to be direct, spirited and willing to make the first move. Having something to pursue can bring out your courage, though waiting for others may test your patience.',
 Taurus:'You tend to be steady, affectionate and drawn to the things that make life feel comfortable and real. You give things time to grow, although letting go of a familiar situation can be difficult.',
 Gemini:'You tend to be curious, quick-thinking and interested in people and their stories. You enjoy fresh ideas and variety, though having so many possibilities can make it hard to settle on one.',
 Cancer:'You tend to be caring, sensitive and protective of the people close to you. Familiar places and small signs of thoughtfulness can mean a lot, and you may need time to open up when you feel unsure.',
 Leo:'You tend to be warm, expressive and generous with your encouragement. There is a playful, creative side to you that wants room to shine, though feeling overlooked can hurt more than you show.',
 Virgo:'You tend to be thoughtful, observant and good at noticing what could be made better. You often show care through practical help, but can be harder on yourself than the situation deserves.',
 Libra:'You tend to be considerate, sociable and drawn to balance and harmony. You can see several sides of a situation, which helps you understand people but can make decisions difficult when someone might be disappointed.',
 Scorpio:'You tend to be intense, perceptive and selective about who gets close. You value honesty and depth, and may keep a private inner world that only trusted people get to see.',
 Sagittarius:'You tend to be open, enthusiastic and interested in what lies beyond the familiar. Learning and new experiences can lift your spirits, though excitement may sometimes run ahead of what you can follow through on.',
 Capricorn:'You tend to be responsible, patient and serious about the things that matter to you. You prefer to build something dependable, but may forget to give yourself credit while concentrating on what still needs doing.',
 Aquarius:'You tend to be independent, original and comfortable questioning the usual way of doing things. You enjoy fresh ideas and shared causes, though explaining a feeling may be less comfortable than exploring an idea.',
 Pisces:'You tend to be sensitive, kind and imaginative, easily moved by the atmosphere around you. A creative or dreamy side can give ordinary experiences depth, though caring for others can sometimes leave too little space for yourself.'
};
export function explainNatal(chart){
 if(!chart)return null;
 const points=[...chart.planets,{name:'Rising',...chart.ascendant}];
 const placements=points.map(p=>{
  const traits=natalStyles[p.sign],role=natalRoles[p.name];
  const house=p.house?`Whole-sign house ${p.house} places this theme in ${natalHouseThemes[p.house-1]}.`:'';
  const generational=['Uranus','Neptune','Pluto'].includes(p.name)?' This slow-moving planet’s sign is shared by many people in a generation; its house adds context to your chart.':'';
  return {name:p.name,sign:p.sign,house:p.house,title:`${p.name} in ${p.sign}`,label:role[0],meaning:role[1],text:`${role[2]} ${traits.style}. ${house}${generational}`.trim(),strength:`A potential strength: ${traits.strength}.`,growth:`A pattern to notice: ${traits.edge}.`,need:`You may value ${traits.need}.`};
 });
 const sun=placements.find(p=>p.name==='Sun'),moon=placements.find(p=>p.name==='Moon'),rising=placements.find(p=>p.name==='Rising');
 const s=natalStyles[sun.sign],m=natalStyles[moon.sign],r=natalStyles[rising.sign];
 const inner=`${portraitOpenings[sun.sign]} Underneath, you need ${m.need}. ${rising.sign===sun.sign?'People often see that same side of you straight away':`From the outside, you can seem ${r.style}`}. ${rising.sign===moon.sign?'The way you come across may make your emotional needs easier to see.':'That first impression may not show everything you feel or need in private.'}`;
 const styleOf=name=>{const p=placements.find(p=>p.name===name);return p?natalStyles[p.sign]:null;};
 const venus=styleOf('Venus'),mercury=styleOf('Mercury'),mars=styleOf('Mars'),saturn=styleOf('Saturn');
 const relationships=venus?`With people you care about, you can be ${venus.style}. You value ${venus.need}, and often bring ${venus.strength} to a relationship. The balance to watch is ${venus.edge}; caring about someone does not mean putting your own needs aside.`:'';
 const thinking=mercury?`Your mind works in a way that is ${mercury.style}. ${mars?`When something matters to you, you draw on ${mars.strength} to move it forward. `:''}${saturn?`Taking responsibility can bring out ${saturn.strength}, but it helps to notice when you are ${saturn.edge}. `:''}Giving yourself room to learn, rather than expecting to have everything worked out, can help those strengths develop.`:'';
 const summary=[inner,relationships,thinking].filter(Boolean).join('\n\n');
 const synthesis=sun.sign===moon.sign&&moon.sign===rising.sign?`All three share ${sun.sign}, emphasizing a similar symbolic style across identity, emotional needs and outward approach. The other placements add different shades to this picture.`:`These parts can express themselves differently: the first impression you make may differ from what helps you feel secure or what gives you purpose. Read them together, and notice which descriptions fit your actual experience.`;
 return {title:'Your personality, through your chart',note:'An astrological portrait for reflection, not a scientifically validated personality assessment. These are possibilities to explore, not fixed traits.',summary,synthesis,guide:'A birth chart is a snapshot of the sky at your birth. Planets describe symbolic themes, signs describe how those themes may be expressed, and houses describe areas of life. Orbit uses the tropical zodiac and whole-sign houses, with the rising sign as the first house.',bigThree:[sun,moon,rising],placements:placements.filter(p=>!['Sun','Moon','Rising'].includes(p.name)),question:`Where does ${s.strength} show up in your life, and what helps you make room for ${m.need}?`};
}
export function natalExplanationText(chart){
 const p=explainNatal(chart);if(!p)return '';
 return [p.title,p.note,p.guide,p.summary,p.synthesis,...[...p.bigThree,...p.placements].map(x=>[x.title+' — '+x.label,x.meaning,x.text,x.need,x.strength,x.growth].join('\n')),'Reflect: '+p.question].join('\n\n');
}
