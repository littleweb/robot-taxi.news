# AIHOT 上游关系与持续合并

`origin` 是 littleweb/robot-taxi.news，`upstream` 是 https://github.com/KKKKhazix/AIHOT.git，跟踪 `upstream/main`。当前已接入上游真实Git历史，最近合并基线为 ce8348477438cce2b417c1403290a511c812a7c5。

最初通过源码压缩包初始化，历史与上游不相连。本次在确认核心运行源码与该基线一致后，建立一次保留现有内容的基线合并提交，将上游历史接入当前 main。此后使用正常三方合并；**不能再用 ours 策略处理新版本**，不能只改基线号或复制压缩包冒充完成升级。GitHub上的仓库仍是独立仓库，Git的上游关系和合并祖先均已建立。

## 同步步骤

1. 工作区必须干净。先读当前 AGENTS.md；`git fetch upstream main`，`git log --oneline HEAD..upstream/main` 检查新提交。`git merge-base --is-ancestor upstream/main HEAD` 返回成功表示已同步，保持安静。
2. 有更新时从当前 main 创建 `maintenance/aihot-YYYYMMDD` 分支，正常 `git merge --no-ff upstream/main`。优先接入上游功能，逐项解决冲突，保留RoboTaxi行业包、品牌、现有内容、法律页、Codex采编和静态发布。
3. 合并后阅读上游变更的 AGENTS.md 和升级说明，检查迁移。发生数据删除、破坏性迁移或需要额外付费服务时，准备具体变更和影响后报告用户，不自行删除已有业务数据。
4. 必须通过类型检查、后端测试、网页构建与浏览器测试、运行站点后的smoke以及静态导出；浏览器核对主题切换、隐藏入口、桌面和移动端。静态主题适配器依赖上游主题控件结构，控件变动时更新适配器，不能盲目保留旧代码。
5. 常规兼容更新检查通过后合并回 main、推送 origin，触发 publish-pages.yml 的 codex 模式并验证线上版本；失败不得发布半成品，保留当前站点并报告阻塞。更新 site/upstream.json 的 lastMergedCommit，记录新功能、冲突处理和验证结果。

本地仓库为GitHub HTTPS设置了 gh 凭据助手，不在文件里保存token。新克隆需配置GitHub登录，并执行 `git remote add upstream https://github.com/KKKKhazix/AIHOT.git`（如已有则核对地址）。

## 本站差异与冲突关注点

- `site/`、`industry/`：品牌、行业分类信源、法律文案和Codex公开内容，正常保留。
- `modules/robotaxi/`：本地Codex内容校验和导入，无自定义菜单或页面。
- `scripts/export-static.ts`、`site/static/theme.js`、发布工作流：GitHub静态部署适配。
- `site/site.ts`：隐藏开源入口，NAV.hidden中暂时隐藏反馈。
- 引擎只有两处小型显示扩展：`components/shell/nav.ts` 对“更多”组应用已有隐藏配置；`routes/more.tsx` 对反馈入口应用同一配置。默认隐藏列表为空时仍保留上游行为。上游若原生支持，删除这些补丁、改用原生配置。
- `docs/customize.md`：补充本部署的反馈隐藏配置；测试夹具随Robotaxi行业词表调整。

每周一本地09:00检查和合并上游；任务依赖本机和Codex可用。未变化不通知，成功发布、失败或需决策时通知。每次检查以实际 fetch 和合并祖先结果为准。

## 2026-10-26 验证记录

正常三方合并上游15个提交至 `ce8348477438cce2b417c1403290a511c812a7c5`，无冲突；保留原有RoboTaxi内容和静态适配。实际接入以下更新：

- 网页信源日期支持“今天 15:46”、作者前缀、“2天前”、英文短单位；小时相对时间保留时刻精度。
- 事件、主题更新及跨年日期显示年份。
- 后台登录已有会话时跳过登录页；退出表单不再返回415，并保留大小限制。
- 升级sanitize-html、fastify、undici安全版本，MCP客户端/服务端及Vite；Node最低版本升至24.22.1。

上游AGENTS.md和部署迁移说明未改，没有新增数据库迁移、数据删除或付费依赖。类型检查、943项后端测试、63项网页浏览器测试和smoke通过；原页面静态导出504页。首次后端检查碰到并行typegen临时目录重建，待网页构建结束后重跑全部943项通过。桌面1440×900及手机390×844浏览器检查：深色、浅色、跟随系统和刷新保存有效，开源及反馈入口保持隐藏。生产发布仍由publish-pages.yml的codex模式执行，不开启原采集或模型调用。
