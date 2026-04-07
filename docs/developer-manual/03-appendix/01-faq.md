---
sidebar_position: 3
title: "FAQ"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

**Frequently Asked Questions**

**Q: I cannot find a suitable product category when creating a product under development.**

 — Please contact the platform team for assistance.

** **

**Q: I cannot receive the email verification code when logging in.**

 — Some Chinese email providers may not receive verification emails reliably. Please try using an international email service such as Gmail.

** **

**Q: I cannot find appropriate product functions on the platform to match my hardware capabilities.**

 — Please prepare a detailed description of the required functions and contact the platform team to have them added.

** **

**Q: The debugging device cannot connect to the platform.**

 — Please ensure the device meets the platform access requirements and that authentication information such as the five-tuple has been correctly configured.

**Q: Which provisioning Configurations should I configure during product development?**

This depends on the network connectivity method of your product. We recommend the following:

- Wi-Fi Products

-  Configure two Configuration:Bluetooth and Wi-Fi Configuration

Priority:

- Bluetooth add as the primary binding method

- Wi-Fi configuration as a fallback option

- 4G Products

-  Configure four Configuration:Bluetooth, Scan the Device Body Code, Device Code Scanning and ID Addition

Priority:

- Bluetooth add as the primary binding method

- Scan the device body code as the secondary option

- ID addition and device code scanning as fallback options

- LAN Products: 

-  Configure three Configuration:Scan the Device Body Code, LAN Scanning and ID Addition

Priority:

- Scan the device body code as the primary binding method

- LAN scanning and ID addition as fallback options

**Q: Why are some functions displayed in the App configuration page even though they are not set in Function Groups?**

 — Function Groups only control the configurable settings section in the App. Other sections such as product basic information, device reboot, device sharing, and device information are built-in App features.

** **

**Q: Why can’t some functions configured in Function Groups be controlled in the App?**

 — Currently, the platform only supports App-side control of **Bool** and **Enum** type attribute functions. Other function types are display-only and show the latest device-reported values. Support for additional types will be gradually introduced in future versions.

**Q: Why can’t I select a certain firmware version when creating a firmware upgrade task?**

 — Please check whether the firmware version has already been associated with a previous upgrade task. The system strictly enforces that each firmware version can only be used once for an upgrade within a single product.

** **

**Q: I have completed OTA verification for a firmware upgrade task. How can I perform a batch OTA upgrade?**

 — Batch OTA functionality is not yet available to developers. Please contact the platform team and provide the created firmware upgrade task so that the platform team can assist with the operation.
