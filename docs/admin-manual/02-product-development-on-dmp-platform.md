---
sidebar_position: 2
title: "Product Development on DMP Platform"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

### 2.0 How to Access to the Platform

DMP Platform Domain: Please contact the platform team.

### 2.1 Platform Account and Role Management

#### 2.1.1 Section Overview

All permission settings and account assignments on the DMP platform are managed by the platform administrator. Users are not allowed to create accounts on their own.

Upon platform delivery, an initial administrator account is provided, along with predefined roles (including Platform Administrator, Hardware Developer, APP Manager, etc.) and their corresponding permissions. Administrators may subsequently assign or adjust roles and permissions according to actual needs.

#### 2.1.2 Account Information Collection

- Required Information [Important]

- **Account Nickname** — Fill in according to customer requirements (in some ODM environments, account nicknames cannot include Chinese characters or Pinyin).

- **Verification Email** — Used to receive verification codes. Note: In overseas ODM environments, domestic email domains (e.g., qq.com, 163.com, domestic corporate domains) are not allowed. Overseas domains such as Gmail are recommended.

- Additional Information for Hardware Developers and Other External Collaborators

- Company Name

- Company Address

- Company Contact Person

- Company Contact Details

#### 2.1.3 Create a New Account

Navigation Path: **[Settings] – [Account Management]**

- Enter the account configuration page and click **Add Account**

![image](/img/admin-manual/EiDCbE9dQo6E2DxInrBcxtIbn5g.png)

- Enter the account information, select the assigned role(s) (multiple selections allowed), and click **Confirm** to create the account.

**Note:** Email, phone number, and password can be modified by the user after logging in.

![image](/img/admin-manual/B2AXbfkxjolPO8xvCLTczj6Lnif.png)

- Provide the platform login page domain, login account, and password to the relevant personnel.

- Account information can be managed on this page using the **Edit**, **Reset Password**, and **Delete** functions.

#### 2.1.4 Managing Role Permissions

Navigation Path: [Settings] – [Role Management]

**Note:** **The initial roles are configured based on business best practices. It is recommended to keep them unchanged and only add new roles when necessary.**

- Enter the role configuration page and click **New Role**.

![image](/img/admin-manual/XgOVbTdXHoCcRRxpZevccP4rnfg.png)

- Enter the role name, then select the corresponding pages and functions based on the role definition.

![image](/img/admin-manual/FIpub4t0yodexnxviUvcsTXMnUn.png)

- Roles can be managed on this page using the **Edit** and **Delete** functions.

### 2.2 Product Development Management

#### 2.2.1 Category Creation and Management

##### 2.2.1.1 Section Overview

Based on business experience and market classification, the DMP management console has built-in product categories that have already been integrated. When creating a product, the correct product category must be selected.

Subsequently, corresponding standard function libraries and configuration templates will be preset according to the characteristics of each category.

When creating or editing product information, you can select the category to which the product belongs (as shown in the figure below). This section introduces how to manage categories.

![image](/img/admin-manual/JmVkbAP4WovTtdxjIotc5h6Infe.png)

##### 2.2.1.2 Operation Manual 

Navigation Path: [Products] – [Category Management] – [Backend Categories]

**Note:** **The built-in product categories are accumulated based on industry and device development experience. It is recommended to avoid modifying existing categories and only add new categories when necessary.**

- On the **Backend Categories** page, select **New Sub Item** or **Add A First Level Category** according to the level you want to manage.

![image](/img/admin-manual/JEjRbLE5woNBn6x8oTycFN4tnvc.png)

- After entering the category name and other required information, you must specify whether the category is a **leaf node**.

**Note:**

- For **non-leaf categories**, subcategories can be added, but products cannot be added.

- For **leaf categories**, products can be added, but subcategories cannot be created.

![image](/img/admin-manual/E8N2bnQpVoKpfjxwL81czzE3nEA.png)

