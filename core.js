/* No network dependencies. Shared validation protects restored and locally stored data. */
(function(root){
 'use strict';
 const moods=['편안해요','기뻐요','답답해요','가라앉아요','여러 감정','모르겠어요'];
 const situations=['일상','운동 전','운동 후','이동','식사','소비','만남','하루 돌아보기'];
 const dateOK=v=>typeof v==='string'&&v.length<=40&&Number.isFinite(Date.parse(v));
 function validate(data){
  if(!data||data.version!==1||!Array.isArray(data.entries)||data.entries.length>10000)throw Error('지원되는 이음 백업 파일이 아니에요.');
  const seen=new Set();
  return {version:1,entries:data.entries.map(e=>{
   if(!e||typeof e.id!=='string'||e.id.length<1||e.id.length>100||seen.has(e.id)||typeof e.note!=='string'||e.note.length>2000||!situations.includes(e.situation)||!(e.mood===''||moods.includes(e.mood))||(!e.note.trim()&&!e.mood)||!dateOK(e.eventAt)||!dateOK(e.createdAt)||!dateOK(e.updatedAt)||!(e.deletedAt===null||dateOK(e.deletedAt)))throw Error('기록 형식이 맞지 않아 복원하지 않았어요.');
   seen.add(e.id);return {id:e.id,note:e.note,mood:e.mood,situation:e.situation,eventAt:e.eventAt,createdAt:e.createdAt,updatedAt:e.updatedAt,deletedAt:e.deletedAt};
  })};
 }
 function merge(current,incoming){const a=validate(current),b=validate(incoming),ids=new Set(a.entries.map(e=>e.id));return validate({version:1,entries:[...a.entries,...b.entries.filter(e=>!ids.has(e.id))]});}
 function localValue(date=new Date()){const d=new Date(date);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);}
 const api={moods,situations,validate,merge,localValue};root.IeumCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
