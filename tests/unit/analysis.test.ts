import { describe,it,expect } from 'vitest';
import { normalizeLandmarks, validateLandmarks } from '../../src/features/face-analysis/landmarks';
import { measure,angle } from '../../src/features/face-analysis/measurements';
import { classify,prototypes } from '../../src/features/face-analysis/classification';
import { estimatePose,validateFaceGeometry,validateImageQuality,imageQuality } from '../../src/features/face-analysis/quality';
import { shapes } from '../../src/config';
import { landmarks,neutralPose,identity,measurements } from '../fixtures/landmarks';
describe('landmarks and measurement geometry',()=>{
  it('normalizes portrait coordinates without stretching geometry',()=>{const p=normalizeLandmarks(landmarks(),800,1200);expect(p[10].y).toBeCloseTo(.225);expect(p[234].x).toBe(.25);});
  it('rejects missing selected landmarks',()=>{const p=landmarks();p.length=200;expect(()=>validateLandmarks(p)).toThrow('incomplete');});
  it('rejects non-finite landmarks',()=>{const p=landmarks();p[454].x=NaN;expect(()=>validateLandmarks(p)).toThrow();});
  it('rejects invalid image dimensions',()=>{expect(()=>normalizeLandmarks(landmarks(),0,100)).toThrow('dimensions');});
  it('calculates expected ratios and reciprocal width ratios',()=>{const m=measure(landmarks(),1000,1000,neutralPose);expect(m.lengthToWidth).toBeCloseTo(1.4);expect(m.jawToCheek).toBeCloseTo(.8);expect(m.foreheadToCheek).toBeCloseTo(.88);expect(m.cheekToJaw*m.jawToCheek).toBeCloseTo(1);expect(m.symmetryDeviation).toBeCloseTo(0);expect(m.foreheadEstimated).toBe(true);});
  it('is invariant to image resize and coordinate translation',()=>{const a=measure(landmarks(),1000,1000,neutralPose);const shifted=landmarks().map(p=>({x:p.x*.7+.1,y:p.y*.7+.1,z:p.z*.7}));const b=measure(shifted,2000,2000,neutralPose);expect(b.lengthToWidth).toBeCloseTo(a.lengthToWidth);expect(b.jawToCheek).toBeCloseTo(a.jawToCheek);});
  it('corrects rectangular image aspect ratio',()=>{const p=landmarks().map(p=>({...p,y:p.y/2}));expect(measure(p,1000,2000,neutralPose).lengthToWidth).toBeCloseTo(1.4);});
  it('withholds symmetry when perspective is unreliable',()=>{expect(measure(landmarks(),1000,1000,{yaw:6,pitch:0,roll:0}).symmetryDeviation).toBeNull();});
  it('measures a right angle and rejects a degenerate contour',()=>{expect(angle({x:0,y:1,z:0},{x:0,y:0,z:0},{x:1,y:0,z:0})).toBe(90);expect(()=>angle({x:0,y:0,z:0},{x:0,y:0,z:0},{x:1,y:0,z:0})).toThrow();});
});
describe('six-class transparent scoring',()=>{
  for(const shape of shapes)it(`matches the ${shape} engineering prototype`,()=>{const c=classify(measurements([...prototypes[shape]]));expect(c.primary).toBe(shape);expect(c.scores[0].score).toBe(100);expect(c.scores).toHaveLength(6);expect(c.secondary).not.toBe(c.primary);});
  it('labels a boundary case as ambiguous',()=>{const values=prototypes.oval.map((v,i)=>(v+prototypes.oblong[i])/2);expect(classify(measurements(values)).ambiguous).toBe(true);});
  it('labels weak matches as ambiguous',()=>{expect(classify(measurements([2.8,.5,.4,90])).ambiguous).toBe(true);});
  it('does not normalize match scores into probabilities',()=>{expect(classify(measurements()).scores.reduce((a,b)=>a+b.score,0)).toBeGreaterThan(100);});
  it('rejects invalid measurements',()=>{expect(()=>classify(measurements([NaN,.8,.8,150]))).toThrow();});
});
describe('photo quality gates',()=>{
  it('rejects no face',()=>expect(()=>validateFaceGeometry([],1000,1000)).toThrow('No face'));
  it('rejects multiple faces',()=>expect(()=>validateFaceGeometry([landmarks(),landmarks()],1000,1000)).toThrow('More than one'));
  it('rejects a small face',()=>expect(()=>validateFaceGeometry([landmarks()],200,200)).toThrow('closer'));
  it('rejects a clipped contour',()=>{const p=landmarks();p[10].y=0;expect(()=>validateFaceGeometry([p],1000,1000)).toThrow('entire face');});
  it('accepts a suitable frontal outline',()=>expect(()=>validateFaceGeometry([landmarks()],1000,1000,neutralPose)).not.toThrow());
  for(const axis of ['yaw','pitch','roll'] as const)it(`rejects excessive ${axis}`,()=>expect(()=>validateFaceGeometry([landmarks()],1000,1000,{...neutralPose,[axis]:11})).toThrow());
  it('requires verifiable pose',()=>expect(()=>estimatePose(undefined)).toThrow('pose'));
  it('extracts neutral pose from an identity transform',()=>{const p=estimatePose(identity);expect(p.yaw).toBeCloseTo(0);expect(p.pitch).toBeCloseTo(0);expect(p.roll).toBeCloseTo(0);});
  it('extracts a 20 degree yaw from a scaled column-major matrix',()=>{const a=20*Math.PI/180,m=[Math.cos(a)*2,0,-Math.sin(a)*2,0,0,2,0,0,Math.sin(a)*2,0,Math.cos(a)*2,0,0,0,0,1];expect(estimatePose(m).yaw).toBeCloseTo(20);});
  it('rejects dark, overexposed and blurred images',()=>{expect(()=>validateImageQuality({brightness:20,sharpness:50})).toThrow('brighter');expect(()=>validateImageQuality({brightness:245,sharpness:50})).toThrow('overexposed');expect(()=>validateImageQuality({brightness:120,sharpness:2})).toThrow('blurry');});
  it('measures constant pixels as zero sharpness',()=>{const pixels=new Uint8ClampedArray(16*16*4).fill(128);const q=imageQuality(pixels,16,16);expect(q.brightness).toBeCloseTo(128);expect(q.sharpness).toBeCloseTo(0);});
});
