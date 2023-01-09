import React, { useEffect } from 'react';
import { Network as CapacitorNetwork } from "@capacitor/network"
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';

import initializePackage, { PACKAGE_NAME } from "../imports/network/initialize-package";
import saveNetworkStatus from '../imports/network/save-network-status';



function Page() {
  const deep = useDeep();
  const [connections, setConnections] = useLocalStore("Connections", []);

  useEffect(() => {
    const updateNetworkStatus = async (connections) => {
      const networkLinkId = await deep.id(deep.linkId, "Network");
      const wifiLinkId = await deep.id(networkLinkId, "Wifi");
      const cellularLinkId = await deep.id(networkLinkId, "Cellular");
      const unknownLinkId = await deep.id(networkLinkId, "Unknown");
      const noneLinkId = await deep.id(networkLinkId, "None");

      for (const connection of connections) {
        switch (connection.connectionType) {
          case "wifi": const { data: [{ id: _wifiLinkId }] } = await deep.insert(
            { link_id: wifiLinkId, value: connection.connected ? "connected" : "disconnected" },
            { table: "strings" }
          );
            break;
          case "cellular": const { data: [{ id: _cellularLinkId }] } = await deep.insert(
            {
              link_id: cellularLinkId, value: connection.connected ? "connected" : "disconnected"
            },
            { table: "strings" }
          );
            break;
          case "unknown": const { data: [{ id: _unknownLinkId }] } = await deep.insert(
            {
              link_id: unknownLinkId, value: connection.connected ? "connected" : "disconnected"
            },
            { table: "strings" }
          );
            break;
          case "none": const { data: [{ id: _noneLinkId }] } = await deep.insert(
            {
              link_id: noneLinkId, value: connection.connected ? "connected" : "disconnected"
            },
            { table: "strings" }
          );
            break;
        }
      }
    }

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
                  string: { data: { value: new Date() } },
                }
              }
            }]
        }
      })));
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
    <Button onClick={async () => { await initializePackage(deep) }}>
      <Text>INITIALIZE PACKAGE</Text>
    </Button>
    <Button onClick={async () => { await subscribeToNetworkStatus() }}>
      <Text>LISTEN TO NETWORK CHANGES</Text>
    </Button>
    <Button onClick={async () => await saveNetworkStatus(deep)}>
      <Text>SAVE CURRENT STATUS</Text>
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