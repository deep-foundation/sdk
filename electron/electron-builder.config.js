module.exports = {
  "appId": "deep.sdk.app",
  "afterSign": "notarize.cjs",
  "afterPack": "./recover-after-electron-build.cjs",
  "compression": "maximum",
  "directories": {
    "buildResources": "resources"
  },
  "files": [
    "assets/**/*",
    "build/**/*",
    "capacitor.config.*",
    "app/**/*",
  ],
  "publish": null,
  "nsis": {
    "allowElevation": true,
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  },
  "win": {
    "target": [
      "nsis",
      "portable"
    ],
    "icon": "assets/appIcon.ico"
  },
  "portable": {
    "artifactName": "sdk_portable.exe"
  },
  "mac": {
    "target": "default",
    "category": "public.app-category.developer-tools",
    "gatekeeperAssess": false,
    "hardenedRuntime": true,
    "icon": "assets/appIcon.icns",
    "entitlements": "./entitlements.mas.plist",
    "entitlementsInherit": "./entitlements.mas.plist"
  },
  "linux": {
    "target": [
      "AppImage"
    ],
    "category": "Utility",
    "icon": "assets/appIcon.icns"
  },
  "forceCodeSigning": false,
  "removePackageScripts": false,
  "includeSubNodeModules": false,
  "asar": false,
  beforePack: (context) => {
    console.log('beforePack outDir', context.outDir);
    console.log('beforePack appOutDir', context.appOutDir);
  },
}