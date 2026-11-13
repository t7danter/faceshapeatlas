export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export function validateFile(file: { size: number; type: string; name: string }) {
  if (!file.size) throw new Error('This file is empty. Choose a JPG, PNG or WebP photo.');
  if (file.size > MAX_FILE_SIZE) throw new Error('Please choose a photo smaller than 10 MB.');
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || !/\.(jpe?g|png|webp)$/i.test(file.name)) throw new Error('Choose a JPG, JPEG, PNG or WebP image. Other file types are not supported.');
}
export function validSignature(bytes: Uint8Array, type: string) {
  if (type === 'image/jpeg') return bytes[0]===255 && bytes[1]===216 && bytes[2]===255;
  if (type === 'image/png') return [137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n);
  return type==='image/webp' && String.fromCharCode(...bytes.slice(0,4))==='RIFF' && String.fromCharCode(...bytes.slice(8,12))==='WEBP';
}
export function analysisSize(width: number, height: number) {
  if (!(width > 0 && height > 0) || width*height > 80_000_000) throw new Error('This image is too large to decode safely. Export a smaller photo first.');
  const scale = Math.min(1, 2048 / Math.max(width, height));
  return { width: Math.max(1,Math.round(width*scale)), height: Math.max(1,Math.round(height*scale)) };
}
export async function prepareImage(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  validateFile(file);
  if (!validSignature(new Uint8Array(await file.slice(0,16).arrayBuffer()), file.type)) throw new Error('This file does not contain a valid supported image. Please export it again.');
  let decoded: ImageBitmap;
  try { decoded = await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch { throw new Error('This image could not be opened. Try another JPG, PNG or WebP photo.'); }
  try {
    const size = analysisSize(decoded.width, decoded.height);
    const canvas = document.createElement('canvas'); canvas.width=size.width; canvas.height=size.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Your browser cannot prepare this image. Try a current browser.');
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,size.width,size.height); ctx.drawImage(decoded,0,0,size.width,size.height);
    const blob = await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Not enough memory to prepare this photo. Try a smaller image.')),'image/jpeg',.94));
    canvas.width=canvas.height=0;
    return {blob,...size};
  } finally { decoded.close(); }
}