- Categories can also be edited or deleted from this page.

#### 2.2.2 Standard Function Management

##### 2.2.2.1 Section Overview

“Standard Functions” are a set of common, pre-defined functions provided by the platform for different product categories. They act as a ready-to-use “standard library,” built in advance based on typical industry experience. This helps products complete functional configuration quickly and ensures that these functions are natively supported by the APP at delivery time.

When configuring a product, functions can only be selected from the standard function library; creating additional custom functions is not supported. Selected functions allow limited parameter adjustments as needed (such as value ranges, default values, etc.).

We strongly recommend prioritizing the direct use of standard functions and adapting to customization needs by **adding new functions rather than modifying existing ones**. This approach is considered best practice for maintaining compatibility and efficiency. The standard function library will continue to be updated with future platform releases.

**Note:** Modifying the existed standard functions may cause related settings in the APP to become invalid or behave unexpectedly. Please fully evaluate the impact or confirm with technical support before making changes.

##### 2.2.2.2 Operation Manual

Standard functions describe the capability scope of a device and can be categorized into **Properties**, **Events**, and **Actions**:

- **Properties**:

-  Describe the real-time operating status of a device. Properties can be reported by the device to the platform or set by the platform. This is the most common function type and can be further classified by data type:

- **Boolean (Bool):** Binary values representing true or false

- **Numeric (Value):** Integer values that support arithmetic operations

- **String:** Non-numeric text data, does not support arithmetic operations

- **Enum:** A user-defined set of finite values

- **Float:** Single-precision decimal values

- **Double:** Higher-precision decimal values

- **Date:** UTC timestamp in string format; the system processes it as a UTC timestamp by default

- **Raw:** Raw binary data or custom byte streams

- **Events**:

-  Describe specific events or alarms actively triggered by the device and reported to the platform.

- **Actions**:

- Describe executable capabilities or methods of the device. These are issued by the platform, and the device returns the execution result.

To reduce the learning curve for developers, the DMP platform has preloaded a standardized function list for each product category based on industry standards. Product functions are divided into two types:

- **Mandatory Functions**:

Common functions that all products under the same category must support. These cannot be removed, but some details can be edited.

- **Optional Functions**:

Special functions supported only by certain products within a category. Developers can choose to add or remove these based on the actual hardware capabilities, and some details can also be edited.

Navigation Path: [Products] – [Standard Functions]

- Click **Create Function**

![image](/img/admin-manual/FHd1boz3ToNL3YxEnjfczFA3nwd.png)

- After filling in the function-related information, the function can be created successfully.

- Standard functions with **DP IDs starting with “1”** are defined by SDK developers. Other departments must not modify these functions.

- Once a standard function is created, it can be added to products.

- If a standard function has already been added to one or more products, some attributes and parameters become non-editable. To modify them, the function must first be unbound from all associated products.

- By clicking **Associated Products**, you can view which products currently include this standard function.

![image](/img/admin-manual/B7H0b2JmGomSEtxRP4Vc9KqQnRc.png)

##  

#### 2.2.3 Hardware Product Development

For details, please refer to the **DMP Platform Developer Guide**.

#### 2.2.4 Five-Tuple Generation

##### 2.2.4.1 Section Overview

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

##### 2.2.4.2 Operation Manual

Navigation Path: [Products] – [Product Development]

- Click **Continue Development**

![image](/img/admin-manual/YTKmbiiLAo3h5VxUqxjcoIpfnja.png)

- Click the sub-tab [Mass Production] and select the Generate Authorization Code.

![image](/img/admin-manual/XdOHb5azcosn5KxqpRdc1rNPnFf.png)

- Enter the number of authorization codes to be produced and the batch remarks, then click Confirm.

![image](/img/admin-manual/SRH9b64GZozR7dxHCwAcryavnnb.png)

- Wait for the five-tuples to be generated.

![image](/img/admin-manual/EFv7bSkB3obYCxx7mL9c6vAOn0y.png)

