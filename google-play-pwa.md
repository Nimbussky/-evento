# Evento: Google Play PWA Deployment & Trusted Web Activity (TWA) Guide

This guide details the complete end-to-end process for packaging, signing, and deploying the **Evento** Progressive Web App (PWA) to the Google Play Store using a Trusted Web Activity (TWA).

---

## 1. Overview & Architecture

A **Trusted Web Activity (TWA)** allows the Evento Progressive Web App to be packaged as a full-fledged Android app (`.aab` / `.apk`) that runs in a highly performant, borderless, full-screen Chrome custom tab. By establishing a cryptographic verification link (Digital Asset Links) between the Android app and the web domain, the browser address bar and navigation UI are completely stripped away, creating a native app experience.

```
+------------------------------------------------------------------+
|                     Google Play Store (.aab)                     |
+------------------------------------------------------------------+
                                 |
                                 v
+------------------------------------------------------------------+
|      Android App Container (Trusted Web Activity / TWA)          |
+------------------------------------------------------------------+
                                 |
       Digital Asset Links Handshake (assetlinks.json)
                                 |
                                 v
+------------------------------------------------------------------+
|                 Evento PWA Web Application                       |
+------------------------------------------------------------------+
```

---

## 2. Prerequisites

Before generating the Android App Bundle (AAB), ensure the following prerequisites are met:

1. **Google Play Console Account**: An active developer account on the [Google Play Console](https://play.google.com/console).
2. **Deployed Evento PWA**: The PWA must be deployed to a production domain (e.g., `https://evento.example.com`) over HTTPS with a valid SSL certificate.
3. **Java Development Kit (JDK)**: JDK 11 or higher installed.
4. **Android SDK & Build Tools**: Installed via Android Studio or standalone CLI.
5. **Bubblewrap CLI**: The official Google CLI for generating and building TWA projects.
   ```bash
   npm install -g @bubblewrap/cli
   ```

---

## 3. PWA Web Manifest Verification

Ensure your web application's `manifest.json` satisfies all TWA requirements. It must include:
- `name` and `short_name`
- `start_url`
- `display`: Must be set to `standalone`, `fullscreen`, or `minimal-ui`.
- `icons`: At least one `512x512` maskable icon and a `192x192` icon.
- `background_color` and `theme_color`

### Example `manifest.json`
```json
{
  "name": "Evento - Event Management & Discovery",
  "short_name": "Evento",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3b82f6",
  "description": "Discover, create, and manage amazing events near you.",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

---

## 4. Digital Asset Links (`assetlinks.json`) Setup

To bypass the Chrome browser address bar, you must prove ownership of the web domain to the Android app via Digital Asset Links.

### Step 1: Create the file
Create a file named `assetlinks.json` in the `.well-known` directory at the root of your public web directory (e.g., `public/.well-known/assetlinks.json`).

### Step 2: Configure the JSON content
Replace `com.evento.app` with your Android package name, and insert the SHA-256 fingerprint of your Google Play App Signing key (retrieved from Google Play Console -> App Integrity -> App Signing).

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.evento.app",
      "sha256_cert_fingerprints": [
        "FA:2A:53:E2:11:89:3A:5E:2B:6C:3D:D4:6D:72:8F:28:77:AA:4A:1B:18:3B:D2:45:69:A8:FD:FD:8D:6C:B8:9C"
      ]
    }
  }
]
```

### Step 3: Verify Deployment
Ensure the file is publicly accessible at:
`https://evento.example.com/.well-known/assetlinks.json`

> **Note**: Ensure your server returns the correct `Content-Type: application/json` header for this file and does not block access to dot-folders.

---

## 5. TWA Project & Asset Bundle Generation (Bubblewrap)

### Step 1: Initialize the TWA Project
Create a deployment directory and initialize the project using Bubblewrap. Bubblewrap will fetch the web manifest from your URL and generate the TWA configuration.

```bash
mkdir evento-twa
cd evento-twa
bubblewrap init --manifest=https://evento.example.com/manifest.json
```

During initialization, Bubblewrap prompts for parameters and generates a `twa-manifest.json` file.

### Step 2: Review `twa-manifest.json`
Review the generated `twa-manifest.json` to confirm package details, signing keys, and asset locations:

```json
{
  "packageId": "com.evento.app",
  "host": "evento.example.com",
  "name": "Evento",
  "launcherName": "Evento",
  "display": "standalone",
  "themeColor": "#3b82f6",
  "navigationColor": "#0f172a",
  "navigationColorDark": "#0f172a",
  "backgroundColor": "#0f172a",
  "startUrl": "/",
  "iconUrl": "https://evento.example.com/icons/icon-512x512.png",
  "maskableIconUrl": "https://evento.example.com/icons/icon-512x512.png",
  "appVersionCode": 1,
  "appVersionName": "1.0.0",
  "fallbackType": "customtabs",
  "features": {
    "playBilling": {
      "enabled": false
    },
    "locationDelegation": {
      "enabled": true
    }
  },
  "signingKey": {
    "path": "./android.keystore",
    "alias": "evento_key"
  }
}
```

### Step 3: Generate the Keystore & Build the App Bundle
If you do not have an existing keystore, Bubblewrap will create one during the build step. Run the build command to generate the Android App Bundle (`.aab`):

```bash
bubblewrap build
```

**Output Artifacts**:
- `app-release-bundle.aab`: The official production asset bundle for the Google Play Store.
- `app-release.apk`: A standalone APK for local device testing and inspection.

---

## 6. Local Testing & Pre-Flight Checklist

Before uploading to Google Play, test the generated APK on a real Android device or emulator:

1. **Install APK**:
   ```bash
   adb install app-release.apk
   ```
2. **Examine Verification**:
   - Open the app on the device.
   - If the Chrome top address bar is visible, the Digital Asset Links verification failed. Check `adb logcat | grep -i digitalassetlinks` or use the [Google Digital Asset Links API Tester](https://developers.google.com/digital-asset-links/tools/generator).
   - If the app launches full-screen with no browser chrome, TWA verification is fully successful.

---

## 7. Google Play Console Publishing Steps

1. **Create App**: Open Google Play Console, click **Create app**, enter "Evento", and select **App** / **Free (or Paid)**.
2. **App Integrity / App Signing**:
   - Navigate to **Release -> App integrity**.
   - Note the Play App Signing SHA-256 fingerprint. (Confirm this exactly matches the fingerprint in your `assetlinks.json`).
3. **Store Listing Setup**:
   - Provide the App Description, Screenshots (Phone, Tablet), App Icon (512x512), and Feature Graphic (1024x500).
   - Fill out the Content Rating questionnaire and Data Safety form.
4. **Create a Release**:
   - Navigate to **Testing -> Internal testing** (recommended for initial rollout) or **Production**.
   - Click **Create new release**.
   - Upload the generated `app-release-bundle.aab`.
   - Provide release notes and click **Save** -> **Review release** -> **Start rollout**.

---

## 8. Troubleshooting & Maintenance

- **Address Bar Appeared After Publishing**: Google Play App Signing replaces your upload key certificate with a new app signing certificate. Ensure you took the SHA-256 from the Play Console App Signing page, not your local keystore.
- **Updating the Web App**: Because this is a TWA, all frontend layout, logic, and CSS updates deployed to your web host (`evento.example.com`) are instantly reflected in the Android app without uploading a new `.aab` to Google Play.
- **Updating Native Elements**: You only need to increment `appVersionCode` in `twa-manifest.json` and rebuild/republish a new `.aab` if you change the app icon, launch splash screen, app name, or core TWA permissions.
