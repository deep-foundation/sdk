import { Motion } from '@capacitor/motion';
import { saveMotionInfo } from './save-motion-info';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';

export async function subscribeToOrientationChanges({
  deep,
  deviceLinkId,
}: SubscribeToOrientationChangesParam) {
  return Motion.addListener('orientation', async (rotationRate) => {
    await saveMotionInfo({
      deep,
      deviceLinkId,
      data: {
        rotationRate,
      },
    });
  });
}

export interface SubscribeToOrientationChangesParam {
  deep: DeepClient;
  deviceLinkId: number;
}
