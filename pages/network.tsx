import React, { useEffect } from 'react';
import { Network as CapacitorNetwork } from "@capacitor/network"
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import saveNetworkStatus from '../imports/network/save-network-status';

function Page() {
  const deep = useDeep();
  const [connections, setConnections] = useLocalStore("Connections", []);
  const [deviceLinkId] = useLocalStore('deviceLinkId', undefined);

  useEffect(() => {
    const useNetwork = async (connections) => {
      await saveNetworkStatus(deep, deviceLinkId, connections)
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
    <Button onClick={async () => { await subscribeToNetworkStatus() }}>
      <Text>LISTEN TO NETWORK CHANGES</Text>
    </Button>
    <Button onClick={async () => await saveNetworkStatus(deep, deviceLinkId)}>
      <Text>SAVE CURRENT STATUS</Text>
    </Button>
  </Stack>
}

export default function NetworkPage() {
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