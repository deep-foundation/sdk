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

  {
    const accelerationHandler = useRef<PluginListenerHandle>(undefined);

    const { data, loading, error } = useDeepSubscription({
      type_id: {
        _id: ["@deep-foundation/core", "Contain"]
      },
      from_id: deviceLinkId,
      to: {
        type_id: {
          _id: [PACKAGE_NAME, "SubscribeToAcceleration"]
        }
      }
    })

    useEffect(() => {
      new Promise(async () => {
        if (loading) {
          return
        }
        if (data.length === 0) {
          accelerationHandler.current?.remove()
        } else {
          accelerationHandler.current = await Motion.addListener('accel', async (event) => {
            await updateOrInsertAccelerationDataToDeep({
              deep,
              data: event,
              deviceLinkId,
            });
          });
        }
      })
    }, [data, loading, error])
  }

  {
    const orientationHandler = useRef<PluginListenerHandle>(undefined);

    const { data, loading, error } = useDeepSubscription({
      type_id: {
        _id: ["@deep-foundation/core", "Contain"]
      },
      from_id: deviceLinkId,
      to: {
        type_id: {
          _id: [PACKAGE_NAME, "SubscribeToOrientation"]
        }
      }
    })

    useEffect(() => {
      new Promise(async () => {
        if (loading) {
          return
        }
        if (data.length === 0) {
          orientationHandler.current?.remove()
        } else {
          orientationHandler.current = await Motion.addListener(
            'orientation',
            async (event) => {
              await updateOrInsertOrientationDataToDeep({
                deep,
                data: event,
                deviceLinkId,
              });
            }
          );
        }
      })
    }, [data, loading, error])
  }


  return (
    <Stack>

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
