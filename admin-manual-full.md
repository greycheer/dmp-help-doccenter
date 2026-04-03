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

![](/img/admin-manual/EiDCbE9dQo6E2DxInrBcxtIbn5g.png)



- Enter the account information, select the assigned role(s) (multiple selections allowed), and click **Confirm** to create the account.


![](/img/admin-manual/B2AXbfkxjolPO8xvCLTczj6Lnif.png)



- Provide the platform login page domain, login account, and password to the relevant personnel.

- Account information can be managed on this page using the **Edit**, **Reset Password**, and **Delete** functions.

#### 2.1.4 Managing Role Permissions




- Enter the role configuration page and click **New Role**.

![](/img/admin-manual/XgOVbTdXHoCcRRxpZevccP4rnfg.png)


- Enter the role name, then select the corresponding pages and functions based on the role definition.

![](/img/admin-manual/FIpub4t0yodexnxviUvcsTXMnUn.png)


- Roles can be managed on this page using the **Edit** and **Delete** functions.

### 2.2 Product Development Management

#### 2.2.1 Category Creation and Management

##### 2.2.1.1 Section Overview





![](/img/admin-manual/JmVkbAP4WovTtdxjIotc5h6Infe.png)

##### 2.2.1.2 Operation Manual 



- On the **Backend Categories** page, select **New Sub Item** or **Add A First Level Category** according to the level you want to manage.

![](/img/admin-manual/JEjRbLE5woNBn6x8oTycFN4tnvc.png)

- After entering the category name and other required information, you must specify whether the category is a leaf node.

- For **non-leaf categories**, subcategories can be added, but products cannot be added.
- For **leaf categories**, products can be added, but subcategories cannot be created.

![](/img/admin-manual/E8N2bnQpVoKpfjxwL81czzE3nEA.png)


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

![](/img/admin-manual/FHd1boz3ToNL3YxEnjfczFA3nwd.png)

- After filling in the function-related information, the function can be created successfully.
  - Standard functions with **DP IDs starting with “1”** are defined by SDK developers. Other departments must not modify these functions.
  - Once a standard function is created, it can be added to products.
  - If a standard function has already been added to one or more products, some attributes and parameters become non-editable. To modify them, the function must first be unbound from all associated products.
  - By clicking **Associated Products**, you can view which products currently include this standard function.

![](/img/admin-manual/B7H0b2JmGomSEtxRP4Vc9KqQnRc.png)

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

![](/img/admin-manual/YTKmbiiLAo3h5VxUqxjcoIpfnja.png)


- Click the sub-tab [Mass Production] and select the Generate Authorization Code.

![](/img/admin-manual/XdOHb5azcosn5KxqpRdc1rNPnFf.png)

- Enter the number of authorization codes to be produced and the batch remarks, then click Confirm.

![](/img/admin-manual/SRH9b64GZozR7dxHCwAcryavnnb.png)

- Wait for the five-tuples to be generated.

![](/img/admin-manual/EFv7bSkB3obYCxx7mL9c6vAOn0y.png)

- Click Export Authorization Code to download the generated five-tuple file.

![](/img/admin-manual/HZKgbYOYmoSk4LxsKtfcYgwAnNo.png)

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

![](/img/admin-manual/FkyPbIXuSohEOax61hmckSjGnbd.png)

- 
- Fill in the prepared information from step-1 accordingly in the pop-up window and click Confirm.

![](/img/admin-manual/X7vNbcfeto7pe5xPZzqcU42Gnbf.png)

- 
- After creating the APP, an APP Bound for the APP will be generated automatically, please provide APP bundle to APP developer for APP packing.

![](/img/admin-manual/JiHabI5ksoUHUMxOTExcRQkjn9g.png)


#### 2.3.2 APP Configuration


######  

- Enter the page and click Modify


- Fill in the setting and click Save.

![](/img/admin-manual/UlhDbFzfboMofgx7mazcbvUUnQ3.png)

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




![](/img/admin-manual/LUHAbezO1oD8d5x25QWcYbrZnI8.png)



![](/img/admin-manual/MxtGboyfhogXnpxBSuAcs7jWnpf.png)


##### 2.3.3.1 Agreement Configuration







![](/img/admin-manual/LNARbnXNjoqa7Uxz4gQcx2f1nad.png)






![](/img/admin-manual/Gf3wbdIlLoAod0xp2ajcHh3Mn2f.png)






![](/img/admin-manual/GWpSbgHQIo6g7Wx0ekpcdJeonhf.png)


##### 2.3.3.2 Push Certificate Configuration




- Android:
  - Initial configuration: The `google-services.json` file must be provided to the App developers to update the App package. The configuration takes effect after the App is updated. Certificates are generally long-term and do not require regular renewal (subject to Google policies).
  - Subsequent updates: If the Firebase push project under the Google account changes, the App must be updated and the push certificate reconfigured.
