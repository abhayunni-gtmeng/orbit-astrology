import {signs} from './reading.mjs';

// Editorial astrology scenarios, not evidence about a partner or future events.
const singleGood=[
 'Making the first move could lead to a new conversation', 'A slower connection could feel more comfortable than expected',
 'A first conversation could turn into a date', 'An introduction in a familiar setting could feel promising',
 'A playful encounter could spark attraction', 'Someone you see in your routine could become more interesting',
 'A casual invitation could become a proper one-to-one date', 'An honest conversation could build a deeper connection',
 'Someone outside your usual type could catch your attention', 'A clearer plan could turn vague interest into a real meeting',
 'A shared-interest group could lead to a new connection', 'Time away from dating could clarify what you want next'
];
const singleBad=[
 'A fast start could fizzle before you know each other', 'Different priorities could spoil an initially good impression',
 'A promising chat could lose momentum', 'A familiar connection could feel too close too soon',
 'Flirtation could stop short of a real date', 'Conflicting schedules could interrupt a new connection',
 'A date could reveal different expectations', 'Opening up quickly could leave you feeling exposed',
 'Excitement about someone new could outrun what you know', 'A promising plan could stay stuck in scheduling',
 'A group connection could be difficult to move beyond friendship', 'Replaying a past connection could distract you from the present'
];
const situationGood=[
 'Saying what you want could move the connection forward', 'A conversation about priorities could bring more consistency',
 'A direct exchange could clear up mixed messages', 'A quieter meeting could make the connection feel more comfortable',
 'A shared activity could bring back some playfulness', 'A workable routine could make seeing each other easier',
 'A conversation could give your arrangement a clearer shape', 'A boundary discussion could make closeness feel more secure',
 'Trying something different together could refresh the connection', 'A vague promise could become a concrete plan',
 'Time in a group could reveal how your connection works in everyday life', 'A little distance could make your own needs clearer'
];
const situationBad=[
 'Different speeds could create friction', 'An uneven arrangement could become harder to ignore',
 'Mixed messages could lead to a misunderstanding', 'Different needs for closeness could disrupt a plan',
 'Chemistry could mask a lack of follow-through', 'Repeated scheduling problems could become frustrating',
 'A label conversation could reveal incompatible expectations', 'An unspoken boundary could cause an uncomfortable moment',
 'Different ideas about the future could pull a plan apart', 'Another delayed plan could leave the connection feeling stalled',
 'Different expectations in a group setting could feel awkward', 'Silence could lead to more guessing rather than clarity'
];
const guidance=[
 ['Make one low-pressure invitation and leave room for a no.','Avoid treating an intense first exchange as a commitment.','Slow the pace and check whether interest is being reciprocated.'],
 ['Name one preference that would make dating feel sustainable.','Avoid agreeing to an arrangement that repeatedly sidelines your needs.','State what works for you and let the response inform your next choice.'],
 ['Ask one direct question instead of decoding hints.','Avoid drawing a conclusion from one ambiguous message.','Clarify what was meant without accusing or repeatedly chasing a reply.'],
 ['Choose a setting and pace where you feel comfortable.','Avoid sharing more than you want just to create closeness.','Restate your comfort level and change or leave the plan if needed.'],
 ['Suggest an enjoyable activity rather than staying in endless chat.','Avoid treating flirtation as proof of a future relationship.','Look for mutual follow-through, not just exciting words.'],
 ['Offer a realistic time to meet, with one alternative.','Avoid reorganising your whole week around uncertain plans.','Keep your own plans and ask for a clear reschedule if you want one.'],
 ['Say what kind of connection you are open to.','Avoid assuming you have agreed on exclusivity or commitment.','Ask explicitly and decide whether the actual arrangement suits you.'],
 ['Share one need or boundary at a pace that feels safe.','Avoid treating vulnerability as something the other person owes you.','Pause, clarify the boundary and respect each person’s choice.'],
 ['Be curious about differences without rushing to fill in the gaps.','Avoid building a future around a person you are still getting to know.','Return to what has actually been said and done.'],
 ['Turn a vague intention into one specific, mutually agreed plan.','Avoid putting other parts of your life on hold for an unconfirmed date.','Ask once for clarity, then make your own plans.'],
 ['Notice whether a shared activity feels comfortable and inclusive.','Avoid using friends or social media to test or monitor the connection.','Speak privately and directly about an awkward moment.'],
 ['Give yourself quiet time to identify what you want from dating.','Avoid interpreting silence as proof of hidden feelings.','Separate facts from guesses and choose a boundary that protects your time.']
];

export function relationshipReading(week,mode='single'){
 if(!['single','situationship'].includes(mode))throw Error('Choose Single or Situationship.');
 if(!week?.days?.length)throw Error('Generate your week first.');
 const venus=week.opportunityFactors?.find(p=>p.planet==='Venus');
 const contacts=week.days.flatMap(d=>d.transits||[]).filter(t=>['Venus','Moon'].includes(t.target)).sort((a,b)=>a.orb-b.orb);
 const factor=types=>{
  const contact=contacts.find(t=>types.includes(t.type));
  if(contact)return {sector:contact.house-1,date:contact.date,basis:`${contact.date}: ${contact.title}; whole-sign house ${contact.house}. ${contact.basis} This is an editorial scenario, not evidence of another person’s feelings.`};
  if(venus){const natal=week.natal;const sector=natal?(venus.sector+signs.indexOf(week.sign)-signs.indexOf(natal.ascendant.sign)+12)%12:venus.sector;return {sector,date:venus.date,basis:natal?`${venus.date}: Transiting Venus in whole-sign house ${sector+1}, calculated from your ${natal.ascendant.sign} rising sign. No matching sampled relationship aspect was selected; the scenario uses the house theme only.`:venus.basis};}
  return {sector:Math.max(0,signs.indexOf(week.sign)),date:week.days[0].date,basis:`Venus sky data unavailable. General ${week.sign} editorial relationship scenario, not a calculated weekly transit.`};
 };
 const goodFactor=factor(['sextile','trine']),badFactor=factor(['square','opposition']);
 const goodTitles=mode==='single'?singleGood:situationGood,badTitles=mode==='single'?singleBad:situationBad;
 return {mode,note:'One person’s chart only. Speculative astrology predictions for entertainment—not scientifically validated forecasts. They cannot reveal another person’s feelings, intentions or future choices.',
  good:{...goodFactor,title:goodTitles[goodFactor.sector],action:guidance[goodFactor.sector][0]},
  bad:{...badFactor,title:badTitles[badFactor.sector],avoid:guidance[badFactor.sector][1],manage:guidance[badFactor.sector][2]}};
}
