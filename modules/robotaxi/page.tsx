import { Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import type { PoolResponse } from "@aihot/contracts/site";
import { loadOr404 } from "../../apps/web/app/lib/api.server.ts";
import { SITE } from "@aihot/site";
import sources from "../../industry/sources.json";
import reviewed from "../../site/reviewed-bootstrap.json";
import type { CodexEdition } from "./edition.ts";
const editions = Object.values(import.meta.glob("../../site/editions/*.json", { eager: true, import: "default" })) as CodexEdition[];
const mediaIndex = [...new Map([...reviewed, ...editions.flatMap(e => e.items)].map(i=>[i.url,i])).values()];
export const handle = { home: "featured", name: "Robotaxi" };
export async function loader({ request }: LoaderFunctionArgs) {
  const path = new URL(request.url).pathname;
  const category = path === "/financing" ? "funding" : null;
  const data = await loadOr404<PoolResponse>(`/api/site/pool${category ? `?category=${category}` : ""}`, { signal: request.signal });
  const region = path.endsWith("/china") ? "国内" : "国外";
  const ids = new Set(sources.sources.filter((s) => s.tags.includes(region)).map((s) => s.id));
  ids.add(region === "国内" ? "reviewed-hkmedia" : "reviewed-video-ev");
  return { title: path === "/financing" ? "融资概览" : path === "/industry" ? "行业报告" : `${region}媒体`, media: path.startsWith("/media/"), region, sources: sources.sources.filter((s) => s.tags.includes(region)).map((s) => ({ name: s.name + ("enabled" in s && !s.enabled ? "（待接入）" : ""), url: "feedUrl" in s.config ? s.config.feedUrl : s.config.url })), items: path.startsWith("/media/") ? data.items.filter((i) => ids.has(i.source.id) || editions.some(e=>e.items.some(a=>a.sourceId===i.source.id && a.region===region))) : data.items, images: path.startsWith("/media/") ? mediaIndex.filter((i) => (ids.has(i.sourceId) || ("region" in i && i.region === region)) && "image" in i && i.image).map((i) => ({ url: (i as {image:string}).image, source: i.url, title: i.title, date: i.date })) : [] };
}
export function meta({ data }: { data?: Awaited<ReturnType<typeof loader>> }) { return [{ title: `${data?.title ?? "行业观察"} · ${SITE.name}` }]; }
export default function Page() {
  const d = useLoaderData<typeof loader>();
  return <div className="mx-auto max-w-[1100px] py-7"><p className="text-[12px] tracking-widest text-accent">ROBOTAXI INTELLIGENCE</p><h1 className="mt-3 text-3xl font-black">{d.title}</h1><p className="mt-3 text-sm text-ink-3">{d.media ? "按已确认信源区域归类，图文与视频保留原始链接；来源地区不等于新闻发生地。" : "汇总已公开并核实的行业资料，含近期消息与明确标识的历史背景。金额、规模、时间与运营阶段以原文为准。"}</p>{d.media && <div className="mt-6 grid gap-3 sm:grid-cols-2">{d.sources.map((s) => <a className="rounded-panel border border-line p-4 text-sm hover:text-accent" key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">{s.name} ↗</a>)}</div>}{d.images.length > 0 && <section className="mt-8"><h2 className="text-xl font-bold">官方图像索引</h2><p className="mt-2 text-xs text-ink-4">原始配图与原文对应，图片需联网；版权归原来源所有。</p><div className="mt-4 grid gap-4 sm:grid-cols-2">{d.images.map(i => <a key={i.source} className="overflow-hidden rounded-panel border border-line" href={i.source} target="_blank" rel="noopener noreferrer"><img src={i.url} alt={i.title} loading="lazy" className="aspect-video w-full object-cover"/><div className="p-4"><h3 className="text-sm font-semibold">{i.title} ↗</h3><p className="mt-2 text-xs text-ink-4">{i.date} · 官方原文配图</p></div></a>)}</div></section>}<div className="mt-8 border-t border-line">{d.items.length ? d.items.map((i) => <article className="border-b border-line py-6" key={i.id}><p className="text-xs text-ink-4">{i.source.name} · {i.publishedAt?.slice(0,10)}</p><h2 className="mt-2 text-xl font-bold"><Link to={`/items/${i.id}`}>{i.title}</Link></h2><p className="mt-3 text-ink-2">{i.summary}</p></article>) : <p className="py-12 text-ink-4">暂无已发布资料。采集与模型服务配置后，这里会展示真实收录结果。</p>}</div></div>;
}
