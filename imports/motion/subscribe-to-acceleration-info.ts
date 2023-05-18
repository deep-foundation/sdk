import { Motion } from '@capacitor/motion';
import { saveMotionInfo } from './save-motion-info';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';

export async function subscribeToAccelerationInfo({
  deep,
  deviceLinkId,
}: SubscribeToAccelerationInfoParam) {
  Motion.addListener('accel', async (accelData) => {
    await saveMotionInfo({
      deep,
      deviceLinkId,
      data: accelData,
    });
  });
}

export interface SubscribeToAccelerationInfoParam {
  deep: DeepClient;
  deviceLinkId: number;
}
