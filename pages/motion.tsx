import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TokenProvider } from '@deep-foundation/deeplinks/imports/react-token';
import {
  LocalStoreProvider,
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  DeepClient,
  DeepProvider,
  useDeep,
  useDeepSubscription,
} from '@deep-foundation/deeplinks/imports/client';

import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import { PluginListenerHandle } from '@capacitor/core';
import { Motion } from '@capacitor/motion';
import { MOTION_PACKAGE_NAME } from '../imports/motion/package-name';
import Link from 'next/link';
import { inspect } from 'util';
import { Page } from '../components/page';
import { saveMotionInfo } from '../imports/motion/save-motion-info';
import { requestMotionPermissions } from '../imports/motion/request-motion-permissions';
import { subscribeToAccelerationChanges } from '../imports/motion/subscribe-to-acceleration-changes';
import { subscribeToOrientationChanges } from '../imports/motion/subscribe-to-orientation-changes';

function Content({
  deep,
  deviceLinkId,
}: {
  deep: DeepClient;
  deviceLinkId: number;
}) {
  const [accelerationChangesHandler, setAccelerationHandler] = useState<
    PluginListenerHandle | undefined
  >();
  const [orientationChangesHandler, setOrientationHandler] = useState<
    PluginListenerHandle | undefined
  >();

  return (
    <Stack>
      <Link href="/">Home</Link>
      <Button
        onClick={() => {
          requestMotionPermissions();
        }}
      >
        Request permissions
      </Button>
      <Button
        onClick={async () => {
          if (accelerationChangesHandler) {
            return;
          }
          const newAccelerationChangesHandler =
            await subscribeToAccelerationChanges({
              deep,
              deviceLinkId,
            });
          setAccelerationHandler(newAccelerationChangesHandler);
        }}
      >
        Subscritbe to Acceleration Changes
      </Button>
      <Button
        onClick={async () => {
          if (orientationChangesHandler) {
            return;
          }
          const newOrientationChangesHandler =
            await subscribeToOrientationChanges({
              deep,
              deviceLinkId,
            });
          setOrientationHandler(newOrientationChangesHandler);
        }}
      >
        Subscribe to orientation changes
      </Button>
    </Stack>
  );
}

export default function DevicePage() {
  return (
    <Page
      renderChildren={({ deep, deviceLinkId }) => {
        return <Content deep={deep} deviceLinkId={deviceLinkId} />;
      }}
    />
  );
}
