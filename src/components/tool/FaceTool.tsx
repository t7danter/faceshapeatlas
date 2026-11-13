import { useEffect, useRef, useState } from 'react';
import type { Analysis, WorkerReply } from '../../features/face-analysis/types';
import { prepareImage } from '../../lib/image/input';
import Camera from './Camera';
import Results from './Results';
type Photo={url:string;blob:Blob;width:number;height:number};
export default function FaceTool({ compact = false }: { compact?: boolean }){
  const worker=useRef<Worker|null>(null),input=useRef<HTMLInputElement>(null),timeout=useRef<ReturnType<typeof setTimeout>|undefined>(undefined),photoRef=useRef<Photo|null>(null),generation=useRef(0),mounted=useRef(true);
  const [ready,setReady]=useState(false),[status,setStatus]=useState(compact ? '' : 'Preparing private on-device analysis…'),[progress,setProgress]=useState(0),[initializing,setInitializing]=useState(!compact),[working,setWorking]=useState(false),[decoding,setDecoding]=useState(false),[camera,setCamera]=useState(false),[dragging,setDragging]=useState(false),[confirmed,setConfirmed]=useState(false),[error,setError]=useState<{message:string;issues?:string[]}|null>(null),[photo,setPhoto]=useState<Photo|null>(null),[result,setResult]=useState<Analysis|null>(null);
  function release(){generation.current++;if(photoRef.current)URL.revokeObjectURL(photoRef.current.url);photoRef.current=null;}
  function stopWorker(){clearTimeout(timeout.current);worker.current?.terminate();worker.current=null;}
  function startWorker(){stopWorker();setReady(false);setInitializing(true);setStatus('Preparing private on-device analysis…');setError(null);setProgress(0);
    if(!window.Worker||!window.WebAssembly||!window.createImageBitmap||!window.OffscreenCanvas){setInitializing(false);setError({message:'This browser is missing on-device analysis features. Please use a current Chrome, Edge, Firefox or Safari browser.'});return;}
    try{const current=new Worker('/mediapipe/analysis-worker.js');worker.current=current;
      timeout.current=setTimeout(()=>{stopWorker();setInitializing(false);setError({message:'The local model took too long to load. Check your connection and retry.'});},90000);
      current.onmessage=(event:MessageEvent<WorkerReply>)=>{if(worker.current!==current)return;const data=event.data;
        if(data.type==='status'){setStatus(data.message);setProgress(data.progress);}
        if(data.type==='ready'){clearTimeout(timeout.current);setReady(true);setInitializing(false);setStatus(`Ready · private ${data.delegate} processing`);}
        if(data.type==='result'){clearTimeout(timeout.current);setResult(data.result);setWorking(false);setStatus('Analysis complete · your photo stayed on your device');}
        if(data.type==='error'){clearTimeout(timeout.current);setWorking(false);setInitializing(false);setStatus(data.issues?'Photo needs attention · review the guidance below':'Analysis unavailable · review the guidance below');setError({message:data.message,issues:data.issues});}
      };
      current.onerror=()=>{stopWorker();setReady(false);setWorking(false);setInitializing(false);setError({message:'The analysis engine could not run in this browser. Close memory-heavy tabs or try another current browser, then retry.'});};
      current.postMessage({type:'init'});
    }catch{setInitializing(false);setError({message:'The local analysis worker could not start. Try another current browser.'});}
  }
  useEffect(()=>{
    mounted.current = true;
    if (!compact) startWorker();
    const leave = () => {
      release();
      stopWorker();
      setPhoto(null);
      setResult(null);
      setCamera(false);
      setReady(false);
      setWorking(false);
      setInitializing(false);
      setDecoding(false);
      setConfirmed(false);
      setError(null);
      setStatus('');
      if (input.current) input.current.value = '';
    };
    const restore = (event: PageTransitionEvent) => {
      if (event.persisted && !compact) startWorker();
    };
    window.addEventListener('pagehide', leave);
    window.addEventListener('pageshow', restore);
    return () => {
      mounted.current = false;
      release();
      stopWorker();
      window.removeEventListener('pagehide', leave);
      window.removeEventListener('pageshow', restore);
    };
  },[compact]);
  async function choose(file?: File) {
    if (!file || working || decoding) return;
    const token = ++generation.current;
    setDecoding(true);
    setError(null);
    setResult(null);
    setConfirmed(false);
    setCamera(false);
    try {
      const prepared = await prepareImage(file);
      if (!mounted.current || token !== generation.current) return;
      if (photoRef.current) URL.revokeObjectURL(photoRef.current.url);
      const next = { ...prepared, url: URL.createObjectURL(prepared.blob) };
      photoRef.current = next;
      setPhoto(next);
      if (compact && !worker.current) startWorker();
    } catch (e) {
      if (mounted.current && token === generation.current) {
        setError({ message: e instanceof Error ? e.message : 'Could not open this photo. Try another image.' });
      }
    } finally {
      if (mounted.current && token === generation.current) {
        setDecoding(false);
        if (input.current) input.current.value = '';
      }
    }
  }
  async function analyze(){if(!photo||!worker.current||!ready||!confirmed)return;setWorking(true);setError(null);setProgress(5);setStatus('Preparing your photo in memory…');const current=worker.current,token=generation.current;
    try{const bitmap=await createImageBitmap(photo.blob);if(current!==worker.current||token!==generation.current){bitmap.close();return;}timeout.current=setTimeout(()=>{stopWorker();setReady(false);setWorking(false);setError({message:'Analysis exceeded this device’s time limit. Try a smaller photo or restart the engine.'});},45000);current.postMessage({type:'analyze',image:bitmap},[bitmap]);}
    catch(e){setWorking(false);setError({message:e instanceof Error?e.message:'Could not prepare the analysis. Try a smaller photo.'});}
  }
  function reset(){
    release();
    setPhoto(null);
    setResult(null);
    setConfirmed(false);
    setError(null);
    setWorking(false);
    setDecoding(false);
    setCamera(false);
    if (compact) {
      stopWorker();
      setReady(false);
      setInitializing(false);
      setStatus('');
    } else {
      startWorker();
    }
  }
  return <>{status && <div className="tool-status" role="status" aria-live="polite"><span className="status-dot"/>{status}</div>}<div className="screen-only">
    <input className="visually-hidden" tabIndex={-1} ref={input} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Choose a photo" onChange={e=>void choose(e.target.files?.[0])}/>
    {(initializing||working||decoding)&&<div className="working" aria-live="polite"><p>{decoding?'Preparing an optimized copy of your photo…':status}</p><progress max={100} value={decoding?undefined:progress} aria-label="Analysis progress"/>{working&&<button className="button small" onClick={()=>{stopWorker();setReady(false);reset();}}>Cancel analysis</button>}</div>}
    {error&&<div className="error-box" role="alert"><strong>{error.message}</strong>{error.issues&&<ul>{error.issues.map(issue=><li key={issue}>{issue}</li>)}</ul>}{!ready && !initializing && (!compact || photo) && <button className="button small" style={{marginTop:12}} onClick={startWorker}>Retry local engine</button>}</div>}
    {!result&&<>{camera&&<Camera onCapture={file=>void choose(file)} onClose={()=>setCamera(false)}/>}{!photo ? <div className={compact ? 'upload-card compact-upload' : 'upload-card'}>
      <div className={`drop-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={event => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={event => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files.length === 1) void choose(event.dataTransfer.files[0]);
          else setError({ message: 'Choose one photo at a time.' });
        }}>
        <div>
          {!compact && <><div className="upload-icon" aria-hidden="true">↥</div><h2>Start with a photo of you.</h2><p>Drag &amp; drop a photo here, or choose how to begin.</p></>}
          <div className="button-row">
            <button className="button primary" disabled={decoding} onClick={() => input.current?.click()}>Choose a photo</button>
            <button className="button" disabled={decoding} onClick={() => setCamera(true)}>Use my camera</button>
          </div>
          <p className="file-hint">{compact ? 'Drop a photo here · JPG, PNG or WebP · Up to 10 MB' : 'JPG, PNG or WebP · Up to 10 MB · One face'}</p>
        </div>
      </div>
      {!compact && <div className="photo-tips">
        <div><strong>Face forward</strong><p>Camera at eye level. Head upright. Relax your expression.</p></div>
        <div><strong>Find soft light</strong><p>A sharp photo in even light works best. Skip filters.</p></div>
        <div><strong>Keep it clear</strong><p>Show your full face. Move hair and coverings away.</p></div>
      </div>}
    </div>:<div className="upload-card preview-layout"><div className="image-stage"><img src={photo.url} width={photo.width} height={photo.height} alt="Your selected photo, ready for local analysis"/></div><div className="preview-controls"><span className="eyebrow">READY WHEN YOU ARE</span><h2>A clear photo makes a difference.</h2><p style={{fontSize:'.85rem'}}>Check that your whole face is visible, evenly lit and looking straight ahead. The tool will check pose, size and sharpness before measuring.</p><label className="check-label"><input type="checkbox" checked={confirmed} disabled={working} onChange={e=>setConfirmed(e.target.checked)}/>My entire face is visible, without hair, sunglasses, a mask or other objects covering the outline, eyes or jaw.</label><p className="result-note">Automatic checks cannot detect every covering. Retake the photo if you are unsure.</p><button className="button primary" disabled={!ready||!confirmed||working||decoding} onClick={()=>void analyze()}>{working?'Analyzing on your device…':'Analyze my face ↗'}</button><button className="button" disabled={working||decoding} onClick={()=>input.current?.click()}>Choose a different photo</button><button className="button" disabled={working||decoding} onClick={()=>setCamera(true)}>Retake with camera</button><button className="button" disabled={working} onClick={reset}>Remove photo & reset</button></div></div>}</>}
    </div>{result&&photo&&<Results result={result} photo={photo.url} width={photo.width} height={photo.height} onReset={reset}/>}
    <p className="privacy-copy">{compact ? 'Your photo stays on your device.' : 'Your photo is analyzed directly in your browser. It is not uploaded to our servers.'}<br/><a className="text-link" href="/privacy/">How your privacy is protected</a></p>
  </>;
}
