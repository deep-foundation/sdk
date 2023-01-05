import React, { useCallback, useEffect } from 'react';
import { Network as CapacitorNetwork } from "@capacitor/network"
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep, DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';

import initializePackage, { PACKAGE_NAME } from "../imports/network/initialize-package";
import saveNetworkStatus from '../imports/network/save-network-status';



function Page() {
  const deep = useDeep();
  const [connections, setConnections] = useLocalStore("ConnectionTypes", []);

  useEffect(() => {
    const uploadConnections = async (connections) => {
      const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
      const connectionTypeLinkId = await deep.id(PACKAGE_NAME, "Connection");
      const connectionTypeTypeLinkId = await deep.id(PACKAGE_NAME, "ConnectionType");
      const connectedTypeLinkId = await deep.id(PACKAGE_NAME, "Connected");
      const timestampTypeLinkId = await deep.id(PACKAGE_NAME, "Timestamp");
      const networkLinkId = await deep.id(deep.linkId, "Network");

      await deep.insert(connections.map((connection) => ({
        type_id: connectionTypeLinkId,
        in: {
          data: [{
            type_id: containTypeLinkId,
            from_id: networkLinkId,
          }]
        },
        out: {
          data: [
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: connectionTypeTypeLinkId,
                  string: { data: { value: connection.connectionType } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: connectedTypeLinkId,
                  string: { data: { value: connection.connected ? "connected" : "disconnected" } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: timestampTypeLinkId,
                  string: { data: { value: new Date().toLocaleDateString() } },
                }
              }
            }]
        }
      })));
    }
    if (connections.length > 0) {
      uploadConnections(connections);
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
    <Button onClick={async () => {
      await deep.guest();
      await deep.login({ linkId: await deep.id("deep", "admin") });
    }}>
      <Text>Login as admin</Text>
    </Button>
    <Button onClick={async () => { await initializePackage(deep) }}>
      <Text>Initialize package</Text>
    </Button>
    <Button onClick={async () => { await subscribeToNetworkStatus() }}>
      <Text>Listen to changes</Text>
    </Button>
    <Button onClick={async () => await saveNetworkStatus(deep)}>
      <Text>Save Current Status</Text>
    </Button>
  </Stack>
}

export default function Network() {
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