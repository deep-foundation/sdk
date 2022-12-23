import React, { useCallback } from 'react';
import { Network } from "@capacitor/network"
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep, useDeepSubscription, DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';

import initializePackage from "../imports/network/initialize-package"
import saveNetworkStatus from '../imports/network/network-listener';
// import subscribeToNetworkStatus from '../imports/network/network-listener';
import { PACKAGE_NAME } from "../imports/network/package-name";



function Page() {
  const deep = useDeep();
  const [connectionTypes, setConnectionTypes] = useLocalStore("ConnectionTypes", []);

  async function subscribeToNetworkStatus({ deep, connectionTypes, setConnectionTypes }:
    { deep: DeepClient, connectionTypes: string[], setConnectionTypes: (connectionTypes: string[]) => void }) {
    console.log("y");

    Network.addListener('networkStatusChange', async ({ connectionType }) => {
      console.log(connectionType);
      if (connectionType === 'none') {
        setConnectionTypes([...connectionTypes, connectionType]);
      } else {
        console.log("z");
        const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain")
        const connectionTypeLinkId = await deep.id(PACKAGE_NAME, "ConnectionType")
        console.log(JSON.stringify(connectionTypes));
        setConnectionTypes([...connectionTypes, connectionType]);
        console.log(JSON.stringify(connectionTypes));
        const { data: [{ id: connectionLinkId }] } = await deep.insert(connectionTypes.map((connectionType) => ({
          type_id: connectionTypeLinkId,
          string: { data: { value: connectionType } },
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deep.linkId,
            }]
          }
        })))
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
    <Button onClick={async () => { console.log("x"); await subscribeToNetworkStatus({ deep, connectionTypes, setConnectionTypes }) }}>
      <Text>Listen to changes</Text>
    </Button>
  </Stack>;
}

export default function Device() {
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