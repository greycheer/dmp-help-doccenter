---
sidebar_position: 2
title: "2. Product Development on DMP Platform"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

### 2.1 Product Development

Device development is a core process within product development. It allows developers to flexibly define product capabilities and manage product firmware.

Developers can navigate to **Product → Product Development**, click **Continue Development** for a specific product to enter the product details page, and then select the **Device Development** subpage to perform related configurations.

![image](/img/developer-manual/K4MSbqPaSoSTB4xzlI5cOyqgnld.png)

![image](/img/developer-manual/FBbabVv2to7Ct5xYIqqcjRJ4n4e.png)

#### 2.2.1 Product Firmware Management

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

### 2.2 Device Interaction

Device Interaction is used to manage interaction capabilities during consumer usage via the App/Web, including:

- Product Display (device models and images),

- Device Provisioning Configuration (Configuration Introduction)

- Device Setting Configuration (Functional Grouping)

Developers can navigate to **Product → Product Development**, click **Continue Development** for a specific product to enter the product details page, and then select the **Device Interaction** subpage to perform configuration.

![image](/img/developer-manual/Brb5bx0lnoJl5lxJm0lcUk2ZnOc.png)

#### 2.2.1 Product Display

Configure the product icon, product name, and product model that are exposed to consumers on the App/Web side.

![image](/img/developer-manual/GBiabvLI7oqWulxc46icI627n0e.png)

#### 2.2.2 Functional Grouping

Functional Grouping are used to manage product settings on the App and CMS. Developers can flexibly configure tree-structured function groups to meet common configuration needs during consumer use.

**When a product is created, the DMP platform initializes default function groups based on the product category. Developers can modify these defaults as needed.

- Click **New Primary Group** to create a highest-level group. Click groups in the tree to create sub-items (i.e., lower-level groups).

 Each group supports editing of multilingual group names and descriptions.

![image](/img/developer-manual/B9rsbywCpoLOpCx7uUKcgdownXg.png)

![image](/img/developer-manual/PbYgbBr4Eop583xn7uJcsoIXnPg.png)

- For categories **whose type is Group**, the selectable functions must be consistent with the functions selected under **Device Development → Product Functions**.

![image](/img/developer-manual/T32fbfo3HosgDSxGW6fcu3RPnyh.png)

![image](/img/developer-manual/YNIpbzeSVoVGVIx975YciYG6nFf.png)

**Groups **whose type is Group Name** do not support function configuration. They exist as system placeholders to maintain the tree structure and only allow name modification and adding sub-items.

- For configured function items, developers can further adjust their display style and multilingual names/descriptions.

![image](/img/developer-manual/LNgVbFc15oUAU3xGwfncOdumn0d.png)

- Available display styles: **Smart Control**, **Read-Only Display**, **Custom Display**.

-  The **Custom Display** mode is not yet available to developers and should not be selected. Multilingual names/descriptions control how the function is displayed and described on the App/CMS side.

The App-side display effect generated by function group configuration is shown as follows.

![image](/img/developer-manual/K6UjboKX2oDdKrxf2G1cQIJ0nBV.png)

![image](/img/developer-manual/I06ZbIif6og7XqxtBqZcsJGLn3g.png)

### 2.3 Firmware Management

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

![image](/img/developer-manual/DuBXbAaFxoS42HxFAcXcixaNnGf.png)

![image](/img/developer-manual/NOg6bNRAaojliGxS4c8cOfgnnVc.png)

**Firmware versions must be created strictly in version order. Even if an OTA task is delivered to a device, the device will only upgrade to a firmware version that is** ****higher than its current local version****.**

**For how to enable upgrades using maintained firmware versions, please refer to the \<**Product Firmware Management>** section.
