import type { Landmark, Measurements } from '../../src/features/face-analysis/types';
import { outline } from '../../src/features/face-analysis/landmarks';
export function landmarks(): Landmark[] {
  const p=Array.from({length:478},()=>({x:.5,y:.5,z:0}));
  outline.forEach((index,i)=>{const a=-Math.PI/2+i/outline.length*Math.PI*2;p[index]={x:.5+Math.cos(a)*.25,y:.5+Math.sin(a)*.35,z:0};});
  const positions:Record<number,[number,number]>={10:[.5,.15],152:[.5,.85],234:[.25,.48],454:[.75,.48],103:[.28,.27],332:[.72,.27],172:[.30,.70],397:[.70,.70],132:[.265,.56],361:[.735,.56],148:[.43,.81],377:[.57,.81],33:[.36,.40],263:[.64,.40],1:[.5,.53]};
  for(const [index,[x,y]]of Object.entries(positions))p[Number(index)]={x,y,z:0};
  return p;
}
export const neutralPose={yaw:0,pitch:0,roll:0};
export const identity=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
export function measurements(values=[1.38,.88,.77,148]):Measurements{return{lengthToWidth:values[0],foreheadToCheek:values[1],jawToCheek:values[2],cheekToJaw:1/values[2],jawAngle:values[3],symmetryDeviation:0,foreheadEstimated:true};}
