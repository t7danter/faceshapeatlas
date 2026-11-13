import { indices as I, outline } from '../landmarks';
import type { Landmark } from '../types';
export default function Overlay({points,width,height,landmarks,lines,contour}:{points:Landmark[];width:number;height:number;landmarks:boolean;lines:boolean;contour:boolean}){
  const p=(i:number)=>`${points[i].x*width},${points[i].y*height}`;
  return <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" aria-label="Facial outline and measurement overlay" role="img">
    {contour&&<polygon points={outline.map(p).join(' ')} fill="none" stroke="#d9baff" strokeWidth="2" vectorEffect="non-scaling-stroke"/>}
    {lines&&[[I.top,I.chin,'#fff'],[I.cheekLeft,I.cheekRight,'#a4f6dc'],[I.jawLeft,I.jawRight,'#ffd695']].map(([a,b,color])=><line key={a} x1={points[Number(a)].x*width} y1={points[Number(a)].y*height} x2={points[Number(b)].x*width} y2={points[Number(b)].y*height} stroke={String(color)} strokeWidth="2" vectorEffect="non-scaling-stroke"/>)}
    {landmarks&&[...new Set([...outline,...Object.values(I)])].map(i=><circle key={i} cx={points[i].x*width} cy={points[i].y*height} r={Math.max(width,height)*.004} fill="#fff" stroke="#75638f" strokeWidth="1" vectorEffect="non-scaling-stroke"/>)}
  </svg>;
}
