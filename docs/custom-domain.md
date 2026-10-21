# 绑定 robot-taxi.news

当前DNS的NS为 dns11.hichina.com / dns12.hichina.com（阿里云/万网DNS），本次查询未见根域A记录。当前GitHub Pages仍未设置自定义域名。本次只准备自动适配，不替用户切换线上域名。

1. 打开 https://github.com/littleweb/robot-taxi.news/settings/pages ，在 Custom domain 填 robot-taxi.news 并保存。
2. 在域名DNS管理台（目前使用阿里云/万网DNS）为 @ 添加四条A记录：185.199.108.153、185.199.109.153、185.199.110.153、185.199.111.153。每个IP一条；TTL使用默认值即可。可同时添加 www 的CNAME记录，值为 littleweb.github.io，不含协议和仓库路径。
3. 在GitHub Actions手动运行 publish-pages.yml，选择codex模式。工作流通过GitHub官方configure-pages动作读取base_url和base_path：默认地址使用/robot-taxi.news路径；自定义域名使用根路径，资源、导航和canonical随之调整。无需手改源码或添加CNAME文件；本项目使用Actions发布，GitHub忽略产物中的CNAME文件。
4. 等DNS检查与证书准备就绪，启用Enforce HTTPS，验证 https://robot-taxi.news/ 、日报、主题切换、图片和内页。DNS传播及HTTPS选项可能需要至多24小时。可用dig检查A记录。

GitHub建议先在Pages保存域名，再设置DNS。可先在账号Settings → Pages验证域名所有权；验证TXT值需由GitHub给出，不能自行猜测。

官方文档 https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
