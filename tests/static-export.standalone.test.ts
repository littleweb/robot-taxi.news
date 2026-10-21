// The static edition must keep native navigation and assets without exporting admin/backend calls.
import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
test("static snapshot rewrites original report/archive links and excludes private dynamic operations", async () => {
 const temp=await mkdtemp(path.join(os.tmpdir(),'robotaxi-static-'));const root=path.resolve(import.meta.dirname,'..');
 const server=createServer((_req,res)=>{if(_req.url?.startsWith('/logo.svg')){res.setHeader('content-type','image/svg+xml');res.end('<svg xmlns="http://www.w3.org/2000/svg"/>');return;}res.setHeader('content-type','text/html');res.end('<html><head><title>RoboTaxi</title><link rel="stylesheet" href="/assets/site.css"><script>fetch("/admin/private")</script></head><body><a href="/daily?kind=review#one">日报</a><a href="/admin">后台</a><img src="/logo.svg"><form action="/api/feedback"><button>提交</button></form></body></html>');});
 await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));const port=(server.address() as {port:number}).port;
 try{await mkdir(path.join(temp,'apps/web/build/client/assets'),{recursive:true});await writeFile(path.join(temp,'apps/web/build/client/assets/site.css'),'body{color:white}');await writeFile(path.join(temp,'LICENSE'),'MIT');
 const status=await new Promise<number|null>((resolve,reject)=>{const child=spawn(process.execPath,[path.join(root,'scripts/export-static.ts'),'--base',`http://127.0.0.1:${port}`,'--prefix','robot-taxi.news','--out',path.join(temp,'result')],{cwd:temp,stdio:'ignore'});child.once('error',reject);child.once('exit',resolve);});assert.equal(status,0);
 const html=await readFile(path.join(temp,'result/index.html'),'utf8');assert.match(html,/\/robot-taxi\.news\/daily\/query-[a-f0-9]+\/index\.html#one/);assert.ok(!html.includes('<script>'));assert.ok(!html.includes('href="/admin"'));assert.ok(!html.includes('<form'));assert.ok(!html.includes('/api/feedback'));assert.match(html,/assets\/snapshot\/.*\.svg/);assert.match(html,/静态阅读版/);
 const manifest=JSON.parse(await readFile(path.join(temp,'result/export-manifest.json'),'utf8'));assert.ok(manifest.pages.includes('/daily?kind=review'));assert.ok(!manifest.pages.includes('/admin'));
 }finally{await new Promise<void>(r=>server.close(()=>r()));await rm(temp,{recursive:true,force:true});}
});
