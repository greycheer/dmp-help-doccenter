---
sidebar_position: 2
title: "2. Product Development on DMP Platform"
---

##  2. Product Development on DMP Platform

### 2.1 Product Development

#### 2.2.1 Product Firmware Management

- Developers can associate an existing firmware repository with the product. Each product can be linked to **only one firmware repository**, and **only firmware versions maintained in that repository** can be used for OTA upgrades of the product.

- After a firmware repository is bound to a product, click the **Firmware Upgrade** button to enter the** [Firmware Upgrade]** page.

- Click **New Firmware Upgrade**, select a firmware version, and fill in the required upgrade information to create an upgrade task for the product.

- Click **Verify** to enter the firmware upgrade task verification page.

- Click **Add by Device ID**, add the device UUIDs to be verified, keep the devices online, and log in to the App bound to those devices. You will then receive OTA upgrade prompts on the devices. Confirm the upgrade and observe the OTA process. On the firmware upgrade task verification page, you can monitor the upgrade status of the devices and resend the upgrade task if necessary.

### 2.2 Device Interaction

- Product Display (device models and images),
- Device Provisioning Configuration (Configuration Introduction)
- Device Setting Configuration (Functional Grouping)

#### 2.2.1 Product Display

#### 2.2.2 Functional Grouping

- Click **New Primary Group** to create a highest-level group. Click groups in the tree to create sub-items (i.e., lower-level groups).

- For categories whose type is Group, the selectable functions must be consistent with the functions selected under **Device Development → Product Functions**.

- For configured function items, developers can further adjust their display style and multilingual names/descriptions.
- Available display styles: **Smart Control**, **Read-Only Display**, **Custom Display**.
-  The **Custom Display** mode is not yet available to developers and should not be selected. Multilingual names/descriptions control how the function is displayed and described on the App/CMS side.

### 2.3 Firmware Management

- Developers can navigate to **Product → Firmware Management** to perform configuration.

- Click **New Firmware** and fill in the required information to create a new firmware repository.

- Click a **Firmware Key** in the firmware list to enter the firmware details page.

- Click **New Firmware Version**, fill in the required information, upload the firmware package, and save to complete firmware version creation.
