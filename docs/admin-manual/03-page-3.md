---
sidebar_position: 3
title: "FAQ"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

**Q: Cannot find a suitable category for the product under development?** 

- Please contact the platform team to discuss adding a new category.

**Q: Cannot receive the email verification code when logging in?** 

- Check whether the email address is correct and whether the verification email has been filtered into the spam folder. For overseas ODM environments, avoid using domestic email domains (e.g., qq.com, 163.com); use Gmail or other international email domains.

**Q: Cannot find suitable product functions on the platform to match hardware capabilities?** 

- Please contact the platform team to discuss adding custom functions.

**Q: Device cannot connect to the platform during debugging?** 

- Confirm that the device network configuration is correct, check whether the quintuple (Tuple) is burned correctly, and verify that the PID and deviceSecret are consistent.

**Q: Which provisioning wizards should I configure?** 

- It depends on the networking method of the product being developed. We recommend the following:

For Wi-Fi products: Configure two wizards: Bluetooth and Wi-Fi Configuration.

Bluetooth as the first-priority provisioning and binding method.

Wi-Fi Configuration as the backup method.

For 4G products: Configure four wizards: Bluetooth, Scan the Device Body Code, Device Code Scanning, and ID Addition.

Bluetooth as the first-priority binding method.

Scan the Device Body Code as the second priority.

ID Addition and Device Code Scanning as backup methods.

For LAN products: Configure three wizards: Scan the Device Body Code, LAN Scanning, and ID Addition.

Scan the Device Body Code as the first-priority binding method.

LAN Scanning and ID Addition as backup methods.

**Q: Why are functions not configured in the function grouping also displayed on the APP configuration page?** 

- Function grouping only controls the function settings section of the APP configuration page. Other sections such as basic product information, device restart, device sharing, and About This Device are built into the APP.

**Q: Why cannot the functions configured in the function grouping be controlled in the APP?** 

- The platform currently only supports Bool and Enum type property functions for APP-side control. Other functions only display the latest device value. The platform will gradually open up more capabilities in the future.

**Q: What is STQC, and why is the STQC certification required when uploading a firmware package?** 

- STQC is the required security testing and quality certification. Contact the platform team for certification guidance.

**Q: When creating a firmware upgrade task, why cannot a specific firmware version be selected?** 

- Please check whether the firmware version is already associated with a historical firmware upgrade task. The system strictly enforces that each firmware version can only be used for one upgrade in one product.

**Q: After completing OTA verification for the firmware upgrade task, how do I perform bulk OTA?** 

- The device bulk OTA function is not yet open to developers. Please contact the platform team and provide the created firmware upgrade task for the platform team to handle.

**Q: Why can't my device be found in certain apps?** 

- Please check whether the device's product PID is associated with the target app. Go to Product Development → Device Interaction → Associated Application to view the PID's associated app list.

**Q: How do I change the default download app for device QR scanning?** 

- Modify the "Primary App" setting in the Associated Application configuration. Note that changes must be made while the product is in "In Development" status and will take effect after switching to "Pre-Release".

**Q: Will changing the association affect devices already bound to an app?** 

- No. Already-bound devices will continue to function normally. However, if such a device is unbound, re-adding it will be subject to the new rules.