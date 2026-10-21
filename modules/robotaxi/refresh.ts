// Bounded hosted update run, using the original collectors, paid receipts, workers and report compiler.
import { sql, closeDb } from "@aihot/backend/db";
import { getBoss, stopBoss } from "@aihot/backend/jobs/queue";
import { registerContentJobs } from "@aihot/backend/jobs/content";
import { registerEventJobs } from "@aihot/backend/jobs/events";
import { registerPublicationJobs } from "@aihot/backend/jobs/publication";
import { collectSource } from "@aihot/backend/sources/collect";
import { composeDueReports } from "@aihot/backend/reports/compose";
import { beijingAt, beijingDate } from "@aihot/contracts/time";
import { EDITION_TIMES } from "@aihot/site";
if(process.env.COLLECT_ENABLED!=="true"||process.env.MODEL_CALLS_ENABLED!=="true") throw new Error("Update requires explicit collection and model-call authorization flags");
const began=Date.now(),deadline=began+45*60_000;
const boss=await getBoss();await registerContentJobs(boss);await registerEventJobs(boss);await registerPublicationJobs(boss);
try {
 const sources=await sql<{id:string}[]>`SELECT id FROM sources WHERE enabled AND kind NOT IN ('external','mp_account') ORDER BY id`;
 let successful=0;
 for(const {id} of sources){const r=await collectSource(id);console.log(JSON.stringify({source:id,status:r.status,found:r.found,created:r.created}));if(r.status==="ok")successful++;if(Date.now()>deadline)throw new Error("Collection exceeded deadline");}
 if(!successful)throw new Error("No source collected successfully; preserve last successful site");
 let empty=0;
 while(empty<3){const [{n}]=await sql<{n:number}[]>`SELECT count(*)::int AS n FROM pgboss.job WHERE name IN ('content.analyze','content.extract-body','events.group','events.digest','publication.republish-source','media.prepare') AND state IN ('created','retry','active')`;empty=n===0?empty+1:0;if(Date.now()>deadline)throw new Error("Processing did not drain before deadline");await new Promise(r=>setTimeout(r,1000));}
 const date=beijingDate(new Date()),edition=beijingAt(date,EDITION_TIMES.daily);
 while(Date.now()<+edition){if(+edition-began>100*60_000)throw new Error("Run outside morning update window; use the regular worker");await new Promise(r=>setTimeout(r,1000));}
 const result=await composeDueReports(new Date());console.log(JSON.stringify(result));
 const [report]=await sql`SELECT 1 FROM reports WHERE kind='daily' AND key=${date}`;
 if(!report)throw new Error(`No verified daily edition for ${date}; do not deploy stale content as today's update`);
}finally{await stopBoss();await closeDb();}
