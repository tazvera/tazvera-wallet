import fs from "node:fs";

const manifestPath = "android/app/src/main/AndroidManifest.xml";
if (!fs.existsSync(manifestPath)) {
  throw new Error("Android project is missing. Run npx cap add android first.");
}
let xml = fs.readFileSync(manifestPath, "utf8");
if (!xml.includes('android.permission.CAMERA')) {
  xml = xml.replace(
    /(<manifest\b[^>]*>)/,
    '$1\n    <uses-permission android:name="android.permission.CAMERA" />\n    <uses-feature android:name="android.hardware.camera" android:required="false" />'
  );
}
if (!xml.includes('android.permission.CAMERA')) {
  throw new Error("Could not add CAMERA permission to AndroidManifest.xml");
}
fs.writeFileSync(manifestPath, xml);
console.log("Added camera permission declaration for the wallet QR scanner.");

// Launcher icons: the Tazvera logo (brand/android/res) replaces the default Capacitor icon.
fs.cpSync("brand/android/res", "android/app/src/main/res", { recursive: true, force: true });
console.log("Copied the Tazvera launcher icons.");