- Click Export Authorization Code to download the generated five-tuple file.

![image](/img/admin-manual/HZKgbYOYmoSk4LxsKtfcYgwAnNo.png)

#### 2.2.4 Hardware Product Firmware Upgrade

For details, please refer to the **DMP Platform Developer Guide**.

### 2.3 APP Management

#### 2.3.1 Create APP

##### 2.3.1.1 Section Overview

Through the DMP Management Console, you can centrally manage the integration between Apps and devices, as well as key App-side configurations (such as protocol access information, knowledge base configuration, and value-added service configuration).

Therefore, the first step is to create and maintain an App entity in the management console, which serves as the foundation for all subsequent configuration and management activities.

##### 2.3.1.2 Operation Manual

###### Preparations Before Creating an App

Before creating a new App, please prepare the following information in advance, and then proceed to create the App entry in the management console.

Required information for App creation:

- App name

- App logo image (PNG format, under 500 KB)

- Android package name (provided by the App development team)

- iOS bundle ID (provided by the App development team)

###### Create an APP

Navigation Path: [APP] – [APP Management]

- Click Add APP

![image](/img/admin-manual/FkyPbIXuSohEOax61hmckSjGnbd.png)

- 

- Fill in the prepared information from step-1 accordingly in the pop-up window and click Confirm.

![image](/img/admin-manual/X7vNbcfeto7pe5xPZzqcU42Gnbf.png)

- 

- After creating the APP, an APP Bound for the APP will be generated automatically, please provide APP bundle to APP developer for APP packing.

![image](/img/admin-manual/JiHabI5ksoUHUMxOTExcRQkjn9g.png)

#### 2.3.2 APP Configuration

Navigation Path: [APP] – [APP Configuration]

######  

- Enter the page and click Modify

https://wdcdn.qpic.cn/MTY4ODg1NjExMDY0MjI2Mg_991828_hTQMdqHTmVfhRxul_1774512104?w=2272&h=1223&type=image/png

- Fill in the setting and click Save.

![image](/img/admin-manual/UlhDbFzfboMofgx7mazcbvUUnQ3.png)

- Tips for filling:

- Whether Google Home is supported (Yes/No)

- Whether Alexa is supported (Yes/No)

- Whether the cloud storage marketplace is enabled (Yes/No)

- Value-added service order prefix: A two-letter alphabetic prefix used to identify the type of value-added service orders. It appears at the beginning of the order number to help the system distinguish order sources.

- App download URL (provided by the App owner)

- Feedback service URL (provided by the HTML team)

- Cloud marketplace service URL (provided by the HTML team)

- Application agreement service URL (provided by the HTML team)

#### 2.3.3 APP List Configuration

Navigation Path: [APP] – [APP Management] – [Publishing Configuration] / [APP] – [Publishing Configuration]

Entry 1: On the [APP] – [APP Management] page, click Publishing Configuration for the selected App.

![image](/img/admin-manual/LUHAbezO1oD8d5x25QWcYbrZnI8.png)

Entry 2: On the [APP] – [Publishing Configuration] page, select the App from the dropdown menu at the top.

![image](/img/admin-manual/MxtGboyfhogXnpxBSuAcs7jWnpf.png)

##### 2.3.3.1 Agreement Configuration

(User Agreement and Privacy Policy are configured in the same way, but managed on separate pages.)

a. Create a version:

Click Add Version, enter the agreement version number, and click Confirm.Note: Once added, an agreement version cannot be deleted. Only versions with a higher number than the currently active one can take effect. Please enter carefully.

![image](/img/admin-manual/LNARbnXNjoqa7Uxz4gQcx2f1nad.png)

b. Edit version content:

Select the language to be added, edit the title and content, and click Save.

Without closing the dialog, select the next language and repeat the above steps. After all languages for the current version are completed and saved, close the dialog.

