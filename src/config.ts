export const brand = {
  name: 'FaceShapeAtlas',
  tagline: 'A little insight. A style that feels like you.',
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL || '',
};
export const shapes = ['oval', 'round', 'square', 'heart', 'diamond', 'oblong'] as const;
export type FaceShape = typeof shapes[number];
export const faceShapePath = (shape: FaceShape) => `/${shape}-face-shape/`;
export const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
