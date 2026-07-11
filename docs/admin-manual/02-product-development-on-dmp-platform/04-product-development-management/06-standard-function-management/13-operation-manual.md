---
sidebar_position: 13
title: "2.2.2.2 Operation Manual"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

Standard functions describe the capability scope of a device and can be categorized into **Properties**, **Events**, and **Actions**:
**Properties**:
 Describe the real-time operating status of a device. Properties can be reported by the device to the platform or set by the platform. This is the most common function type and can be further classified by data type:
**Boolean (Bool):** Binary values representing true or false
**Numeric (Value):** Integer values that support arithmetic operations
**String:** Non-numeric text data, does not support arithmetic operations
**Enum:** A user-defined set of finite values
**Float:** Single-precision decimal values
**Double:** Higher-precision decimal values
**Date:** UTC timestamp in string format; the system processes it as a UTC timestamp by default
**Raw:** Raw binary data or custom byte streams
**Events**:
 Describe specific events or alarms actively triggered by the device and reported to the platform.
**Actions**:
Describe executable capabilities or methods of the device. These are issued by the platform, and the device returns the execution result.

To reduce the learning curve for developers, the DMP platform has preloaded a standardized function list for each product category based on industry standards. Product functions are divided into two types:
**Mandatory Functions**:
Common functions that all products under the same category must support. These cannot be removed, but some details can be edited.
**Optional Functions**:
Special functions supported only by certain products within a category. Developers can choose to add or remove these based on the actual hardware capabilities, and some details can also be edited.

Navigation Path: [Products] – [Standard Functions]
Click **Create Function**
![](/img/admin-manual/en/w_0008.png)
After filling in the function-related information, the function can be created successfully.
Standard functions with **DP IDs starting with “1”** are defined by SDK developers. Other departments must not modify these functions.
Once a standard function is created, it can be added to products.
If a standard function has already been added to one or more products, some attributes and parameters become non-editable. To modify them, the function must first be unbound from all associated products.
By clicking **Associated Products**, you can view which products currently include this standard function.
![](/img/admin-manual/en/w_0009.png)
##