![image](/img/admin-manual/Gf3wbdIlLoAod0xp2ajcHh3Mn2f.png)

c. Enable the agreement:

Click Enable on the page to make the agreement effective (there may be a delay of up to 30 minutes).

Before enabling, the agreement content can be reviewed and edited again. Once enabled, the agreement will be locked and cannot be modified.

![image](/img/admin-manual/GWpSbgHQIo6g7Wx0ekpcdJeonhf.png)

##### 2.3.3.2 Push Certificate Configuration

Android and iOS push certificate configuration is completed by the App owner by filling in the required information on the page and submitting it.

The push certificate effectiveness mechanism differ between Android and iOS and require special attention.

- Android:

- Initial configuration: The `google-services.json` file must be provided to the App developers to update the App package. The configuration takes effect after the App is updated. Certificates are generally long-term and do not require regular renewal (subject to Google policies).

- Subsequent updates: If the Firebase push project under the Google account changes, the App must be updated and the push certificate reconfigured.

- iOS:

- The push certificate takes effect immediately after configuration. The certificate is valid for one year and must be renewed before expiration.

![image](/img/admin-manual/WSR0bU5grosZGVxMAx9cWQ1ynrc.png)

![image](/img/admin-manual/WEXPbO2bWo7qkfxjqNwcEEDOnah.png)

#### 2.3.4 Network Provisioning and Front-End Category Management

##### 2.3.4.1 Section Overview

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

##### 2.3.4.2 Operation Manual

** **

###### Provisioning Home – Scan Device QR Code

Navigation Path: [Products] – [Product Development] – [Continue Development] – [Device Interaction] – [Configuration Instruction]

- Ensure the product is currently in the **“In Development”** status. If the product is in **“Pre-release”** or **“Released”** status, you must first withdraw the release before editing the provisioning wizard.

![image](/img/admin-manual/DFxrbmFmkoiXjMx2G7fcGefvncg.png)

b. Configure and enable the wizard under“Device Interaction – Wizard Configuration” on the product details page.

Note: PNG and GIF formats are supported. Each provisioning method configured requires clicking Save once.

c. After configuration, the product must be moved to Pre-release status for the settings to take effect.

###### Provisioning Home – Select Device Model

Navigation: [Products] – [Category Management] – [Frontend Categories]

Frontend categories correspond to the product list displayed on the App provisioning page.Level 1 categories are display-only and do not take effect.

Level 2 categorie act as product list tabs.

The App supports up to four levels of categories, allowing leaf categories to be displayed at either the third or fourth level.

Notes:

- With the current design, configuring frontend categories for a product is equivalent to exposing the product model and images to App users. Please configure carefully.

- Some frontend categories are pre-created at platform delivery based on existing product integrations. If you need to modify built-in configurations, it is recommended to consult the technical support team first**.**

- Create a leaf category for the product

To display a product in the App, you must first create a corresponding **leaf category** based on the product definition.

In general, there is no need to create a new top-level category; required categories can be created by clicking Add Sub Item.

![image](/img/admin-manual/EcsXbCVvKolUd2xv9bicPd9QnXe.png)

- After creating the corresponding frontend category, configure the provisioning wizard according to the product definition.

Please note that the leaf category name must exactly match the product model name.

Changes made here take effect immediately and do not require withdrawing the product release.

![image](/img/admin-manual/KCCybdINMoiTccxVYfFcS25mnhf.png)

#### 2.3.5 Cloud Storage Plan Configuration

##### 2.3.5.1 Section Overview

The DMP Management Console supports configuring and publishing cloud storage plans. Once configured, these plans will be displayed in the App and available for users to purchase. (See example below)

![image](/img/admin-manual/BmmhbmOt3oj0T1xvOBlcE1Agnwc.png)

The cloud storage plan configuration process consists of four steps:

- Define cloud storage templates** (configure storage duration, cloud service provider, etc.)

- Define cloud storage products** (set pricing and purchase restrictions)

