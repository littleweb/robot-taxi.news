// Import the source-verified stories reviewed during the initial setup, with no model score.
// Dates are the original source dates; this is not an automated collection run.
import { readFile } from "node:fs/promises";
import { detachFromFact } from "@aihot/backend/events/corrections";
import { sql, closeDb } from "@aihot/backend/db";
import { upsertMaterial } from "@aihot/backend/content/materials";
import { overrideFields } from "@aihot/backend/admin/content";
import { dailyEdition, arrangeDaily, sectionOf, SECTION_ORDER } from "@aihot/backend/reports/edition";
import { dailyMetrics } from "@aihot/backend/reports/compose";
import { beijingDate, beijingAt, addDays } from "@aihot/contracts/time";
import { EDITION_TIMES } from "@aihot/site";
import { stopBoss } from "@aihot/backend/jobs/queue";
const source = process.argv[2];
if (!source) throw new Error("Usage: node --env-file=.env modules/robotaxi/import-reviewed.ts <reviewed.json>");
const entries = JSON.parse(await readFile(source, "utf8")) as Array<{sourceId:string;sourceName:string;tier:string;entity:string|null;date:string;url:string;title:string;summary:string;reason:string;category:string;quote:string;image?:string;tags?:string[]}>;
for (const a of entries) {
  await sql`INSERT INTO sources(id,name,kind,tier,owner_entity_id,participation_mode,enabled,site_fulltext,syndicate_fulltext) VALUES(${a.sourceId},${a.sourceName},'external',${a.tier},${a.entity},'editorial',false,false,false) ON CONFLICT(id) DO NOTHING`;
  const {articleId:id}=await upsertMaterial({sourceId:a.sourceId,url:a.url,title:a.title,publishedAt:new Date(a.date),publicationTime:a.date,bodyText:a.quote,bodyStatus:"ok",via:"import",raw:{editorialReview:true,originalDate:a.date},media:a.image?[{kind:"image",url:a.image}]:[]});
  const [{revision}]=await sql<{revision:number}[]>`SELECT revision FROM articles WHERE id=${id}`;
  const [prior]=await sql`SELECT 1 FROM analyses WHERE article_id=${id} AND input_revision=${revision}`;
  if(!prior)
  await sql`INSERT INTO analyses(article_id,input_revision,origin,relevance,category,title_zh,summary_zh,reason_zh,score,selected,tags,subjects,output) VALUES(${id},${revision},'rule','pass',${a.category},${a.title},${a.summary},${a.reason},null,false,${a.tags??['行业动态']},${a.entity?[a.entity]:[]},${sql.json({manualReview:true,source:a.url})})`;
  await detachFromFact(id,"迁移时逐条人工核实为独立报道，后续自动采集不得重写该决定","robotaxi-setup");
  await overrideFields(id,{fields:{title:a.title,summary:a.summary,reason:a.reason,category:a.category,tags:a.tags??["行业动态"],selected:true,score:null},version:Number((await sql`SELECT version FROM editorial_overrides WHERE article_id=${id}`)[0]?.version ?? 0),reason:'首次站点迁移：逐条核对原文的人工编辑导入，不代表模型评分'},'robotaxi-setup');
  console.log('Imported reviewed source:',a.url);
}
const end=new Date(),date=beijingDate(end),start=beijingAt(addDays(date,-1),EDITION_TIMES.daily);
const edition=await dailyEdition(date,start,end);const issue=arrangeDaily(edition.entries);const [lead,...rest]=issue.main;
if(lead){const content={date,lead:{title:lead.entry.title,leadParagraph:"首次迁移特刊：本期基于人工核实资料编排，尚未启用自动采集。"+lead.entry.summary},leadItemId:lead.entry.itemId,highlights:rest.slice(0,3).map(e=>e.entry.itemId),sections:SECTION_ORDER.map(label=>({label,items:issue.main.filter(e=>sectionOf(e.category)===label).map(e=>e.entry)})).filter(s=>s.items.length),flashes:issue.flashes.map(e=>e.entry),metrics:dailyMetrics(issue.main),windowStart:start.toISOString(),windowEnd:end.toISOString(),generator:{manualReview:true}};
await sql`INSERT INTO reports(kind,key,window_start,window_end,content,origin,generated_at) VALUES('daily',${date},${start},${end},${sql.json(content as never)},'manual',now()) ON CONFLICT DO NOTHING`;}
await stopBoss();await closeDb();
