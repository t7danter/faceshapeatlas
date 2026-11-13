import {it,expect}from 'vitest';
import {FaceLandmarker}from '@mediapipe/tasks-vision';
import {outline,indices}from '../../src/features/face-analysis/landmarks';
it('uses a closed face outline whose edges are in the pinned official MediaPipe topology',()=>{
  const edges=new Set(FaceLandmarker.FACE_LANDMARKS_FACE_OVAL.flatMap(({start,end})=>[`${start}:${end}`,`${end}:${start}`]));
  for(let i=0;i<outline.length;i++)expect(edges.has(`${outline[i]}:${outline[(i+1)%outline.length]}`)).toBe(true);
  for(const key of ['top','chin','cheekLeft','cheekRight','upperLeft','upperRight','jawLeft','jawRight']as const)expect(outline).toContain(indices[key]);
});
