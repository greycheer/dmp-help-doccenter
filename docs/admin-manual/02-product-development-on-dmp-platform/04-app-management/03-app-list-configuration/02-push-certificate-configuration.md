---
sidebar_position: 2
title: "Push Certificate Configuration"
toc: true
toc_max_heading_level: 6
toc_min_heading_level: 2
---

Android and iOS push certificate configuration is completed by the App owner by filling in the required information on the page and submitting it.

The push certificate effectiveness mechanism differ between Android and iOS and require special attention.

- Android:
  - Initial configuration: The `google-services.json` file must be provided to the App developers to update the App package. The configuration takes effect after the App is updated. Certificates are generally long-term and do not require regular renewal (subject to Google policies).
  - Subsequent updates: If the Firebase push project under the Google account changes, the App must be updated and the push certificate reconfigured.

- iOS:
  - The push certificate takes effect immediately after configuration. The certificate is valid for one year and must be renewed before expiration.

![image](/img/admin-manual/WSR0bU5grosZGVxMAx9cWQ1ynrc.png)

![image](/img/admin-manual/WEXPbO2bWo7qkfxjqNwcEEDOnah.png)
