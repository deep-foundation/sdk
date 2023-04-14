import React, { useEffect } from 'react';
import { Network as CapacitorNetwork } from "@capacitor/network"
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';

import installPackage, { PACKAGE_NAME as NETWORK_PACKAGE_NAME } from "../imports/network/install-package";
import saveNetworkStatus from '../imports/network/save-network-status';
import updateNetworkStatus from '../imports/network/update-network-status';



function Page() {
  const deep = useDeep();
  const [connections, setConnections] = useLocalStore("Connections", []);
  const [deviceLinkId, setDeviceLinkId] = useLocalStore('deviceLinkId', undefined);

  useEffect(() => {
    const useNetwork = async (connections) => {
      await updateNetworkStatus(deep, deviceLinkId, connections)
    }
    if (connections.length > 0) {
      useNetwork(connections);
      setConnections([]);
    }
  }, [connections])

  async function subscribeToNetworkStatus() {
    CapacitorNetwork.addListener('networkStatusChange', async (connection) => {
      console.log({ connection });
      setConnections([...connections, connection]);
    })
  }

  return <Stack>
    <Text suppressHydrationWarning>Device link id: {deviceLinkId ?? " "}</Text>
    <Button onClick={async () => { await installPackage(deviceLinkId) }}>
      <Text>INITIALIZE PACKAGE</Text>
    </Button>
    <Button onClick={async () => { await subscribeToNetworkStatus() }}>
      <Text>LISTEN TO NETWORK CHANGES</Text>
    </Button>
    <Button onClick={async () => await saveNetworkStatus(deep, deviceLinkId)}>
      <Text>SAVE CURRENT STATUS</Text>
    </Button>
  </Stack>
}

export default function Index() {
  return (
    <ChakraProvider>
      <Provider>
        <DeepProvider>
          <Page />
        </DeepProvider>
      </Provider>
    </ChakraProvider>
  );
}