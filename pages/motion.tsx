import React, { useState } from 'react';
import {
  DeepClient,
} from '@deep-foundation/deeplinks/imports/client';

import { Button, Stack } from '@chakra-ui/react';
import { PluginListenerHandle } from '@capacitor/core';
import Link from 'next/link';
import { Page } from '../components/page';
import { requestMotionPermissions, subscribeToAccelerationChanges, subscribeToOrientationChanges } from '@deep-foundation/capacitor-motion-integration';

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
        Subscribe to Orientation changes
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
