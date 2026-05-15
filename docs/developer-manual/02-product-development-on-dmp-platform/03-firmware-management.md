---
sidebar_position: 2
title: "Firmware Management"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

Firmware Management is used to maintain firmware information for all developer products. The platform provides a clear two-level structure—Firmware Repository → Firmware Package → Firmware Upgrade Task—to manage firmware effectively.

- Developers can navigate to **Product → Firmware Management** to perform configuration.

![image](/img/developer-manual/Ern1bueTMoBy2jxdPvgcoxeFnNd.png)

- Click **New Firmware** and fill in the required information to create a new firmware repository.

![image](/img/developer-manual/HrUzbkVwgoioNUxmsx6cymAcnNh.png)

****Firmware upgrade timeout** defines the OTA waiting time. If the timeout is exceeded, the upgrade is considered failed. This value can be adjusted based on firmware package size and user experience.

- Click a **Firmware Key** in the firmware list to enter the firmware details page.

![image](/img/developer-manual/PWFybQ4Y2oboz2xsbQbcVIF6n2g.png)

- Click **New Firmware Version**, fill in the required information, upload the firmware package, and save to complete firmware version creation.

After creation, you must click **Release** to put the firmware version into a released state before it can be used to configure OTA upgrade tasks.

If you need to **Edit** or **Delete** an existing firmware version, you must first withdraw the state by clicking **Withdraw Publication**.

![image](/img/developer-manual/DuBXbAaFxoS42HxFAcXcixaNnGf.png)

![image](/img/developer-manual/NOg6bNRAaojliGxS4c8cOfgnnVc.png)

**Firmware versions must be created strictly in version order. Even if an OTA task is delivered to a device, the device will only upgrade to a firmware version that is** **higher than its current local version**.**

**For how to enable upgrades using maintained firmware versions, please refer to the \<**Product Firmware Management>** section.
