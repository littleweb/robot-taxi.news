# RoboTaxi 首版验证（2026-10-21）

- `npm run typecheck`：通过。
- `npm test`：936 / 936 通过。
- `npm run build -w @aihot/web`：通过。
- `node --test apps/web/tests/*.test.ts`：59 / 59 通过。
- `node scripts/smoke.ts --base http://localhost:3100`：全部通过。
- 静态导出专项测试：通过；本次导出 153 个公开页面。
- 桌面黑色三栏、移动端宽度、静态链接及图片加载已核对。

首批 17 条资料保留原始发布日期，包括 3 条历史视频索引；不是 17 条今日新闻。自动采集、模型评分尚未启用，也未发生付费模型调用。

GitHub Pages 首版由人工核实资料生成。每日真实更新需要配置持久数据库和模型凭据；X、YouTube 和 Facebook 的授权信源仍需完善。计划北京时间 05:30 开始、07:00 编排，目标 08:00 前发布；GitHub 定时任务可能延迟，不构成严格时限保证。
