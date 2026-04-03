##  Introduction

### 1.1 Purpose of the Manual

### 1.2 Platform Overview 

### 1.3 Terminology Explanation 

### 1.4 Quick Guide

- If you are a platform operations administrator and need to manage platform accounts and assign permissions for different roles:

- If you need to manage product categories and standard functions, or generate device credentials (Five-Tuple) for production:

- If you need to create or manage Apps:

- If you need to manage App FAQs, handle after-sales operations, or manage App-related customer interactions:

- If you need to understand how to create products, configure firmware upgrades, or set up device settings menus:

## Product Development on DMP Platform

### 2.0 How to Access to the Platform

### 2.1 Platform Account and Role Management

#### 2.1.1 Section Overview

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

- Enter the account configuration page and click **Add Account**

- Enter the account information, select the assigned role(s) (multiple selections allowed), and click **Confirm** to create the account.

- Provide the platform login page domain, login account, and password to the relevant personnel.

- Account information can be managed on this page using the **Edit**, **Reset Password**, and **Delete** functions.

#### 2.1.4 Managing Role Permissions

- Enter the role configuration page and click **New Role**.

- Enter the role name, then select the corresponding pages and functions based on the role definition.

- Roles can be managed on this page using the **Edit** and **Delete** functions.

### 2.2 Product Development Management

#### 2.2.1 Category Creation and Management

##### 2.2.1.1 Section Overview

##### 2.2.1.2 Operation Manual 

- On the **Backend Categories** page, select **New Sub Item** or **Add A First Level Category** according to the level you want to manage.
- After entering the category name and other required information, you must specify whether the category is a leaf node.

- For **non-leaf categories**, subcategories can be added, but products cannot be added.
- For **leaf categories**, products can be added, but subcategories cannot be created.

- Categories can also be edited or deleted from this page.

#### 2.2.2 Standard Function Management

##### 2.2.2.1 Section Overview

##### 2.2.2.2 Operation Manual

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

- **Mandatory Functions**:

- **Optional Functions**:

- Click **Create Function**
- After filling in the function-related information, the function can be created successfully.
  - Standard functions with **DP IDs starting with “1”** are defined by SDK developers. Other departments must not modify these functions.
  - Once a standard function is created, it can be added to products.
  - If a standard function has already been added to one or more products, some attributes and parameters become non-editable. To modify them, the function must first be unbound from all associated products.
  - By clicking **Associated Products**, you can view which products currently include this standard function.
##  

#### 2.2.3 Hardware Product Development

#### 2.2.4 Five-Tuple Generation

##### 2.2.4.1 Section Overview

- **productId (PID):**

- **deviceUuid:**

- **deviceSecret:**

- **qrCode:**

- **ngwDomain:**

- **deviceCode:**

##### 2.2.4.2 Operation Manual

- Click **Continue Development**

- Click the sub-tab [Mass Production] and select the Generate Authorization Code.
- Enter the number of authorization codes to be produced and the batch remarks, then click Confirm.
- Wait for the five-tuples to be generated.
- Click Export Authorization Code to download the generated five-tuple file.
#### 2.2.4 Hardware Product Firmware Upgrade

### 2.3 APP Management

#### 2.3.1 Create APP

##### 2.3.1.1 Section Overview

##### 2.3.1.2 Operation Manual

###### Preparations Before Creating an App

- App name
- App logo image (PNG format, under 500 KB)
- Android package name (provided by the App development team)
- iOS bundle ID (provided by the App development team)

###### Create an APP

- Click Add APP
- 
- Fill in the prepared information from step-1 accordingly in the pop-up window and click Confirm.
- 
- After creating the APP, an APP Bound for the APP will be generated automatically, please provide APP bundle to APP developer for APP packing.

#### 2.3.2 APP Configuration

######  

- Enter the page and click Modify

- Fill in the setting and click Save.
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

##### 2.3.3.1 Agreement Configuration

##### 2.3.3.2 Push Certificate Configuration

- Android:
  - Initial configuration: The `google-services.json` file must be provided to the App developers to update the App package. The configuration takes effect after the App is updated. Certificates are generally long-term and do not require regular renewal (subject to Google policies).
  - Subsequent updates: If the Firebase push project under the Google account changes, the App must be updated and the push certificate reconfigured.
