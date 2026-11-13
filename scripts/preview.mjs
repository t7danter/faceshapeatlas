// Local-only static preview server. Nothing from this file is deployed to Pages.
import http from 'node:http';
import path from 'node:path';
import {readFile,stat,mkdir,appendFile}from 'node:fs/promises';
import {fileURLToPath}from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const audit=fileURLToPath(new URL('../.local/preview-requests.jsonl',import.meta.url));
await mkdir(path.dirname(audit),{recursive:true});
const headers=(await readFile(path.join(root,'_headers'),'utf8')).split(/\r?\n/).filter(line=>line.startsWith('  ')&&!line.trim().startsWith('Cache-Control')).map(line=>{const i=line.indexOf(':');return[line.slice(0,i).trim(),line.slice(i+1).trim()];});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.wasm':'application/wasm','.task':'application/octet-stream','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
const server=http.createServer(async(req,res)=>{
  for(const[k,v]of headers)res.setHeader(k,v);
  const url=new URL(req.url,'http://127.0.0.1:4321');
  await appendFile(audit,JSON.stringify({time:new Date().toISOString(),method:req.method,path:url.pathname,contentLength:req.headers['content-length']||'0'})+'\n');
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end('Static preview: GET and HEAD only.');return;}
  try{const pathname=decodeURIComponent(url.pathname);let file=path.resolve(root,'.'+pathname);const relative=path.relative(root,file);if(relative.startsWith('..')||path.isAbsolute(relative)){res.writeHead(403);res.end();return;}if((await stat(file)).isDirectory())file=path.join(file,'index.html');const data=await readFile(file);res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-cache');res.writeHead(200);res.end(req.method==='HEAD'?undefined:data);}catch{res.setHeader('Content-Type','text/html');res.writeHead(404);res.end(await readFile(path.join(root,'404.html')));}
});
server.listen(4321,'127.0.0.1',()=>console.log('FaceShape Studio static preview: http://127.0.0.1:4321/ (Cloudflare security headers enabled)'));
