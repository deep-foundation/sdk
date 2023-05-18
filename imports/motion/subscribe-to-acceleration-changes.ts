import { Motion } from '@capacitor/motion';
import { saveMotionInfo } from './save-motion-info';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';

export async function subscribeToAccelerationChanges({
  deep,
  deviceLinkId,
}: SubscribeToAccelerationChangesParam) {
  console.log('subscribeToAccelerationChanges');
  return Motion.addListener('accel', async (accelData) => {
    console.log('accelEvent', accelData);
    await saveMotionInfo({
      deep,
      deviceLinkId,
      info: accelData,
    });
  });
}

export interface SubscribeToAccelerationChangesParam {
  deep: DeepClient;
  deviceLinkId: number;
}
