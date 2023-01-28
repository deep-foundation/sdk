import React, { useCallback, useEffect, useState } from 'react';
import { TokenProvider } from '@deep-foundation/deeplinks/imports/react-token';
import {
  LocalStoreProvider,
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
  useDeepSubscription,
} from '@deep-foundation/deeplinks/imports/client';

import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import { PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';
import { updateOrInsertAccelerationDataToDeep } from '../imports/motion/update-or-insert-acceleration-data-to-deep';
import { updateOrInsertOrientationDataToDeep } from '../imports/motion/update-or-insert-orientation-data-to-deep';
import { insertPackageLinksToDeep } from '../imports/motion/insert-package-links-to-deep';

function Content() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore('deviceLinkId', undefined);

  const {
    data: motionPackageLinksContainedInUser,
    loading: isMotionPackageLinksContainedInDeviceLoading,
  } = useDeepSubscription({
    type_id: {
      _id: ['@deep-foundation/core', 'Contain'],
    },
    from_id: deep.linkId,
    to: {
      type_id: {
        _id: ['@deep-foundation/core', 'Package'],
      },
      string: {
        value: '@deep-foundation/motion',
      },
    },
  });
  

  const [isMotionPackageInstalled, setIsMotionPackageInstalled] =
    useState(false);

  useEffect(() => {
    console.log({ motionPackageLinksContainedInUser, isMotionPackageLinksContainedInDeviceLoading });

    if (isMotionPackageLinksContainedInDeviceLoading) {
      return;
    }
    const isMotionPackageInstalled =
      !isMotionPackageLinksContainedInDeviceLoading &&
      motionPackageLinksContainedInUser.length > 0;
    console.log({ isMotionPackageInstalled });

    setIsMotionPackageInstalled(isMotionPackageInstalled);

    if (!isMotionPackageInstalled) {
      console.log('Install!');

      insertPackageLinksToDeep({deep});
    }
  }, [motionPackageLinksContainedInUser]);

  const [accelHandler, setAccelHandler] =
    useState<PluginListenerHandle>(undefined);
  const [orientationHandler, setOrientationHandler] =
    useState<PluginListenerHandle>(undefined);

  return (
    <Stack>
      <Button isDisabled={!(typeof DeviceMotionEvent !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function')}
        onClick={async () => {
          await (DeviceMotionEvent as any).requestPermission();
        }}
      >
        Give permissions
      </Button>
      {/* <Button isDisabled={isMotionPackageInstalled}
        onClick={async () => {
          await insertPackageLinksToDeep({deep});
        }}
      >
        Initialize package
      </Button> */}
      <Button
        isDisabled={!isMotionPackageInstalled || Boolean(accelHandler)}
        onClick={async () => {
          const accelHandler = await Motion.addListener('accel', (event) => {
            updateOrInsertAccelerationDataToDeep({
              deep,
              data: event,
              deviceLinkId,
            });
          });
          setAccelHandler(accelHandler);
        }}
      >
        Subscribe to acceleration data
      </Button>
      <Button
        isDisabled={!isMotionPackageInstalled || !accelHandler}
        onClick={async () => {
          accelHandler.remove();
          setAccelHandler(undefined);
        }}
      >
        Unsubscribe from acceleration data
      </Button>
      <Button
        isDisabled={!isMotionPackageInstalled || Boolean(orientationHandler)}
        onClick={async () => {
          const orientationHandler = await Motion.addListener(
            'orientation',
            (event) => {
              updateOrInsertOrientationDataToDeep({
                deep,
                data: event,
                deviceLinkId,
              });
            }
          );
          setOrientationHandler(orientationHandler);
        }}
      >
        Subscribe to orientation data
      </Button>
      <Button
        isDisabled={!isMotionPackageInstalled || !orientationHandler}
        onClick={async () => {
          orientationHandler.remove();
          setOrientationHandler(undefined);
        }}
      >
        Unsubscribe from orientation data
      </Button>
      <Button
        isDisabled={!isMotionPackageInstalled}
        onClick={async () => {
          await Motion.removeAllListeners();
        }}
      >
        Unsubscribe
      </Button>
    </Stack>
  );
}

export default function DevicePage() {
  return (
    <ChakraProvider>
      <Provider>
        <DeepProvider>
          <Content />
        </DeepProvider>
      </Provider>
    </ChakraProvider>
  );
}
