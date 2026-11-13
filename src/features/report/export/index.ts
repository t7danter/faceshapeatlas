import { brand, titleCase, type FaceShape } from '../../../config';
import { getRecommendations, type HairLength, type StylePreference } from '../../recommendations';
import type { Analysis } from '../../face-analysis/types';
export interface Report { brand: string; generated: string; shape: string; automaticShape: string; secondary: string; adjusted: boolean; ambiguous: boolean; measurements: {label:string;value:string}[]; hairstyles: {name:string;description:string}[]; glasses: {name:string;description:string}[]; volume: string; parting: string; privacy: string; explanation: string; photoUrl?: string }
export function createReport(result: Analysis, selected: FaceShape, preference: StylePreference, length: HairLength, date = new Date(), photoUrl?: string): Report {
  const m=result.measurements, r=getRecommendations(selected,preference,length);
  return {brand:brand.name,generated:date.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),shape:titleCase(selected),automaticShape:titleCase(result.classification.primary),secondary:titleCase(result.classification.secondary),adjusted:selected!==result.classification.primary,ambiguous:result.classification.ambiguous,measurements:[
    {label:'Face length / cheekbone width',value:m.lengthToWidth.toFixed(2)},
    {label:'Cheekbone / jaw width',value:m.cheekToJaw.toFixed(2)},
    {label:'Estimated upper face / cheekbone',value:m.foreheadToCheek.toFixed(2)},
    {label:'Jaw / cheekbone width',value:m.jawToCheek.toFixed(2)},
    {label:'Paired-landmark mismatch',value:m.symmetryDeviation===null?'Unavailable at this pose':`${(m.symmetryDeviation*100).toFixed(1)}% of cheekbone width`},
  ],hairstyles:r.hairstyles,glasses:r.glasses,volume:r.volume,parting:r.parting,privacy:'Your photo was analyzed on your device, not uploaded. This report is yours to keep. Ratios describe geometry; match scores are heuristics, not probabilities or beauty ratings.',explanation:result.classification.explanation,...(photoUrl?{photoUrl}: {})};
}
function wrap(ctx: CanvasRenderingContext2D,text:string,x:number,y:number,maxWidth:number,lineHeight:number) {
  let line='';
  for(const word of text.split(' ')) { const test=line?`${line} ${word}`:word; if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,y);line=word;y+=lineHeight;}else line=test; }
  if(line)ctx.fillText(line,x,y);return y+lineHeight;
}
export async function downloadReportCard(report: Report) {
  const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=2100;
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Report rendering is unavailable in this browser. Please use Print / Save PDF.');
  ctx.fillStyle='#f6f8fd';ctx.fillRect(0,0,1200,2100);
  ctx.fillStyle='#104feb';ctx.font='24px sans-serif';ctx.fillText(report.brand,70,80);
  ctx.font='18px sans-serif';ctx.fillText(report.generated,70,115);
  ctx.fillStyle='#14233f';ctx.font='54px sans-serif';ctx.fillText(`${report.shape} · your style study`,70,200);
  ctx.fillStyle='#536580';ctx.font='22px sans-serif';let y=wrap(ctx,`${report.adjusted?'Manually selected. ':''}Automatic match: ${report.automaticShape}; also explore ${report.secondary}. ${report.ambiguous?'Mixed match — categories overlap.':'Approximate geometric result.'}`,70,250,1060,32);
  if(report.photoUrl){const image=new Image();image.src=report.photoUrl;await image.decode();const scale=Math.min(220/image.width,250/image.height);ctx.drawImage(image,70,y+10,image.width*scale,image.height*scale);y+=280;}
  y+=20;ctx.font='28px sans-serif';ctx.fillStyle='#14233f';ctx.fillText('Your proportions',70,y);y+=45;
  for(const m of report.measurements){ctx.font='21px sans-serif';ctx.fillStyle='#536580';ctx.fillText(m.label,70,y);ctx.fillStyle='#14233f';ctx.fillText(m.value,650,y);y+=45;}
  y+=20;ctx.font='28px sans-serif';ctx.fillText('Styles you may want to try',70,y);y+=40;
  ctx.font='21px sans-serif';ctx.fillStyle='#536580';
  for(const h of report.hairstyles.slice(0,3))y=wrap(ctx,`${h.name}: ${h.description}`,70,y,1060,30)+15;
  if(!report.hairstyles.length)y=wrap(ctx,'No hair styles match these filters. Change your preferences in the tool to explore more.',70,y,1060,30)+15;
  y=wrap(ctx,report.volume,70,y+10,1060,30)+10;y=wrap(ctx,report.parting,70,y,1060,30)+30;
  ctx.font='28px sans-serif';ctx.fillStyle='#14233f';ctx.fillText('Frames to explore',70,y);y+=40;ctx.font='21px sans-serif';ctx.fillStyle='#536580';
  for(const g of report.glasses)y=wrap(ctx,`${g.name}: ${g.description}`,70,y,1060,30)+12;
  y+=20;ctx.strokeStyle='#dce5f5';ctx.beginPath();ctx.moveTo(70,y);ctx.lineTo(1130,y);ctx.stroke();ctx.font='18px sans-serif';y=wrap(ctx,report.privacy,70,y+40,1060,28)+30;
  const trimmed=document.createElement('canvas');trimmed.width=1200;trimmed.height=Math.min(2100,y);trimmed.getContext('2d')?.drawImage(canvas,0,0);canvas.width=canvas.height=0;
  const blob=await new Promise<Blob>((resolve,reject)=>trimmed.toBlob(b=>b?resolve(b):reject(new Error('Could not create report. Try Print / Save PDF.')),'image/png'));
  trimmed.width=trimmed.height=0;
  const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`${brand.name.toLowerCase()}-report.png`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
