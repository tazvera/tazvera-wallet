# Tazvera Android testing build

- Android application ID: `com.tazvera.wallet`
- App label: `Tazvera`
- Build type: debug APK for private testing only
- Capacitor version: 8.6.2 (pinned)

## Build

The GitHub Actions workflow `.github/workflows/android-build.yml` prepares the existing static wallet files, generates the Capacitor Android project, adds the QR scanner camera permission, and builds a debug APK.

Download the artifact named `tazvera-android-debug-apk` from the successful workflow run.

## Important

This debug APK is not a Play Store release. It is not signed with the final production upload key. Do not distribute it publicly.

The Android app uses its own app storage origin. It does not automatically share the browser/PWA wallet storage. For testing, create a fresh test wallet or use the wallet's verified backup-and-restore flow. Never share a recovery phrase with anyone.

Before release, test wallet creation, PIN/lock, backup and restore, camera QR scanning, send/receive, app background/resume, network changes, and Android device compatibility. Create and securely back up the production signing key before preparing a Play Store AAB.
