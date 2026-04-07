---
sidebar_position: 1
title: "Terminology Explanation"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

Before starting, understand the following core concepts:

| Terminology | Explaination | Example |
| --- | --- | --- |
| Category | In IoT platforms, refers to a collection of devices with identical functional definitions or application scenarios, serving as templates for product definitions | "Smart Bulb" defining common attributes like switch status/brightness |
| Product | Specific device models or series under a category, with globally unique identifiers (PID). | A developer creates the "CS-6-AD Smart Bulb" product using the "Smart Bulb" category. |
| Thing Model | A digital data model describing "what a device is, what it can do, and what it can notify." It standardizes device-cloud data interaction and includes three subtypes: Properties, Actions, and Events. | A "Smart AC" thing model may include:- Property: Current temperature (read/write), operating mode (read/write).- Action: Set fan speed (device-executable command).- Event: Filter replacement alert (device-initiated notification). |
| Per-device Secret | A device authentication and key management scheme. Unique credentials (ID + secret) are pre-burned into each device during production for bidirectional authentication with the IoT platform. DMP uses Tuple for this purpose. | A factory burns a globally unique certificate into each smart door lock during production. |
| Tuple | Generated after product creation. Each set contains unique identifiers and connection parameters for a device | - productId(PID): Unique product model ID (burn recommended).- deviceUuid: Unique device ID (must be burned).- deviceSecret: Device secret (must be burned).- qrCode: Short URL for QR code labeling (user scanning).- ngwDomain: Cloud platform entry address (shared across DMP).- deviceCode: Simplified logical ID (rarely used). |
| OTA | Remote wireless updates (Wi-Fi/4G) for device firmware/software. DMP provides full OTA capabilities.Supported methods:- APP Upgrade:- Manual: Users trigger upgrades via APP.- Automatic: Devices auto-check and upgrade periodically.- Silent OTA: Server pushes urgent updates without broadcasting notification tones. | When pushing firmware updates in bulk to deployed smart speakers—whether to fix bugs or introduce new features—OTA provides an efficient solution. |
| Device Binding | Process of associating a device with a user account to grant remote control permissions via APP. | Binding methods: QR scanning, device ID input, Bluetooth and etc. |
| Device Network Provisioning | Configuring a device's network settings (e.g., Wi-Fi SSID/password) to enable internet access and cloud communication. | Methods: Bluetooth, device hotspot and etc. |
