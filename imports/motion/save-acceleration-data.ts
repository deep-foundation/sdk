import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";
import { BatteryInfo, Device, DeviceInfo, GetLanguageCodeResult, LanguageTag } from "@capacitor/device";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";
import { createSerialOperation } from "@deep-foundation/deeplinks/imports/gql";
import { AccelListenerEvent, Motion, RotationRate } from "@capacitor/motion";

export type AccelerationInfo = AccelListenerEvent | RotationRate;

export async function saveAccelerationInfo(params: { deep: DeepClient, data: AccelListenerEvent | RotationRate } & ({deviceLinkId: number} | {deviceLink: Link<number>})) {
  const {deep} = params;
  let deviceLink = await getDeviceLink();
  if(!deviceLink.value?.value) {
    await deep.serial({
      operations: [
        createSerialOperation({
          table: 'objects',
          type: 'insert',
          objects: {
            link_id: deviceLink.id,
            value: params.data
          }
        })
      ]
    })
  } else {
    await deep.serial({
      operations: [
        createSerialOperation({
          table: 'objects',
          type: 'update',
          exp: {
            link_id: deviceLink.id
          },
          value: {
            value: {...deviceLink.value.value, ...params.data}
          }
        })
      ]
    })
  }

  async function getDeviceLink() {
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
    return deviceLink;
  }
}