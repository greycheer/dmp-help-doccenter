---
sidebar_position: 2
title: "Product Firmware Management"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

**Product Firmware Management** is used to manage OTA firmware for the product. 

- Developers can associate an existing firmware repository with the product. Each product can be linked to **only one firmware repository**, and **only firmware versions maintained in that repository** can be used for OTA upgrades of the product.

![image](/img/developer-manual/F9ogb7UoVoCAftx8FK6c0Vp5nDc.png)

**For creating a firmware repository, please refer to the **Firmware Management** section.

- After a firmware repository is bound to a product, click the **Firmware Upgrade** button to enter the** [Firmware Upgrade]** page.

![image](/img/developer-manual/FPJebO4lcosC7bxwAg0cuwiYn8b.png)

- Click **New Firmware Upgrade**, select a firmware version, and fill in the required upgrade information to create an upgrade task for the product.

![image](/img/developer-manual/X28SbyWl5oU6HxxvVDscvj32nph.png)

![image](/img/developer-manual/DyLubI4hPoM8uuxD1Tkcce3intw.png)

- Click **Verify** to enter the firmware upgrade task verification page.

![image](/img/developer-manual/Zm1fbCUuhoj8mnxcT5FcqSt3nG3.png)

***Due to the special nature of OTA functionality, developers must complete OTA verification before the upgrade task can be released to a large number of devices.*

- Click **Add by Device ID**, add the device UUIDs to be verified, keep the devices online, and log in to the App bound to those devices. You will then receive OTA upgrade prompts on the devices. Confirm the upgrade and observe the OTA process. On the firmware upgrade task verification page, you can monitor the upgrade status of the devices and resend the upgrade task if necessary.

![image](/img/developer-manual/UQXabmeHZo0AiQxROfncr2HAnVg.png)

**In addition to verifying whether an OTA task has been executed successfully (i.e., whether the device’s local firmware version has been updated to the specified version), developers are also required to **fully validate the runtime behavior of the firmware on the device side**.
