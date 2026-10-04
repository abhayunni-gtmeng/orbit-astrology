import * as Astronomy from 'astronomy-engine';
import {Temporal} from '@js-temporal/polyfill';
import {zodiac,angularDistance} from './reading.mjs';
export function comparePosition(name,date,longitude){
 const calculated=Astronomy.Ecliptic(Astronomy.GeoVector(name,new Date(date+'T00:00:00Z'),true)).elon;
 return {longitude:calculated,difference:angularDistance(calculated,longitude),source:'Astronomy Engine',url:'https://github.com/cosinekitty/astronomy'};
}
export const normalize=x=>(x%360+360)%360;
export function birthInstant(input){
 if(!input||!/^\d{4}-\d{2}-\d{2}$/.test(input.date||'')||!/^\d{2}:\d{2}$/.test(input.time||'')||typeof input.timezone!=='string')throw Error('Enter a birth date, time and IANA timezone.');
 const [year,month,day]=input.date.split('-').map(Number),[hour,minute]=input.time.split(':').map(Number);
 if(year<1900||year>new Date().getUTCFullYear())throw Error('Birth dates are supported from 1900 to today.');
 let zoned;
 try{zoned=Temporal.ZonedDateTime.from({year,month,day,hour,minute,timeZone:input.timezone},{overflow:'reject',disambiguation:'reject'});}
 catch{throw Error('Invalid date/time/timezone, or this clock time is ambiguous or skipped by daylight saving. Check the birth record and timezone.');}
 if(zoned.epochMilliseconds>Date.now())throw Error('Birth date and time cannot be in the future.');
 return {utc:new Date(zoned.epochMilliseconds),offset:zoned.offset,timezone:zoned.timeZoneId};
}
export function ascendant(date,latitude,longitude){
 if(!Number.isFinite(latitude)||Math.abs(latitude)>66||!Number.isFinite(longitude)||Math.abs(longitude)>180)throw Error('Enter valid coordinates. Rising-sign charts currently support latitudes from 66°S to 66°N.');
 const time=Astronomy.MakeTime(date),rad=Math.PI/180,lst=(Astronomy.SiderealTime(time)*15+longitude)*rad,lat=latitude*rad;
 const rotation=Astronomy.Rotation_ECT_EQD(time);
 const x=Astronomy.RotateVector(rotation,new Astronomy.Vector(1,0,0,time)),y=Astronomy.RotateVector(rotation,new Astronomy.Vector(0,1,0,time));
 const zenith=[Math.cos(lat)*Math.cos(lst),Math.cos(lat)*Math.sin(lst),Math.sin(lat)],east=[-Math.sin(lst),Math.cos(lst),0];
 const dot=(v,w)=>v.x*w[0]+v.y*w[1]+v.z*w[2];
 let angle=Math.atan2(-dot(x,zenith),dot(y,zenith));
 if(dot(x,east)*Math.cos(angle)+dot(y,east)*Math.sin(angle)<0)angle+=Math.PI;
 return normalize(angle/rad);
}
export function houseFor(longitude,rising){return (Math.floor(normalize(longitude)/30)-Math.floor(normalize(rising)/30)+12)%12+1;}
export function calculateNatal(input){
 const {utc,offset,timezone}=birthInstant(input);
 const rising=ascendant(utc,input.latitude,input.longitude);
 const planets=['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'].map(name=>{
  const p=Astronomy.Ecliptic(Astronomy.GeoVector(name,utc,true));
  return {name,longitude:p.elon,latitude:p.elat,sign:zodiac(p.elon),house:houseFor(p.elon,rising)};
 });
 return {utc:utc.toISOString(),offset,timezone,latitude:input.latitude,longitude:input.longitude,ascendant:{longitude:rising,sign:zodiac(rising)},planets,houses:Array.from({length:12},(_,i)=>({number:i+1,longitude:normalize(Math.floor(rising/30)*30+i*30),sign:zodiac(Math.floor(rising/30)*30+i*30)})),system:'Western tropical · whole-sign houses',source:'Astronomy Engine (local calculation)',precision:'Approximate positions; displayed to 0.1°. Birth-time accuracy and historical timezone records limit precision.'};
}
