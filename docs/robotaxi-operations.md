# RoboTaxi 运行与发布

## 已定制

保留 AIHOT 原站布局和采编引擎；站名为 RoboTaxi，行业为 Robotaxi。分类覆盖技术进展、项目规模、业界动态、融资并购、全球布局、国内进展，并保留研究/实践/观点。门槛仍为上游数值（60/65/76），未声称在新行业已校准。

首次可通过 `node --env-file=.env modules/robotaxi/import-reviewed.ts site/reviewed-bootstrap.json` 导入已核对的17条公开资料（14条资讯及背景、3条历史视频索引），无模型评分；其中近期资料构成明确标识的人工迁移特刊，不代表自动采集成功。旧资料保留原日期。

## 本地

Node >=24.11，PostgreSQL 17。`npm ci`，配置 `.env`（不提交），保持开发安全阀关闭，运行迁移及 seed。分别启动 API、worker 和 web。此机器使用 WEB_PORT=3100，API_PORT=3001，独立 PostgreSQL 端口55432；不占用已有3000端口服务。

检查：`npm run typecheck`；`DATABASE_URL=postgres://.../robotaxi_test npm test`；`npm run build -w @aihot/web && node --test apps/web/tests/*.test.ts`；`node scripts/smoke.ts --base http://localhost:3100`。

## 静态导出

`npm run export:static -- --base http://localhost:3100 --prefix robot-taxi.news`。

产物为 `dist/static/`，包括原站 SSR HTML、原构建 CSS/字体/报头，以及公开图片代理的导出副本；模块中的官方图像索引继续引用原来源图片，需联网。导出只经公开 HTTP 页面读取，不直接读数据库，不包含后台、会话或密钥。内部页面链接和归档切换改成原生静态链接；移除需要动态服务的脚本，禁用不可用操作。静态阅读版不会假装提供实时搜索、收藏、反馈表单、API/MCP。导出失败不部署半成品。`export-manifest.json` 记录导出时间和实际页面列表。

静态公开内容不能自动响应来源撤稿。收到撤稿或许可变化后须立即更新动态站并重新导出、部署；不能只等次日定时任务。静态快照是用户要求的独立发布出口，不沿用动态服务的实时缓存保证。

## 每天08:00之前

已改为[本地 Codex 晨间采编](local-codex-update.md)：每天北京时间06:30搜索、核对并提交结构化内容，GitHub 工作流恢复公开历史数据、构建静态HTML并部署。目标08:00前完成。本路径不需要模型API密钥和云数据库；已移除原来05:30依赖API的云端定时采集任务。原安全阀保持关闭。

更新依赖本机开机联网、Codex登录与额度、GitHub登录。定时任务与发布可能延迟，不提供严格SLA。工作流可手动选择codex模式恢复所有本地Codex期刊，也可选择bootstrap模式只恢复首版资料。

## 信源覆盖

初始清单包含 Waymo、Zoox、Pony.ai、WeRide、百度以及 TechCrunch、Electrek、CnEVPost。2026-10-21 已试抓：TechCrunch、Electrek、CnEVPost 成功；Waymo 本机网络失败（RSS 地址已核对）；Zoox 返回JS壳、WeRide旧列表404、Pony/百度403，这4个源已在初始化配置中暂停，待确认入口，不冒充已接通。正式打开采集前通过后台逐源试抓，确认 URL、选择器、日期与实际内容。来源页面不稳定时保留健康错误，不将失败说成成功。

YouTube 可经已确认频道 RSS 或外部推送接入；Facebook 使用具有许可的导出或外部推送，框架没有原生 Facebook 抓取器。X 可用原生 x_search + SocialData。没有凭据和授权时不可承诺这些平台全量覆盖。所有全文与全文RSS开关默认关闭。

## 已确认与后续决定

1. 用户已确认首版使用规则与隐私说明：维护账号 littleweb，联系渠道为仓库 Issues。后续可更换专用邮箱。
2. 仅在将来改回原模型流水线时，需要模型服务、预算和标注样本；本地Codex路径不依赖这些配置。
3. 本机持续可用，或迁移到常驻Codex主机；接受调度与发布可能延迟。
4. 公开信源白名单、公众号/视频账号与平台服务凭据。
5. 是否启用自定义域名 robot-taxi.news；需拥有域名并配置 DNS。默认地址为 GitHub Pages 项目地址。
