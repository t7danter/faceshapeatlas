import type { FaceShape } from '../config';
const outlines: Record<FaceShape, string> = {
  oval: 'M50 12C25 12 18 34 22 58C25 79 37 92 50 94C63 92 75 79 78 58C82 34 75 12 50 12Z',
  round: 'M50 16C27 16 15 32 15 52C15 75 29 90 50 90C71 90 85 75 85 52C85 32 73 16 50 16Z',
  square: 'M50 16C25 16 17 27 17 46L21 75Q24 90 50 91Q76 90 79 75L83 46C83 27 75 16 50 16Z',
  heart: 'M50 15C28 10 15 25 18 47C20 65 34 83 50 95C66 83 80 65 82 47C85 25 72 10 50 15Z',
  diamond: 'M50 10Q29 14 23 34L14 53Q28 79 50 96Q72 79 86 53L77 34Q71 14 50 10Z',
  oblong: 'M50 7C30 7 23 21 23 40L25 71C28 90 39 98 50 98C61 98 72 90 75 71L77 40C77 21 70 7 50 7Z',
};
export default function ShapeIcon({ shape, className = '' }: { shape: FaceShape; className?: string }) {
  return <svg className={`shape-icon ${className}`} viewBox="0 0 100 108" fill="none" aria-hidden="true"><path d={outlines[shape]} fill="currentColor" fillOpacity=".07" stroke="currentColor" strokeWidth="1.8"/><path d="M32 46h9m18 0h9M49 49l-3 13h7M42 73q8 5 16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M17 55h66M50 9v87" stroke="currentColor" opacity=".25" strokeDasharray="3 4"/></svg>;
}
