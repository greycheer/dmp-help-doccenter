---
sidebar_position: 2
title: "Product Development on DMP Platform"
---

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