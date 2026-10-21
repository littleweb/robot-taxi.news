# RoboTaxi 首版验证（2026-10-21）

- `npm run typecheck`：通过。
- `npm test`：937 / 937 通过。
- `npm run build -w @aihot/web`：通过。
- `node --test apps/web/tests/*.test.ts`：59 / 59 通过。
- `node scripts/smoke.ts --base http://localhost:3100`：全部通过。
- 静态导出专项测试：通过；本次导出 153 个公开页面。
- 桌面黑色三栏、移动端宽度、静态链接及图片加载已核对。

首批 17 条资料保留原始发布日期，包括 3 条历史视频索引；不是 17 条今日新闻。自动采集、模型评分尚未启用，也未发生付费模型调用。

GitHub Pages 首版由人工核实资料生成；后续已改为本地 Codex 06:30 检索核对并提交公开期刊，GitHub 用临时数据库恢复期刊后构建发布，不再依赖模型 API 密钥和云数据库。已核对的3条近期来源用于验证首个Codex日报，不代表新增3条新闻。X、YouTube 和 Facebook 的公开来源覆盖仍需逐日完善。目标08:00前发布，但本机可用性、额度和任务调度可能影响完成时间。
