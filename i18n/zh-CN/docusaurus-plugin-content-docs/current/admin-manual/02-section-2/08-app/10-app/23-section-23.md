---
sidebar_position: 23
title: "2.3.3.2 推送证书配置"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

安卓与iOS的推送证书配置，由APP负责人按界面填入信息点击即可。
安卓与iOS的推送证书的生效机制不一样，需注意
安卓：
首次配置：需提供推送google-services.json文件给APP开发更新，更新APP包后生效。一般证书长期有效，无需定期更新。（以谷歌政策为准）
后续更新：若谷歌帐号firebase推送项目有变更，需要更新APP和重新配置推送证书
iOS:
推送证书配置即可生效，证书有效期是一年，需在证书失效前更新。

![](/img/admin-manual/zh-CN/w_0027.png)


![](/img/admin-manual/zh-CN/w_0028.png)