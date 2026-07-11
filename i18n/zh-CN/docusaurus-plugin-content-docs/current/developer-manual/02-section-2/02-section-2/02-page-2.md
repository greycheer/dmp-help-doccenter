---
sidebar_position: 2
title: "[翻译]产品固件管理"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

产品固件管理用于管理产品OTA固件，开发者可在此处关联已上维护的固件库，每个产品仅可以关联一个固件库，只有该固件库下维护的固件版本可用于产品OTA

![](/img/developer-manual/zh-CN/w_0021.png)

![](/img/developer-manual/zh-CN/w_0022.png)

固件库创建参见 固件管理 章节
 
当产品已绑定固件库后，点击固件升级按钮，进入固件升级页

![](/img/developer-manual/zh-CN/w_0023.png)

![](/img/developer-manual/zh-CN/w_0024.png)
 
点击 新建固件升级 按钮，选择一个固件版本并填写其他升级信息，即可创建一个针对该产品的升级任务

![](/img/developer-manual/zh-CN/w_0025.png)

![](/img/developer-manual/zh-CN/w_0026.png)
 
![](/img/developer-manual/zh-CN/w_0027.png)

![](/img/developer-manual/zh-CN/w_0028.png)

点击验证按钮，即可进入固件升级任务验证页

![](/img/developer-manual/zh-CN/w_0029.png)

![](/img/developer-manual/zh-CN/w_0030.png)

*考虑到OTA功能的特殊性，系统严格控制OTA，开发者必须先完成OTA验证，方可进一步发布至大批量设备
 
点击 通过设备号添加 按钮，添加待验证的设备UUID，保持该设备在线，登录已绑定了该设备的App，即可发现该设备的OTA升级提醒，确认升级并观察设备OTA过程；固件升级任务验证页可观察到设备的升级任务，支持重发升级任务

![](/img/developer-manual/zh-CN/w_0031.png)

![](/img/developer-manual/zh-CN/w_0032.png)

*开发者除需要关注OTA任务是否执行成功（即设备本地固件版本号是否已更新至指定版本），还需完整该固件版本的端侧运行情况