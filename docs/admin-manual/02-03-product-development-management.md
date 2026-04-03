---
sidebar_position: 3
title: "Product Development Management"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

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