- iOS:
  - The push certificate takes effect immediately after configuration. The certificate is valid for one year and must be renewed before expiration.


![](/img/admin-manual/WSR0bU5grosZGVxMAx9cWQ1ynrc.png)


![](/img/admin-manual/WEXPbO2bWo7qkfxjqNwcEEDOnah.png)


#### 2.3.4 Network Provisioning and Front-End Category Management

##### 2.3.4.1 Section Overview







![](/img/admin-manual/DRtxb6e6GoXNXzxIaHRcNFHDn5b.png)

- Provisioning Home – Scan Device QR Code: Tap the scan icon in the top-right corner of the provisioning page to scan the device QR code for provisioning.

![](/img/admin-manual/UfU8bzi3VoDMXKxfZmtc3OUUnFb.png)


- Provisioning Home – Select Device Model: Select the device model from the list to start provisioning.

![](/img/admin-manual/QI59bNW2aopLc5xA9O1ckde2noh.png)






![](/img/admin-manual/YUqQbvcApoZ2XfxIGN5cBbqMnAe.png)


##### 2.3.4.2 Operation Manual


###### Provisioning Home – Scan Device QR Code



- Ensure the product is currently in the **“In Development”** status. If the product is in **“Pre-release”** or **“Released”** status, you must first withdraw the release before editing the provisioning wizard.

![](/img/admin-manual/DFxrbmFmkoiXjMx2G7fcGefvncg.png)






###### Provisioning Home – Select Device Model







- With the current design, configuring frontend categories for a product is equivalent to exposing the product model and images to App users. Please configure carefully.
- Some frontend categories are pre-created at platform delivery based on existing product integrations. If you need to modify built-in configurations, it is recommended to consult the technical support team first**.**

- Create a leaf category for the product



![](/img/admin-manual/EcsXbCVvKolUd2xv9bicPd9QnXe.png)


- After creating the corresponding frontend category, configure the provisioning wizard according to the product definition.



![](/img/admin-manual/KCCybdINMoiTccxVYfFcS25mnhf.png)


#### 2.3.5 Cloud Storage Plan Configuration

##### 2.3.5.1 Section Overview



![](/img/admin-manual/BmmhbmOt3oj0T1xvOBlcE1Agnwc.png)


- Define cloud storage templates** (configure storage duration, cloud service provider, etc.)
- Define cloud storage products** (set pricing and purchase restrictions)
- Define cloud storage product groups** (group products for easier management)
- Configure cloud storage shelves** (publish product groups to different clients)

##### 2.3.5.2 Operation Manual

- Define cloud storage templates (storage duration, cloud provider, etc.)


![](/img/admin-manual/MWu6bnUkdowbtwxH3iScBFzJnuh.png)






![](/img/admin-manual/CREobmdFGofISGxkJZScyC7sn0c.png)


- Define cloud storage products (pricing, purchase limits, etc.)



![](/img/admin-manual/Qexbb03RGoQ0djxhPJRcRp3rnre.png)




![](/img/admin-manual/ECewbg3sCobPvlxVmTwcxV2qnrf.png)


- Define cloud storage product groups (for batch management)



![](/img/admin-manual/IRjRbZrgzo6fDwx2tp3cwBdJn7e.png)


![](/img/admin-manual/GEy7bsZeuo7koFxkQlocKcoJnLg.png)



- Configure cloud storage shelves (publish products)



![](/img/admin-manual/Iyq2bOsQsozwP7xSUKScn4RgnRe.png)



### 2.4 Customer Relationship Management

#### 2.4.1 Knowledge Base Configuration

##### 2.4.1.1 Section Overview




![](/img/admin-manual/DLJhb8tc2oPfjlxUbp5cj1bwncg.png)


![](/img/admin-manual/LA6ybKq6Mor8fPxEAo7c3Sh3nof.png)



![](/img/admin-manual/VHU7bDICaoHoSHxLDibc8c6Tnbd.png)


![](/img/admin-manual/Zd3ZbvJK0omq9NxACmdcoqKCnEf.png)


![](/img/admin-manual/Q0iebcBAhoHvVDx9RjqcXB4znhh.png)






##### 2.4.1.2 Operation Manual

- Create a Knowledge Base



![](/img/admin-manual/LGsKb1X96oYZnsxXnKgcUzm5nOb.png)


![](/img/admin-manual/DdrUb07lhoHbrhxzREjcpDsHnuh.png)


- The associated App cannot be changed after creation.
- Languages can still be added or modified after creation.

- Create First-level Categories




![](/img/admin-manual/CCbfbqn0foZe8vxeKoucifuwnnf.png)