- iOS:
  - The push certificate takes effect immediately after configuration. The certificate is valid for one year and must be renewed before expiration.

#### 2.3.4 Network Provisioning and Front-End Category Management

##### 2.3.4.1 Section Overview

- Provisioning Home – Scan Device QR Code: Tap the scan icon in the top-right corner of the provisioning page to scan the device QR code for provisioning.

- Provisioning Home – Select Device Model: Select the device model from the list to start provisioning.

##### 2.3.4.2 Operation Manual

###### Provisioning Home – Scan Device QR Code

- Ensure the product is currently in the **“In Development”** status. If the product is in **“Pre-release”** or **“Released”** status, you must first withdraw the release before editing the provisioning wizard.

###### Provisioning Home – Select Device Model

- With the current design, configuring frontend categories for a product is equivalent to exposing the product model and images to App users. Please configure carefully.
- Some frontend categories are pre-created at platform delivery based on existing product integrations. If you need to modify built-in configurations, it is recommended to consult the technical support team first**.**

- Create a leaf category for the product

- After creating the corresponding frontend category, configure the provisioning wizard according to the product definition.

#### 2.3.5 Cloud Storage Plan Configuration

##### 2.3.5.1 Section Overview

- Define cloud storage templates** (configure storage duration, cloud service provider, etc.)
- Define cloud storage products** (set pricing and purchase restrictions)
- Define cloud storage product groups** (group products for easier management)
- Configure cloud storage shelves** (publish product groups to different clients)

##### 2.3.5.2 Operation Manual

- Define cloud storage templates (storage duration, cloud provider, etc.)

- Define cloud storage products (pricing, purchase limits, etc.)

- Define cloud storage product groups (for batch management)

- Configure cloud storage shelves (publish products)

### 2.4 Customer Relationship Management

#### 2.4.1 Knowledge Base Configuration

##### 2.4.1.1 Section Overview

##### 2.4.1.2 Operation Manual

- Create a Knowledge Base

- The associated App cannot be changed after creation.
- Languages can still be added or modified after creation.

- Create First-level Categories

- Create Subcategories and Knowledge Articles

1. Once knowledge articles are added under a first-level category, second-level categories can no longer be created under it.
1. When adding knowledge articles, make sure to configure multiple languages. Each language requires clicking Save once.

- Manage Knowledge Articles

- **Publish**: After editing, click to publish the article to the production environment.
- **Sort**: Click to customize the display order of articles within the category. Smaller numbers are displayed higher.

- Product Knowledge Base Description

####  

#### 2.4.2 After-sales Management

#### 2.4.3 Push Management

- Create Push Notifications
- Push Review
- Target Audience Management
- Create Audience
- Edit Audience

#### 2.4.4 Cloud Storage Order Management

- On the **[Marketing] - [Mall Manage] - [Commodity Order]** page, use the search bar at the top to locate the order by entering the Order ID, User ID, or other information.
- In the corresponding order row, click the **[Unsubscribe]** button to trigger the cancellation pop-up window.
- In the pop-up window, select the appropriate **refund method** and/or **service cancellation method** according to the business requirements, then confirm the operation.
#### 2.4.5 Device Management

##### 2.4.5.1 Unbind Device

- When Unbinding a Small Number of Devices
  - Enter the UUID(s) of the device(s) to be unbound (multiple UUIDs can be separated by commas " , "). Remove the restriction on the first activation time, then click Search.
- Based on the search results, you can:
  - **Unbind directly on the current page**  (This function is only available when the device status is "Bound").
- Select and unbind specific devices on the current page.
- View device details in the** [Device After Sales]** Page and then unbind.

- When Unbinding a Large Number of Devices
  - On the **[Device Manage]**  page, click **Batch Operations -> ****Device Unbinding**. (This method has no upper limit on the number of devices that can be processed.)
- **First method for entering device UUIDs:**  Enter the UUIDs directly into the text box, separated by line breaks.
- **Second method for entering device UUIDs:**  Download the import template, fill in the UUIDs of the devices to be processed, and then upload the file. 

- Click **Confirm**  to unbind the devices.

## Appendix

### 3.1 History

#  
