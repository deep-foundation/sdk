import React, { useCallback } from 'react';
import { Network as CapacitorNetwork } from "@capacitor/network"
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep, DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';

import initializePackage, { PACKAGE_NAME }  from "../imports/network/initialize-package";
import saveNetworkStatus from '../imports/network/save-network-status';



function Page() {
  const deep = useDeep();
  const [connectionTypes, setConnectionTypes] = useLocalStore("ConnectionTypes", []);

  async function subscribeToNetworkStatus({ deep, connectionTypes, setConnectionTypes }:
    { deep: DeepClient, connectionTypes: string[], setConnectionTypes: (connectionTypes: string[]) => void }) {

      CapacitorNetwork.addListener('networkStatusChange', async ({ connectionType }) => {
      console.log(connectionType);
      if (connectionType === "none") {
        setConnectionTypes([...connectionTypes, connectionType]);
      } else {
        const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
        const connectionTypeLinkId = await deep.id(PACKAGE_NAME, "ConnectionType");
        const customContainerTypeLinkId = await deep.id(deep.linkId, "Network");

        setConnectionTypes([...connectionTypes, connectionType]);

        const { data: [{ id: connectionLinkId }] } = await deep.insert(connectionTypes.map((connectionType) => ({
          type_id: connectionTypeLinkId,
          string: { data: { value: connectionType } },
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: customContainerTypeLinkId,
            }]
          }
        })))

        setConnectionTypes([]);
      }
    });
  }

  return <Stack>
    <Button onClick={async () => {
      await deep.guest();
      await deep.login({ linkId: await deep.id("deep", "admin") });
    }}>
      <Text>Login as admin</Text>
    </Button>
    <Button onClick={async () => { await initializePackage(deep); }}>
      <Text>Initialize package</Text>
    </Button>
    <Button onClick={async () => { await subscribeToNetworkStatus({ deep, connectionTypes, setConnectionTypes }) }}>
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