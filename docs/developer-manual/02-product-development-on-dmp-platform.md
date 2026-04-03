---
sidebar_position: 2
title: "Product Development on DMP Platform"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 3
---

### 2.1 Product Development


![](/img/developer-manual/K4MSbqPaSoSTB4xzlI5cOyqgnld.png)


![](/img/developer-manual/FBbabVv2to7Ct5xYIqqcjRJ4n4e.png)


#### 2.2.1 Product Firmware Management


- Developers can associate an existing firmware repository with the product. Each product can be linked to **only one firmware repository**, and **only firmware versions maintained in that repository** can be used for OTA upgrades of the product.

![](/img/developer-manual/F9ogb7UoVoCAftx8FK6c0Vp5nDc.png)


- After a firmware repository is bound to a product, click the **Firmware Upgrade** button to enter the** [Firmware Upgrade]** page.

![](/img/developer-manual/FPJebO4lcosC7bxwAg0cuwiYn8b.png)


- Click **New Firmware Upgrade**, select a firmware version, and fill in the required upgrade information to create an upgrade task for the product.

![](/img/developer-manual/X28SbyWl5oU6HxxvVDscvj32nph.png)


![](/img/developer-manual/DyLubI4hPoM8uuxD1Tkcce3intw.png)


- Click **Verify** to enter the firmware upgrade task verification page.

![](/img/developer-manual/Zm1fbCUuhoj8mnxcT5FcqSt3nG3.png)


- Click **Add by Device ID**, add the device UUIDs to be verified, keep the devices online, and log in to the App bound to those devices. You will then receive OTA upgrade prompts on the devices. Confirm the upgrade and observe the OTA process. On the firmware upgrade task verification page, you can monitor the upgrade status of the devices and resend the upgrade task if necessary.


![](/img/developer-manual/UQXabmeHZo0AiQxROfncr2HAnVg.png)


### 2.2 Device Interaction


- Product Display (device models and images),
- Device Provisioning Configuration (Configuration Introduction)
- Device Setting Configuration (Functional Grouping)


![](/img/developer-manual/Brb5bx0lnoJl5lxJm0lcUk2ZnOc.png)

#### 2.2.1 Product Display


![](/img/developer-manual/GBiabvLI7oqWulxc46icI627n0e.png)

#### 2.2.2 Functional Grouping


- Click **New Primary Group** to create a highest-level group. Click groups in the tree to create sub-items (i.e., lower-level groups).


![](/img/developer-manual/B9rsbywCpoLOpCx7uUKcgdownXg.png)


![](/img/developer-manual/PbYgbBr4Eop583xn7uJcsoIXnPg.png)


- For categories whose type is Group, the selectable functions must be consistent with the functions selected under **Device Development → Product Functions**.

![](/img/developer-manual/T32fbfo3HosgDSxGW6fcu3RPnyh.png)


![](/img/developer-manual/YNIpbzeSVoVGVIx975YciYG6nFf.png)


- For configured function items, developers can further adjust their display style and multilingual names/descriptions.

![](/img/developer-manual/LNgVbFc15oUAU3xGwfncOdumn0d.png)

- Available display styles: **Smart Control**, **Read-Only Display**, **Custom Display**.
-  The **Custom Display** mode is not yet available to developers and should not be selected. Multilingual names/descriptions control how the function is displayed and described on the App/CMS side.


![](/img/developer-manual/K6UjboKX2oDdKrxf2G1cQIJ0nBV.png)


![](/img/developer-manual/I06ZbIif6og7XqxtBqZcsJGLn3g.png)


### 2.3 Firmware Management


- Developers can navigate to **Product → Firmware Management** to perform configuration.

![](/img/developer-manual/Ern1bueTMoBy2jxdPvgcoxeFnNd.png)


- Click **New Firmware** and fill in the required information to create a new firmware repository.

![](/img/developer-manual/HrUzbkVwgoioNUxmsx6cymAcnNh.png)


- Click a **Firmware Key** in the firmware list to enter the firmware details page.

![](/img/developer-manual/PWFybQ4Y2oboz2xsbQbcVIF6n2g.png)


- Click **New Firmware Version**, fill in the required information, upload the firmware package, and save to complete firmware version creation.


![](/img/developer-manual/DuBXbAaFxoS42HxFAcXcixaNnGf.png)


![](/img/developer-manual/NOg6bNRAaojliGxS4c8cOfgnnVc.png)