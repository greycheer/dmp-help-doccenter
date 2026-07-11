---
sidebar_position: 5
title: "2.2.1 Product Firmware Management"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

**Product ****F****irmware ****M****anagement** is used to manage OTA firmware for the product. 

Developers can associate an existing firmware repository with the product. Each product can be linked to **only one firmware repository**, and **only firmware versions maintained in that repository** can be used for OTA upgrades of the product.
![](/img/developer-manual/w_0003.png)
**For creating a firmware repository, please refer to the **Firmware Management** section.

After a firmware repository is bound to a product, click the **Firmware Upgrade** button to enter the** ****[****Firmware Upgrade****]** page.
![](/img/developer-manual/w_0004.png)
 
Click **New**** Firmware Upgrade**, select a firmware version, and fill in the required upgrade information to create an upgrade task for the product.
![](/img/developer-manual/w_0005.png)
![](/img/developer-manual/w_0006.png)

Click **Verify** to enter the firmware upgrade task verification page.
![](/img/developer-manual/w_0007.png)
_*__*__Due to the special nature of OTA functionality, __d__evelopers must complete OTA verification before the upgrade task can be released to a large number of devices._

Click **Add by Device ID**, add the device UUIDs to be verified, keep the devices online, and log in to the App bound to those devices. You will then receive OTA upgrade prompts on the devices. Confirm the upgrade and observe the OTA process. On the firmware upgrade task verification page, you can monitor the upgrade status of the devices and resend the upgrade task if necessary.

![](/img/developer-manual/w_0008.png)
**In addition to verifying whether an OTA task has been executed successfully (i.e., whether the device’s local firmware version has been updated to the specified version), developers are also required to **fully validate the runtime behavior of the firmware on the device side**.