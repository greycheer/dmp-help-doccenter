---
sidebar_position: 3
title: "FAQ"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

待开发的产品在创建时找不到合适的品类—请联系平台方处理

登录时无法收到邮件验证码—部分中国邮箱可能无法收到验证码，尽量使用Gmail等国外主流邮箱体系

在平台找不到合适的产品功能来匹配硬件的能力—请准备功能的详细描述，联系平台方添加

调试设备无法连接平台—确保设备已按平台接入校验要求，配置了五元组等鉴权信息

产品开发中我应该配置哪些向导配置

—这取决于开发者所开发产品的联网方式，我们建议

l使用Wi-Fi通信的产品

配置两种向导： Bluetooth/蓝牙添加 ，Wifi Configuration/WiFi配网

—Bluetooth/蓝牙添加作为第一优先级配网绑定方式

—Wifi Configuration/WiFi配网作为备选方案

l使用4G卡通信的产品

配置四种向导：Bluetooth/蓝牙添加， Scan the Device Body Code/扫设备机身码，Device Code Scanning/设备扫码，ID addition/ID添加

—Bluetooth/蓝牙添加作为第一优先级绑定方式

—Scan the Device Body Code/扫设备机身码作为第二优先级

—ID addition/ID添加和Device Code Scanning/设备扫码作为备选方案

l使用LAN通信的产品

配置三种向导：Scan the Device Body Code/扫设备机身码，LAN Scanning/局域网扫描添加，ID addition/ID添加

—Scan the Device Body Code/扫设备机身码作为第一优先级绑定方式

—LAN Scanning/局域网扫描添加，ID addition/ID添加作为备选方案

为什么功能分组中并未设置的功能，也在APP配置页面中展示了？

—功能分组仅可以控制APP配置页面中的功能设置部分，其他诸如产品基本信息，重启设备，分享设备，关于本机等板块均为APP内置

功能分组中配置的功能为什么无法在APP中控制

—平台当前仅支持Bool和Enum类型的属性功能在APP侧的控制，其他功能仅展示设备最新值。平台将在未来逐步开放

什么是STQC，为什么固件包上传时提醒必须通过STQC认证？

—STQC 是印度在信息技术和电子产品领域最重要的国家级质量保障和认证机构，设备固件属于STQC审查和认证范围，若开发者的产品计划销往印度市场，请务必确认该品类是否为STQC审查范围，若属该范围，则上传的固件必须过审

创建固件升级任务时，为什么无法选中某个固件版本？

—请检查历史固件升级任务是否已关联该固件版本，系统严格控制每个固件版本仅可在一个产品使用升级一次

我已经完成了固件升级任务的OTA验证，如何进行批量OTA

—设备批量OTA功能尚未对开发者开放，请联系平台侧，告知已创建的固件升级任务请平台侧进行操作。