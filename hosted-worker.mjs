import assets from 'orbit-assets';
import {calculateNatal} from './shared/natal.mjs';
import {getSky} from './shared/sky-service.mjs';
const json=(data,status=200,cache='no-store')=>Response.json(data,{status,headers:{'Cache-Control':cache,'X-Content-Type-Options':'nosniff'}});
export default {async fetch(req){
 const url=new URL(req.url);
 try{
  if(url.pathname==='/api/natal'&&req.method==='POST'){
   if(req.headers.get('origin')&&req.headers.get('origin')!==url.origin)return json({error:'Invalid request origin.'},403);
   if(Number(req.headers.get('content-length'))>4096)return json({error:'Request too large.'},413);
   const reader=req.body?.getReader();let total=0,body='';const decoder=new TextDecoder();
   if(reader){while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>4096){await reader.cancel();return json({error:'Request too large.'},413);}body+=decoder.decode(value,{stream:true});}body+=decoder.decode();}
   try{return json(calculateNatal(JSON.parse(body)));}catch(e){return json({error:e instanceof SyntaxError?'Invalid request.':e.message},400);}
  }
  if(req.method!=='GET')return json({error:'Method not allowed.'},405);
  if(url.pathname==='/api/sky'){
   const date=url.searchParams.get('date')||new Date().toISOString().slice(0,10);
   if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date||Math.abs(Date.parse(date)-Date.now())>32*86400000)return json({error:'Choose a date within 31 days of today.'},400);
   try{return json(await getSky(date),200,'private, max-age=3600');}catch{return json({error:'NASA/JPL is temporarily unavailable. Try again shortly.'},503);}
  }
  if(url.pathname==='/api/places'){
   const name=(url.searchParams.get('q')||'').trim();if(name.length<2||name.length>100)return json({error:'Enter a city name between 2 and 100 characters.'},400);
   try{const r=await fetch('https://geocoding-api.open-meteo.com/v1/search?'+new URLSearchParams({name,count:'6',language:'en',format:'json'}),{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error();const data=await r.json();return json({results:(data.results||[]).map(p=>({name:[p.name,p.admin1,p.country].filter(Boolean).join(', '),latitude:p.latitude,longitude:p.longitude,timezone:p.timezone}))});}catch{return json({error:'Place search unavailable. Enter coordinates and timezone manually.'},503);}
  }
  const asset=assets[url.pathname];if(!asset)return new Response('Not found',{status:404});
  return new Response(asset.binary?Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0)):asset.body,{headers:{'Content-Type':asset.type,'X-Content-Type-Options':'nosniff','Cache-Control':'private, max-age=0, must-revalidate','Referrer-Policy':'strict-origin-when-cross-origin'}});
 }catch{return json({error:'Unable to complete request.'},500);}
}};
