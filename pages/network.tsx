import React, { useEffect } from 'react';
import { Network as CapacitorNetwork } from "@capacitor/network"
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';

import initializePackage, { PACKAGE_NAME as NETWORK_PACKAGE_NAME } from "../imports/network/initialize-package";
import saveNetworkStatus from '../imports/network/save-network-status';



function Page() {
  const deep = useDeep();
  const [connections, setConnections] = useLocalStore("Connections", []);
  const [deviceLinkId, setDeviceLinkId] = useLocalStore('deviceLinkId', undefined);

  useEffect(() => {
    const updateNetworkStatus = async (connections) => {
      for (const connection of connections) {
        await saveNetworkStatus(deep, deviceLinkId, connection)
      }
    }
    if (connections.length > 0) {
      updateNetworkStatus(connections);
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
    <Button onClick={async () => { await initializePackage(deep, deviceLinkId) }}>
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