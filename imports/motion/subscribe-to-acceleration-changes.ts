import { Motion } from '@capacitor/motion';
import { saveMotionInfo } from './save-motion-info';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';

export async function subscribeToAccelerationChanges({
  deep,
  deviceLinkId,
}: SubscribeToAccelerationChangesParam) {
  Motion.addListener('accel', async (accelData) => {
    await saveMotionInfo({
      deep,
      deviceLinkId,
      data: accelData,
    });
  });
}

export interface SubscribeToAccelerationChangesParam {
  deep: DeepClient;
  deviceLinkId: number;
}
