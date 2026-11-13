import {describe,it,expect}from 'vitest';
import {validateFile,validSignature,analysisSize,MAX_FILE_SIZE}from '../../src/lib/image/input';
import {getRecommendations}from '../../src/features/recommendations';
import {createReport}from '../../src/features/report/export';
import {shapes}from '../../src/config';
import {classify}from '../../src/features/face-analysis/classification';
import {landmarks,measurements,neutralPose}from '../fixtures/landmarks';
import type {Analysis}from '../../src/features/face-analysis/types';
describe('file validation',()=>{
  for(const [type,name]of [['image/jpeg','photo.jpg'],['image/jpeg','photo.JPEG'],['image/png','photo.png'],['image/webp','photo.webp']])it(`accepts ${name}`,()=>expect(()=>validateFile({type,name,size:1000})).not.toThrow());
  it('rejects wrong types, empty files and excessive bytes',()=>{expect(()=>validateFile({type:'text/html',name:'photo.jpg',size:30})).toThrow();expect(()=>validateFile({type:'image/jpeg',name:'photo.jpg',size:0})).toThrow('empty');expect(()=>validateFile({type:'image/jpeg',name:'photo.jpg',size:MAX_FILE_SIZE+1})).toThrow('10 MB');});
  it('checks the actual file signature',()=>{expect(validSignature(new Uint8Array([255,216,255]),'image/jpeg')).toBe(true);expect(validSignature(new Uint8Array([60,104,116,109,108]),'image/jpeg')).toBe(false);expect(validSignature(new Uint8Array([137,80,78,71,13,10,26,10]),'image/png')).toBe(true);});
  it('resizes proportionally to a maximum 2048 pixels',()=>{expect(analysisSize(6000,4000)).toEqual({width:2048,height:1365});expect(analysisSize(500,800)).toEqual({width:500,height:800});expect(()=>analysisSize(10000,10000)).toThrow('large');});
});
describe('local recommendations',()=>{
  for(const shape of shapes)it(`maps ${shape} to useful, uniquely identified hair and glasses suggestions`,()=>{const r=getRecommendations(shape);expect(r.hairstyles.length).toBe(6);expect(r.glasses.length).toBe(3);expect(new Set(r.hairstyles.map(h=>h.id)).size).toBe(6);for(const length of ['short','medium','long'])expect(r.hairstyles.some(h=>h.hairLength===length)).toBe(true);expect(r.volume.length).toBeGreaterThan(30);expect(r.parting.length).toBeGreaterThan(30);});
  it('applies user-selected length and style without sensitive inference',()=>{const r=getRecommendations('oval','masculine','short');expect(r.hairstyles.length).toBe(2);expect(r.hairstyles.every(h=>h.hairLength==='short'&&['neutral','masculine'].includes(h.stylePreference))).toBe(true);});
  it('returns an honest empty state for an unsupported filter combination',()=>expect(getRecommendations('oval','masculine','long').hairstyles).toHaveLength(0));
});
describe('report data and privacy',()=>{
  const m=measurements();const result:Analysis={landmarks:landmarks(),measurements:m,classification:classify(m),pose:neutralPose,quality:{brightness:128,sharpness:50},delegate:'CPU'};
  it('includes date, measurements, recommendations and a privacy explanation',()=>{const r=createReport(result,'oval','all','any',new Date('2026-11-11T12:00:00Z'));expect(r.generated).toContain('2026');expect(r.measurements).toHaveLength(5);expect(r.hairstyles).toHaveLength(6);expect(r.glasses).toHaveLength(3);expect(r.privacy).toContain('not uploaded');});
  it('excludes photo and landmarks by default',()=>{const r=createReport(result,'oval','all','any');expect(r).not.toHaveProperty('photoUrl');expect(r).not.toHaveProperty('landmarks');});
  it('only includes a photo when explicitly provided',()=>expect(createReport(result,'oval','all','any',new Date(),'blob:local').photoUrl).toBe('blob:local'));
  it('distinguishes manual selection from automatic geometry',()=>{const r=createReport(result,'heart','all','any');expect(r.adjusted).toBe(true);expect(r.shape).toBe('Heart');expect(r.automaticShape).toBe('Oval');expect(r.hairstyles[0].name).toContain('pixie');});
});
