---
sidebar_position: 4
title: "APP Management"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

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