- Define cloud storage product groups** (group products for easier management)

- Configure cloud storage shelves** (publish product groups to different clients)

##### 2.3.5.2 Operation Manual

- Define cloud storage templates (storage duration, cloud provider, etc.)

Navigation Path: [Marketing] – [Value-added Services] – [Cloud Storage Templates]

![image](/img/admin-manual/MWu6bnUkdowbtwxH3iScBFzJnuh.png)

Create and manage templates in [Cloud Storage Templates] and define basic template information.

![image](/img/admin-manual/CREobmdFGofISGxkJZScyC7sn0c.png)

- Define cloud storage products (pricing, purchase limits, etc.)

Navigation: [Marketing] – [Value-added Services] – [Mall Management] – [Commodity Management]

Create products based on templates and define pricing and related details.

![image](/img/admin-manual/Qexbb03RGoQ0djxhPJRcRp3rnre.png)

![image](/img/admin-manual/ECewbg3sCobPvlxVmTwcxV2qnrf.png)

- Define cloud storage product groups (for batch management)

Navigation: [Marketing] – [Value-added Services] – [Mall Management] – [Commodity Grouping]

Create product groups and associate multiple products for batch management.

![image](/img/admin-manual/IRjRbZrgzo6fDwx2tp3cwBdJn7e.png)

![image](/img/admin-manual/GEy7bsZeuo7koFxkQlocKcoJnLg.png)

- Configure cloud storage shelves (publish products)

Navigation Path:[Marketing] – [Value-added Services] – [Mall Management] – [Product Shelves]

Select product groups, configure shelf placement, and complete publishing.

![image](/img/admin-manual/Iyq2bOsQsozwP7xSUKScn4RgnRe.png)

### 2.4 Customer Relationship Management

#### 2.4.1 Knowledge Base Configuration

##### 2.4.1.1 Section Overview

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

##### 2.4.1.2 Operation Manual

- Create a Knowledge Base

Click **[Create Knowledge Base]** to create a new knowledge base.

When creating a knowledge base, you can select the target App and language.

![image](/img/admin-manual/LGsKb1X96oYZnsxXnKgcUzm5nOb.png)

![image](/img/admin-manual/DdrUb07lhoHbrhxzREjcpDsHnuh.png)

**Notes:**

- The associated App cannot be changed after creation.

- Languages can still be added or modified after creation.

- Create First-level Categories

Click **[Management Q&A]** to enter the **[App Q&A Management]** page.

Then click **[Add First-level Category]** to create a top-level category.

![image](/img/admin-manual/CCbfbqn0foZe8vxeKoucifuwnnf.png)

![image](/img/admin-manual/PxlobqEPUop0eWxCdtrcJ6Ngnyd.png)

- Create Subcategories and Knowledge Articles

After creating a first-level category, you can either: Create second-level categories, or

Add knowledge articles directly under the first-level category.

Notes:

1. Once knowledge articles are added under a first-level category, second-level categories can no longer be created under it.

2. When adding knowledge articles, make sure to configure multiple languages. Each language requires clicking Save once.

![image](/img/admin-manual/NEPUbenCAooCfPxmoztc1LDfnjg.png)

![image](/img/admin-manual/MrThbxGDVo1dH4xAYiwcBS38n9c.png)

- Manage Knowledge Articles

After adding knowledge articles, they can be managed via the operation column:

- **Publish**: After editing, click to publish the article to the production environment.

- **Sort**: Click to customize the display order of articles within the category. Smaller numbers are displayed higher.

![image](/img/admin-manual/UiDQbkUhtocJPqxESTvcSLx8neh.png)

![image](/img/admin-manual/SNJbbu8AsoGu1ixZrEdcNjmunzh.png)

- Product Knowledge Base Description

For **Published** products, a Product Knowledge Base is automatically created.

 On the Product Knowledge Base page, click **Edit** to manage the corresponding knowledge entries.

####  

