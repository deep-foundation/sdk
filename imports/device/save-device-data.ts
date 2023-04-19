import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { DEVICE_PACKAGE_NAME } from "./package-name";
import { BatteryInfo, Device, DeviceInfo, GetLanguageCodeResult, LanguageTag } from "@capacitor/device";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";
import { createSerialOperation } from "@deep-foundation/deeplinks/imports/gql";

async function getAllDeviceData() {
  return {
    ...(await Device.getInfo()),
    ...(await Device.getBatteryInfo()),
    ...(await Device.getId()),
    ...(await Device.getLanguageCode()),
    ...(await Device.getLanguageTag()),
  }
}

export async function saveDeviceData(params: { deep: DeepClient, data?: (DeviceInfo | BatteryInfo | {languageCode: GetLanguageCodeResult['value']} | {languageTag: LanguageTag['value']}) } & ({deviceLinkId: number} | {deviceLink: Link<number>})) {
  const {deep} = params;
  let deviceLink: Link<number>;
  if('deviceLinkId' in params) {
    const {data} = await deep.select({
      id: params.deviceLinkId
    })
    deviceLink = data[0];
  } else if('deviceLink' in params) {
    deviceLink = params.deviceLink
  } else {
    throw new Error(`Either deviceLink or deviceLinkId must be passed`)
  }
  await deep.serial({
    operations: [
      createSerialOperation({
        table: 'objects',
        type: 'update',
        exp: {
          link_id: deviceLink.id
        },
        value: {
          value: {...(deviceLink.value?.value ?? {}), ...params.data ?? await getAllDeviceData()}
        }
      })
    ]
  })
}