import { DeepClient, SerialOperation } from '@deep-foundation/deeplinks/imports/client';
import { MOTION_PACKAGE_NAME } from './package-name';
import {
  BatteryInfo,
  Device,
  DeviceInfo,
  GetLanguageCodeResult,
  LanguageTag,
} from '@capacitor/device';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';
import { createSerialOperation } from '@deep-foundation/deeplinks/imports/gql';
import { AccelListenerEvent, Motion, RotationRate } from '@capacitor/motion';
import { BoolExpLink } from '@deep-foundation/deeplinks/imports/client_types';

export type MotionInfo = AccelListenerEvent | Pick<AccelListenerEvent, 'rotationRate'>;

export async function saveMotionInfo(
  params: { deep: DeepClient; data: MotionInfo } & (
    | { deviceLinkId: number }
    | { deviceLink: Link<number> }
  )
) {
  const { deep } = params;
  const serialOperations: Array<SerialOperation> = []
  let deviceLink = await getDeviceLink();
  let motionLinkId: number;
  let value: MotionInfo | undefined;
  const motionLink = await getMotionLinkOrUndefined({deviceLinkId: deviceLink.id});
  if(motionLink) {
    motionLinkId = motionLink.id;
    value = motionLink.value?.value
  } else {
    const reservedLinkIds = await deep.reserve(1)
    motionLinkId = reservedLinkIds.pop()
    serialOperations.push(
      await getMotionLinkInsertSerialOperation({deviceLinkId: deviceLink.id, motionLinkId})
    );
  }
  if(value) {
    serialOperations.push(
      await getMotionLinkValueUpdateSerialOperation({motionLinkId})
    );
  } else {
    serialOperations.push(
      await getMotionLinkValueInsertSerialOperation({motionLinkId})
    );
  }
  

  async function getDeviceLink() {
    let deviceLink: Link<number>;
    if ('deviceLinkId' in params) {
      const { data } = await deep.select({
        id: params.deviceLinkId,
      });
      deviceLink = data[0];
    } else if ('deviceLink' in params) {
      deviceLink = params.deviceLink;
    } else {
      throw new Error(`Either deviceLink or deviceLinkId must be passed`);
    }
    return deviceLink;
  }

  async function getMotionLinkOrUndefined({deviceLinkId}: {deviceLinkId: number}): Promise<Link<number> | undefined> {
  const selectData: BoolExpLink = {
      type_id: {
        _id: [MOTION_PACKAGE_NAME, "Motion"]
      },
      from_id: deviceLinkId,
      to_id: deviceLinkId
    }
    const { data: [motionLink] } = await deep.select(selectData)
    // if (!motionLink) {
    //   throw new Error(`Select with data ${selectData} return empty result`)
    // }
    return motionLink
  }

  async function getMotionLinkInsertSerialOperation({deviceLinkId, motionLinkId}: {deviceLinkId: number, motionLinkId: number}) {
    return createSerialOperation({
      table: 'links',
      type: 'insert',
      objects: {
        id: motionLinkId,
        type_id: await deep.id(MOTION_PACKAGE_NAME, "Motion"),
        from_id: deviceLinkId,
        to_id: deviceLinkId
      }
    })
  }

  async function getMotionLinkValueInsertSerialOperation({motionLinkId}: {motionLinkId: number}) {
    return createSerialOperation({
      table: 'objects',
      type: 'insert',
      objects: {
        link_id: motionLinkId,
        value: params.data,
      },
    })
  }

  async function getMotionLinkValueUpdateSerialOperation({motionLinkId}: {motionLinkId: number}) {
    return createSerialOperation({
      table: 'objects',
      type: 'update',
      exp: {
        link_id: motionLinkId,
      },
      value: {
        value: { ...deviceLink.value.value, ...params.data },
      },
    })
  }
}