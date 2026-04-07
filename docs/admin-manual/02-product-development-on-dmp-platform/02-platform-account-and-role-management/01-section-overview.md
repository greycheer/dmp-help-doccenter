---
sidebar_position: 2
title: "Section Overview"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

All permission settings and account assignments on the DMP platform are managed by the platform administrator. Users are not allowed to create accounts on their own.

Upon platform delivery, an initial administrator account is provided, along with predefined roles (including Platform Administrator, Hardware Developer, APP Manager, etc.) and their corresponding permissions. Administrators may subsequently assign or adjust roles and permissions according to actual needs.

Based on business experience and market classification, the DMP management console has built-in product categories that have already been integrated. When creating a product, the correct product category must be selected.

Subsequently, corresponding standard function libraries and configuration templates will be preset according to the characteristics of each category.

When creating or editing product information, you can select the category to which the product belongs (as shown in the figure below). This section introduces how to manage categories.

![image](/img/admin-manual/JmVkbAP4WovTtdxjIotc5h6Infe.png)

“Standard Functions” are a set of common, pre-defined functions provided by the platform for different product categories. They act as a ready-to-use “standard library,” built in advance based on typical industry experience. This helps products complete functional configuration quickly and ensures that these functions are natively supported by the APP at delivery time.

When configuring a product, functions can only be selected from the standard function library; creating additional custom functions is not supported. Selected functions allow limited parameter adjustments as needed (such as value ranges, default values, etc.).

We strongly recommend prioritizing the direct use of standard functions and adapting to customization needs by **adding new functions rather than modifying existing ones**. This approach is considered best practice for maintaining compatibility and efficiency. The standard function library will continue to be updated with future platform releases.

**Note:** Modifying the existed standard functions may cause related settings in the APP to become invalid or behave unexpectedly. Please fully evaluate the impact or confirm with technical support before making changes.

After creating a product, you can generate a **five-tuple** in the product details page. Each five-tuple represents the unique identity of a device and contains the essential information required for the device to connect and communicate with the platform. The elements are explained as follows:

- **productId (PID):**

The unique identifier of the product model. Devices under the same PID share the same function definitions (data model) and default product configuration. It is recommended to burn this value into the device.

- **deviceUuid:**

The unique identifier of the device, used to bind the device to an account or ID. This value must be burned into the device.

- **deviceSecret:**

The device secret key, required for authentication. This value must be burned into the device.

- **qrCode:**

A short device link used to generate a QR code, which is printed on a label for users to scan and add the device.

- **ngwDomain:**

The entry address for the device to connect to the cloud platform (Northbound Gateway). All devices within the same DMP environment share the same value.

- **deviceCode:**

 A unique device identifier used at the business layer. It serves as a simplified logical identifier that implicitly maps to the other five parameters (used less frequently).

Through the DMP Management Console, you can centrally manage the integration between Apps and devices, as well as key App-side configurations (such as protocol access information, knowledge base configuration, and value-added service configuration).

Therefore, the first step is to create and maintain an App entity in the management console, which serves as the foundation for all subsequent configuration and management activities.

After creating a hardware product, its network provisioning method must be configured in the management console. Once configured, the product can be discovered in the App, provisioned to the network, added to a user account, and used normally.

There are three network provisioning entry methods:

1. Provisioning Home – Bluetooth Provisioning:

When the device is reset and powered on, and Bluetooth is enabled on the App, the device can be detected in the Bluetooth device area of the provisioning page (as shown below).

![image](/img/admin-manual/DRtxb6e6GoXNXzxIaHRcNFHDn5b.png)

- Provisioning Home – Scan Device QR Code: Tap the scan icon in the top-right corner of the provisioning page to scan the device QR code for provisioning.

![image](/img/admin-manual/UfU8bzi3VoDMXKxfZmtc3OUUnFb.png)

- Provisioning Home – Select Device Model: Select the device model from the list to start provisioning.

![image](/img/admin-manual/QI59bNW2aopLc5xA9O1ckde2noh.png)

Among these, Bluetooth direct provisioning does not require configuration in the DMP Management Console.

The latter two methods require configuring the provisioning guide in the DMP console (as shown below). The following section explains how to configure the second and third methods.

![image](/img/admin-manual/YUqQbvcApoZ2XfxIGN5cBbqMnAe.png)

The DMP Management Console supports configuring and publishing cloud storage plans. Once configured, these plans will be displayed in the App and available for users to purchase. (See example below)

![image](/img/admin-manual/BmmhbmOt3oj0T1xvOBlcE1Agnwc.png)

The cloud storage plan configuration process consists of four steps:

- Define cloud storage templates** (configure storage duration, cloud service provider, etc.)

- Define cloud storage products** (set pricing and purchase restrictions)

- Define cloud storage product groups** (group products for easier management)

- Configure cloud storage shelves** (publish product groups to different clients)

The DMP Management Console supports configuring Frequently Asked Questions (FAQs) for both the App and different device models, helping reduce the workload of manual customer support. (See entry points below)

App Knowledge Base Entry:

![image](/img/admin-manual/DLJhb8tc2oPfjlxUbp5cj1bwncg.png)

![image](/img/admin-manual/LA6ybKq6Mor8fPxEAo7c3Sh3nof.png)

Device Knowledge Base Entry:

![image](/img/admin-manual/VHU7bDICaoHoSHxLDibc8c6Tnbd.png)

![image](/img/admin-manual/Zd3ZbvJK0omq9NxACmdcoqKCnEf.png)

![image](/img/admin-manual/Q0iebcBAhoHvVDx9RjqcXB4znhh.png)

These built-in FAQs correspond to the [Knowledge Base] module in the DMP Management Console.

Based on the scope of the content, the Knowledge Base is divided into: App Knowledge Base and Product Knowledge Base.

The operation steps and interfaces for both are largely similar. The following sections use App Knowledge Base creation as the primary example.
