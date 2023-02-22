import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
// import { getIsPackageInstalled } from '/workspace/dev/packages/sdk/imports/get-is-package-installed';
// import { insertOpenAiHandler } from '/workspace/dev/packages/sdk/imports/openai/install-package';
// const DEVICE_PACKAGE_NAME=`@deep-foundation/openai`;
async function installOpenAiPackage(deep: DeepClient){
  // if (!await getIsPackageInstalled({deep, packageName: DEVICE_PACKAGE_NAME})) {
  //   await insertOpenAiHandler();
  // }
  
  if (!await getIsPackageInstalled({deep, packageName: DEVICE_PACKAGE_NAME})) {
    await insertDevicePackageToDeep({ deep });
  }
}