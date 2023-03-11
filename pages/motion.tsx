import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { insertPackageToDeep } from '../imports/motion/insert-package-to-deep';
import { PACKAGE_NAME } from '../imports/motion/package-name';

function Content() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore('deviceLinkId', undefined);

  const [accelerationHandler, setAccelerationHandler] = useState();

  return (
    <Stack>
      <Button onClick={async () => {
        Motion.addListener('accel', (accelData) => {
          updateOrInsertAccelerationDataToDeep({
            deep,
            deviceLinkId,
            data: accelData
          })
        })       
      }}>
        Subscritbe to Acceleration Changes
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
