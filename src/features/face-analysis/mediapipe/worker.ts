import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { estimatePose, imageQuality, QualityError, validateFaceGeometry, validateImageQuality } from '../quality';
import { measure } from '../measurements';
import { classify } from '../classification';
import { outline } from '../landmarks';
import type { WorkerReply } from '../types';
let landmarker: FaceLandmarker | undefined;
let delegate: 'GPU' | 'CPU' = 'GPU';
const send = (message: WorkerReply) => self.postMessage(message);
async function initialize() {
  send({type:'status',message:'Loading the local analysis engine…',progress:12});
  const vision = await FilesetResolver.forVisionTasks('/mediapipe/wasm');
  send({type:'status',message:'Opening the face landmark model on your device…',progress:48});
  const options = { runningMode: 'IMAGE' as const, numFaces: 2, minFaceDetectionConfidence: .6, minFacePresenceConfidence: .6, outputFaceBlendshapes: false, outputFacialTransformationMatrixes: true };
  try {
    landmarker = await FaceLandmarker.createFromOptions(vision, {...options, baseOptions:{modelAssetPath:'/models/face_landmarker.task',delegate:'GPU'}});
  } catch {
    delegate='CPU';
    send({type:'status',message:'Using compatible CPU processing on your device…',progress:65});
    landmarker = await FaceLandmarker.createFromOptions(vision,{...options,baseOptions:{modelAssetPath:'/models/face_landmarker.task',delegate:'CPU'}});
  }
  send({type:'ready',delegate});
}
self.onmessage = async (event: MessageEvent<{type:'init'|'analyze';image?:ImageBitmap}>) => {
  const image=event.data.image;
  try {
    if (event.data.type==='init') { await initialize(); return; }
    if (!landmarker || !image) throw new Error('The analysis engine is not ready. Reset the tool and try again.');
    send({type:'status',message:'Finding your face and checking your photo…',progress:28});
    const detected=landmarker.detect(image);
    validateFaceGeometry(detected.faceLandmarks,image.width,image.height);
    const pose=estimatePose(detected.facialTransformationMatrixes[0]?.data);
    validateFaceGeometry(detected.faceLandmarks,image.width,image.height,pose);
    const landmarks=detected.faceLandmarks[0];
    const xs=outline.map(i=>landmarks[i].x*image.width), ys=outline.map(i=>landmarks[i].y*image.height);
    const x=Math.max(0,Math.min(...xs)),y=Math.max(0,Math.min(...ys));
    const w=Math.min(image.width-x,Math.max(...xs)-x),h=Math.min(image.height-y,Math.max(...ys)-y);
    const canvas=new OffscreenCanvas(256,Math.max(1,Math.round(256*h/w)));
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    if (!ctx) throw new Error('Image quality checks are unavailable in this browser. Try an updated browser.');
    ctx.drawImage(image,x,y,w,h,0,0,canvas.width,canvas.height);
    const quality=imageQuality(ctx.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height);
    canvas.width=canvas.height=0;
    validateImageQuality(quality);
    send({type:'status',message:'Measuring proportions and comparing face shapes…',progress:78});
    const measurements=measure(landmarks,image.width,image.height,pose);
    send({type:'result',result:{landmarks,measurements,classification:classify(measurements),pose,quality,delegate}});
  } catch(error) {
    const graphicsUnavailable=error instanceof Error&&/webgl|activeTexture|GL context|graphics context/i.test(error.message);
    send({type:'error',message:error instanceof QualityError?'Let’s try a better photo.':graphicsUnavailable?'Browser graphics support is unavailable. This model needs WebGL even with CPU processing. Enable browser graphics acceleration or try another current browser.':event.data.type==='init'?'The local model could not load. Check your connection, close memory-heavy tabs, and retry. A current browser with WebAssembly and WebGL is required.':'Analysis could not finish on this device. Try a smaller photo, close memory-heavy tabs, or use another current browser.',issues:error instanceof QualityError?error.issues:undefined});
  } finally { image?.close(); }
};
