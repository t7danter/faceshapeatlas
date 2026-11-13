import type { FaceShape } from '../../config';
export interface Landmark { x: number; y: number; z: number }
export interface Pose { yaw: number; pitch: number; roll: number }
export interface Measurements {
  lengthToWidth: number;
  cheekToJaw: number;
  foreheadToCheek: number;
  jawToCheek: number;
  jawAngle: number;
  symmetryDeviation: number | null;
  foreheadEstimated: true;
}
export interface Classification { primary: FaceShape; secondary: FaceShape; scores: { shape: FaceShape; score: number }[]; ambiguous: boolean; explanation: string }
export interface Analysis { landmarks: Landmark[]; measurements: Measurements; classification: Classification; pose: Pose; quality: { brightness: number; sharpness: number }; delegate: 'GPU' | 'CPU' }
export type WorkerReply = { type: 'status'; message: string; progress: number } | { type: 'ready'; delegate: 'GPU' | 'CPU' } | { type: 'result'; result: Analysis } | { type: 'error'; message: string; issues?: string[] };
