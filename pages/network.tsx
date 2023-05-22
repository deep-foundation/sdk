import React, { useEffect, useState } from 'react';
import { ConnectionStatus, Network } from '@capacitor/network';
import { useLocalStore } from '@deep-foundation/store/local';
import {
  DeepClient,
  DeepProvider,
  useDeep,
} from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import saveNetworkStatuses from '../imports/network/save-network-status';
import { Page } from '../components/page';
import { CapacitorStoreKeys } from '../imports/capacitor-store-keys';
import { PluginListenerHandle } from '@capacitor/core';

function Content({
  deep,
  deviceLinkId,
}: {
  deep: DeepClient;
  deviceLinkId: number;
}) {
  const [connectionStatuses, setConnectionStatuses] = useLocalStore<
    Array<ConnectionStatus>
  >(CapacitorStoreKeys[CapacitorStoreKeys.NetworkConnectionStatuses], []);
  const [connectionStatusChangeHandler, setConnectionStatusChangeHandler] =
    useState<PluginListenerHandle | undefined>();

  useEffect(() => {
    new Promise(async () => {
      const currentNetworkStatus = await Network.getStatus();
      if (currentNetworkStatus.connectionType === 'none') {
        return;
      }
      if (connectionStatuses.length > 0) {
        saveNetworkStatuses({ deep, deviceLinkId, connectionStatuses });
        setConnectionStatuses([]);
      }
    });
  }, [connectionStatuses]);

  async function subscribeToNetworkStatusChanges() {
    if (connectionStatusChangeHandler) {
      connectionStatusChangeHandler.remove();
    }
    const newConnectionStatusesChangesHandler = await Network.addListener(
      'networkStatusChange',
      async (connectionStatus) => {
        setConnectionStatuses((connectionStatuses) => [
          ...connectionStatuses,
          connectionStatus,
        ]);
      }
    );
    setConnectionStatusChangeHandler(newConnectionStatusesChangesHandler);
  }

  return (
    <Stack>
      <Button
        onClick={async () => {
          await subscribeToNetworkStatusChanges();
        }}
      >
        <Text>Subscribe to network changes</Text>
      </Button>
      <Button
        onClick={async () => await saveNetworkStatuses({ deep, deviceLinkId })}
      >
        <Text>Save current network state</Text>
      </Button>
    </Stack>
  );
}

export default function NetworkPage() {
  return (
    <Page
      renderChildren={({ deep, deviceLinkId }) => {
        return <Content deep={deep} deviceLinkId={deviceLinkId} />;
      }}
    />
  );
}
