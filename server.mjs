import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {calculateNatal} from './shared/natal.mjs';
const root=fileURLToPath(new URL('.',import.meta.url));
import {getSky} from './shared/sky-service.mjs';
const files={'/situations-v1.png':'public/situations-v1.png','/calculations':'public/calculations.html','/calculations.mjs':'public/calculations.mjs','/':'public/index.html','/app.mjs':'public/app.mjs','/result-sources.mjs':'public/result-sources.mjs','/birth.mjs':'public/birth.mjs','/style.css':'public/style.css','/detail.css':'public/detail.css','/shared/reading.mjs':'shared/reading.mjs','/shared/transits.mjs':'shared/transits.mjs'};
http.createServer(async(req,res)=>{
 try{const url=new URL(req.url,'http://localhost');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(url.pathname==='/api/natal'&&req.method==='POST'){
   res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json');
   if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`){res.writeHead(403);return res.end(JSON.stringify({error:'Invalid request origin.'}));}
   try{let body='';for await(const chunk of req){body+=chunk;if(body.length>4096)throw Error('Request too large.');}const chart=calculateNatal(JSON.parse(body));res.end(JSON.stringify(chart));}catch(error){res.writeHead(400);res.end(JSON.stringify({error:error instanceof SyntaxError?'Invalid request.':error.message}));}return;
  }
  if(req.method!=='GET'){res.writeHead(405);return res.end();}
  if(url.pathname==='/api/places'){
   res.setHeader('Content-Type','application/json');const name=(url.searchParams.get('q')||'').trim();
   if(name.length<2||name.length>100){res.writeHead(400);return res.end(JSON.stringify({error:'Enter a city name between 2 and 100 characters.'}));}
   try{const query=new URLSearchParams({name,count:'6',language:'en',format:'json'});const r=await fetch('https://geocoding-api.open-meteo.com/v1/search?'+query,{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error();const data=await r.json();res.end(JSON.stringify({results:(data.results||[]).map(p=>({name:[p.name,p.admin1,p.country].filter(Boolean).join(', '),latitude:p.latitude,longitude:p.longitude,timezone:p.timezone}))}));}catch{res.writeHead(503);res.end(JSON.stringify({error:'Place search unavailable. Enter coordinates and timezone manually.'}));}return;
  }
  if(url.pathname==='/api/sky'){
   const date=url.searchParams.get('date')||new Date().toISOString().slice(0,10);
   if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date||Math.abs(Date.parse(date)-Date.now())>32*86400000){res.writeHead(400,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:'Choose a date within 31 days of today.'}));}
   try{const sky=await getSky(date);res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'public, max-age=3600'});res.end(JSON.stringify(sky));}catch{res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'NASA/JPL is temporarily unavailable. Try again shortly.'}));}return;
  }
  if(!files[url.pathname]){res.writeHead(404);return res.end('Not found');}
  const file=files[url.pathname];const type=file.endsWith('.png')?'image/png':file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':'text/javascript';res.writeHead(200,{'Content-Type':type+'; charset=utf-8'});res.end(await readFile(root+file));
 }catch{res.writeHead(500);res.end('Server error');}
}).listen(process.env.PORT||4173,'127.0.0.1',()=>console.log('Orbit is ready at http://localhost:4173'));
