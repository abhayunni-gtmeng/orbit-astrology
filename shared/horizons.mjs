export function parseHorizons(payload){
 if(payload.error)throw Error('JPL rejected the ephemeris request.');
 if(!['1.2','1.3'].includes(payload.signature?.version))throw Error('Unrecognized JPL response version.');
 const block=payload.result?.split('$$SOE')[1]?.split('$$EOE')[0];if(!block)throw Error('Missing JPL ephemeris table.');
 const rows=block.trim().split('\n').map(line=>{const cols=line.split(',').map(s=>s.trim());const longitude=Number(cols[3]),latitude=Number(cols[4]);if(!cols[3]||!Number.isFinite(longitude)||longitude<0||longitude>=360||!Number.isFinite(latitude))throw Error('Invalid JPL position.');return {longitude,latitude};});
 if(rows.length<7)throw Error('Incomplete JPL week.');return rows.slice(0,7);
}
