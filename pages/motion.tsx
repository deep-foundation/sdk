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

  return (
    <Stack>
      <Text>{deviceLinkId}</Text>
      <Button
        onClick={async () => {
          await insertPackageLinksToDeep({deep});
        }}
      >
        Initialize package
      </Button>
      <Button
        onClick={async () => {
          const accelHandler = await Motion.addListener('accel', event => {
            insertAccelerationDataToDeep({deep, accelData: event, deviceLinkId})
          });
        }}
      >
        Subscribe to acceleration data
      </Button>
      <Button
        onClick={async () => {
          const accelHandler = await Motion.addListener('orientation', event => {
            insertOrientationDataToDeep({deep, orientationData: event, deviceLinkId})
          });
        }}
      >
        Subscribe to orientation data
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
