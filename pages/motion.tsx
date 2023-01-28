import React, { useCallback, useState } from 'react';
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
import { insertAccelerationDataToDeep } from '../imports/motion/insert-acceleration-data-to-deep';
import { insertOrientationDataToDeep } from '../imports/motion/insert-orientation-data-to-deep';
import { insertPackageLinksToDeep } from '../imports/motion/insert-package-links-to-deep';

function Content() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  const {data: motionPackageLinksContainedInDevice,loading: isMotionPackageLinksContainedInDeviceLoading} = useDeepSubscription({
    type_id: {
      _id: ["@deep-foundation/core", "Contain"]
    },
    to: {
      type_id: {
        _id: ["@deep-foundation/core", "Package"]
      },
      string: {
        value: "@deep-foundation/motion"
      }
    }
  });

  const [accelHandler, setAccelHandler] = useState<PluginListenerHandle>(undefined);
  const [orientationHandler, setOrientationHandler] = useState<PluginListenerHandle>(undefined);

  return (
    <Stack>
      <Button isDisabled={!isMotionPackageLinksContainedInDeviceLoading && motionPackageLinksContainedInDevice.length > 0}
        onClick={async () => {
          await insertPackageLinksToDeep({deep});
        }}
      >
        Initialize package
      </Button>
      <Button isDisabled={Boolean(accelHandler)}
        onClick={async () => {
          const accelHandler = await Motion.addListener('accel', event => {
            insertAccelerationDataToDeep({deep, accelData: event, deviceLinkId})
          });
          setAccelHandler(accelHandler);
        }}
      >
        Subscribe to acceleration data
      </Button>
      <Button isDisabled={!accelHandler}
        onClick={async () => {
          accelHandler.remove();
          setAccelHandler(undefined);
        }}
      >
        Unsubscribe from acceleration data
      </Button>
      <Button isDisabled={Boolean(orientationHandler)}
        onClick={async () => {
          const orientationHandler = await Motion.addListener('orientation', event => {
            insertOrientationDataToDeep({deep, orientationData: event, deviceLinkId})
          });
          setOrientationHandler(orientationHandler);
        }}
      >
        Subscribe to orientation data
      </Button>
      <Button isDisabled={!orientationHandler}
        onClick={async () => {
          orientationHandler.remove();
          setOrientationHandler(undefined);
        }}
      >
        Unsubscribe from orientation data
      </Button>
      <Button
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
