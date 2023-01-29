const { notarize } = require('electron-notarize');

const appBundleId = 'sdk.app';

exports.default = async function packageTask (context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }
  const appName = context.packager.appInfo.productFilename;
  console.log('Notarizing...');
  await notarize({
    appBundleId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
  });
  console.log('Notarizing done');
}