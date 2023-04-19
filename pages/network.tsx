import React, { useEffect } from 'react';
import { Network as CapacitorNetwork, ConnectionStatus } from "@capacitor/network"
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import saveNetworkStatuses from '../imports/network/save-network-status';

function Page() {
  const deep = useDeep();
  const [connections, setConnections] = useLocalStore<Array<ConnectionStatus>>("Connections", []);
  const [deviceLinkId] = useLocalStore<number>('deviceLinkId', undefined);

  useEffect(() => {
    if (connections.length > 0) {
      saveNetworkStatuses(deep, deviceLinkId, connections);
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
    <Button onClick={async () => await saveNetworkStatuses(deep, deviceLinkId)}>
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