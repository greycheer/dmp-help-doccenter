---
sidebar_position: 8
title: "2.3 Firmware Management"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

Firmware Management is used to maintain firmware information for all developer products. The platform provides a clear two-level structure—Firmware Repository → Firmware Package → Firmware Upgrade Task—to manage firmware effectively.

Developers can navigate to **Product → Firmware Management** to perform configuration.
![](/img/developer-manual/w_0018.png)
 
Click **New**** Firmware** and fill in the required information to create a new firmware repository.
![](/img/developer-manual/w_0019.png)
************Firmware upgrade timeout** defines the OTA waiting time. If the timeout is exceeded, the upgrade is considered failed. This value can be adjusted based on firmware package size and user experience.

Click a **Firmware Key** in the firmware list to enter the firmware details page.
![](/img/developer-manual/w_0020.png)

Click **New**** Firmware Version**, fill in the required information, upload the firmware package, and save to complete firmware version creation.
After creation, you must click **Release** to put the firmware version into a released state before it can be used to configure OTA upgrade tasks.
![](/img/developer-manual/w_0021.png)
![](/img/developer-manual/w_0022.png)



**Firmware versions must be created strictly in version order. Even if an OTA task is delivered to a device, the device will only upgrade to a firmware version that is** **higher than its current local version**.**

**For how to enable upgrades using maintained firmware versions, please refer to the \<**Product Firmware Management****>** section.