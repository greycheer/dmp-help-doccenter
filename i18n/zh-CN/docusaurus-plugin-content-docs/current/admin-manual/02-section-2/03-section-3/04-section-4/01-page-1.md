---
sidebar_position: 1
title: "2.2.4.1 板块简介"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

创建产品后即可在产品详情中生成五元组，每组五元组包含一个设备的唯一识别码，与其连接平台通信的必要信息。具体元素解释如下：

productId（即PID）：产品型号唯一标识符，同一PID下的设备共享功能定义（物模型）与产品默认配置，建议烧录

deviceUuid：设备唯一识别码，用于绑定设备与ID，必须烧录

deviceSecret: 设备密钥，必须烧录

qrCode:设备短链，用于生成二维码后贴在标签上给客户扫码添加使用

ngwDomain:设备连接云平台的入口地址（Northbound Gateway），每个DMP环境所有设备共享同一个字符值。

deviceCode:设备唯一识别码，业务层映射标识，通过一个简化的逻辑编号，隐式映射其他五个参数（使用较少）