#### 2.4.2 After-sales Management

![image](/img/admin-manual/CYZEbc8G5oAJZIxG5yzcSlvRnCv.png)

#### 2.4.3 Push Management

- Create Push Notifications

![image](/img/admin-manual/NGNVbK10xo9qaKxyBUlcDOONnic.png)

![image](/img/admin-manual/TCjmbcd1MogyrAx0dC4c7JP0nwd.png)

![image](/img/admin-manual/PQx4blFr0oDirrx5N9Ec6ncGngK.png)

![image](/img/admin-manual/FsA2b24pyo8CYXx8Q9YcQnkendh.png)

- Push Review

![image](/img/admin-manual/IJlFbYXgcocqVkxGjxicc49bnK9.png)

- Target Audience Management

![image](/img/admin-manual/MDJMb125Do7XkcxtOu9cOhman1e.png)

- Create Audience

![image](/img/admin-manual/RIQmbcRicoEYA3xGPrscVNblnFg.png)

- Edit Audience

![image](/img/admin-manual/RcDZb5AdEopBUDxlIGJcEbtDntg.png)

#### 2.4.4 Cloud Storage Order Management

2.4.4.1 **Order/Service Cancellation **

- On the **[Marketing] - [Mall Manage] - [Commodity Order]** page, use the search bar at the top to locate the order by entering the Order ID, User ID, or other information.

![image](/img/admin-manual/Nnr9bUJJKoyhf3xUToAcjk9cnVd.png)

- In the corresponding order row, click the **[Unsubscribe]** button to trigger the cancellation pop-up window.

![image](/img/admin-manual/W37Db51sbojU7XxnR3EcgQ6Un0b.png)

- In the pop-up window, select the appropriate **refund method** and/or **service cancellation method** according to the business requirements, then confirm the operation.

![image](/img/admin-manual/CVMWb1p8moQR75xda0pcKt03nog.png)

#### 2.4.5 Device Management

##### 2.4.5.1 Unbind Device

Navigation Path: [Product] – [Device Manage]

**The platform provides multiple methods for unbinding devices:**

- When Unbinding a Small Number of Devices

- Enter the UUID(s) of the device(s) to be unbound (multiple UUIDs can be separated by commas " , "). Remove the restriction on the first activation time, then click Search.

![image](/img/admin-manual/Kr7NbvKrio0L00xYARxcT2FXnYb.png)

- Based on the search results, you can:

- **Unbind directly on the current page**  (This function is only available when the device status is "Bound").

![image](/img/admin-manual/Bz3ebRMHnoyaDUxAwCicln9rnUe.png)

- Select and unbind specific devices on the current page.

![image](/img/admin-manual/G66yb3bnAoVXK2xmy2bcLynzn5b.png)

- View device details in the** [Device After Sales]** Page and then unbind.

![image](/img/admin-manual/Die5bAxyXoidqCxmKbGcej42ncd.png)

![image](/img/admin-manual/CDVobUBZco55Xtx6777c0HuTn3n.png)

- When Unbinding a Large Number of Devices

- On the **[Device Manage]**  page, click **Batch Operations -> ****Device Unbinding**. (This method has no upper limit on the number of devices that can be processed.)

![image](/img/admin-manual/VH07bUP5bo3ZMVxHRlicTjClnRd.png)

- **First method for entering device UUIDs:**  Enter the UUIDs directly into the text box, separated by line breaks.

![image](/img/admin-manual/KTGWbV7PQokw1zxcKjxc2woAndf.png)

- **Second method for entering device UUIDs:**  Download the import template, fill in the UUIDs of the devices to be processed, and then upload the file. 

![image](/img/admin-manual/Frr3bilFPoFDVUx0E9LcG4tjnkf.png)

(Template Preview)

![image](/img/admin-manual/YKHvbiuvSoYWilxgKcScFBv5ndf.png)

- Click **Confirm**  to unbind the devices.
