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
import { insertMotionDataToDeep as insertAccelerationDataToDeep } from '../imports/motion/insertMotionDataToDeep';

function Content() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  const [accelHandler, setAccelHandler] = useState<PluginListenerHandle>(undefined);

  return (
    <Stack>
      <Text>{deviceLinkId}</Text>
      <Button
        onClick={async () => {
          const accelHandler = await Motion.addListener('accel', event => {
            insertAccelerationDataToDeep({deep, accelData: event, deviceLinkId})
          });
          setAccelHandler(accelHandler);
        }}
      >
        Subscribe to acceleration data
      </Button>
      <Button
        onClick={async () => {
          const accelHandler = await Motion.addListener('orientation', event => {
            insertOrientationDataToDeep({deep, orientationData: event, deviceLinkId})
          });
          setOrientationHandler(accelHandler);
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
