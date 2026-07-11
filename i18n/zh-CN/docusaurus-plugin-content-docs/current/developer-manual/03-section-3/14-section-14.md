---
sidebar_position: 14
title: "[翻译]固件管理"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

固件管理用于维护开发者所有产品下的固件信息，平台提供固件库—固件包—固件升级任务两层结构为开发者提供清晰的固件管理能力。
开发者可访问产品—固件管理页面，即可进行配置
![](/img/developer-manual/w_0054.png)
![](/img/developer-manual/w_0055.png)
 
点击 新建固件按钮，填写相关信息，新建固件库
![](/img/developer-manual/w_0056.png)
![](/img/developer-manual/w_0057.png)
固件升级超时用于规定OTA等待时间，超时判定为升级失败，可根据固件包大小和客户体验适当调整
 
点击固件列表中的固件key，进入固件详情页面
![](/img/developer-manual/w_0058.png)
![](/img/developer-manual/w_0059.png)
点击新建固件版本按钮，填写相关信息，上传固件包，保存后即可完成固件版本的创建。
固件版本创建后还需点击发布按钮，使其进入发布上架状态后，方可进行基于该固件版本的OTA升级任务配置
![](/img/developer-manual/w_0060.png)
![](/img/developer-manual/w_0061.png)
![](/img/developer-manual/w_0062.png)
![](/img/developer-manual/w_0063.png)
固件版本请严格按照版本先后顺序填写，即使OTA任务下发至设备，设备只会更新比本地版本更高的固件
 
已维护的固件版本如何启用升级参考 产品固件管理 章节