![](/img/admin-manual/PxlobqEPUop0eWxCdtrcJ6Ngnyd.png)



- Create Subcategories and Knowledge Articles



1. Once knowledge articles are added under a first-level category, second-level categories can no longer be created under it.
1. When adding knowledge articles, make sure to configure multiple languages. Each language requires clicking Save once.

![](/img/admin-manual/NEPUbenCAooCfPxmoztc1LDfnjg.png)


![](/img/admin-manual/MrThbxGDVo1dH4xAYiwcBS38n9c.png)


- Manage Knowledge Articles

- **Publish**: After editing, click to publish the article to the production environment.
- **Sort**: Click to customize the display order of articles within the category. Smaller numbers are displayed higher.

![](/img/admin-manual/UiDQbkUhtocJPqxESTvcSLx8neh.png)


![](/img/admin-manual/SNJbbu8AsoGu1ixZrEdcNjmunzh.png)


- Product Knowledge Base Description


####  

#### 2.4.2 After-sales Management


![](/img/admin-manual/CYZEbc8G5oAJZIxG5yzcSlvRnCv.png)

#### 2.4.3 Push Management

- Create Push Notifications

![](/img/admin-manual/NGNVbK10xo9qaKxyBUlcDOONnic.png)


![](/img/admin-manual/TCjmbcd1MogyrAx0dC4c7JP0nwd.png)


![](/img/admin-manual/PQx4blFr0oDirrx5N9Ec6ncGngK.png)


![](/img/admin-manual/FsA2b24pyo8CYXx8Q9YcQnkendh.png)

- Push Review

![](/img/admin-manual/IJlFbYXgcocqVkxGjxicc49bnK9.png)

- Target Audience Management

![](/img/admin-manual/MDJMb125Do7XkcxtOu9cOhman1e.png)

- Create Audience

![](/img/admin-manual/RIQmbcRicoEYA3xGPrscVNblnFg.png)

- Edit Audience

![](/img/admin-manual/RcDZb5AdEopBUDxlIGJcEbtDntg.png)


#### 2.4.4 Cloud Storage Order Management


- On the **[Marketing] - [Mall Manage] - [Commodity Order]** page, use the search bar at the top to locate the order by entering the Order ID, User ID, or other information.

![](/img/admin-manual/Nnr9bUJJKoyhf3xUToAcjk9cnVd.png)

- In the corresponding order row, click the **[Unsubscribe]** button to trigger the cancellation pop-up window.

![](/img/admin-manual/W37Db51sbojU7XxnR3EcgQ6Un0b.png)

- In the pop-up window, select the appropriate **refund method** and/or **service cancellation method** according to the business requirements, then confirm the operation.

![](/img/admin-manual/CVMWb1p8moQR75xda0pcKt03nog.png)

#### 2.4.5 Device Management

##### 2.4.5.1 Unbind Device




- When Unbinding a Small Number of Devices
  - Enter the UUID(s) of the device(s) to be unbound (multiple UUIDs can be separated by commas " , "). Remove the restriction on the first activation time, then click Search.

![](/img/admin-manual/Kr7NbvKrio0L00xYARxcT2FXnYb.png)

- Based on the search results, you can:
  - **Unbind directly on the current page**  (This function is only available when the device status is "Bound").

![](/img/admin-manual/Bz3ebRMHnoyaDUxAwCicln9rnUe.png)

- Select and unbind specific devices on the current page.

![](/img/admin-manual/G66yb3bnAoVXK2xmy2bcLynzn5b.png)

- View device details in the** [Device After Sales]** Page and then unbind.

![](/img/admin-manual/Die5bAxyXoidqCxmKbGcej42ncd.png)



![](/img/admin-manual/CDVobUBZco55Xtx6777c0HuTn3n.png)

- When Unbinding a Large Number of Devices
  - On the **[Device Manage]**  page, click **Batch Operations -> ****Device Unbinding**. (This method has no upper limit on the number of devices that can be processed.)

![](/img/admin-manual/VH07bUP5bo3ZMVxHRlicTjClnRd.png)

- **First method for entering device UUIDs:**  Enter the UUIDs directly into the text box, separated by line breaks.

![](/img/admin-manual/KTGWbV7PQokw1zxcKjxc2woAndf.png)

- **Second method for entering device UUIDs:**  Download the import template, fill in the UUIDs of the devices to be processed, and then upload the file. 

![](/img/admin-manual/Frr3bilFPoFDVUx0E9LcG4tjnkf.png)



![](/img/admin-manual/YKHvbiuvSoYWilxgKcScFBv5ndf.png)

- Click **Confirm**  to unbind the devices.

## Appendix

### 3.1 History

#  
