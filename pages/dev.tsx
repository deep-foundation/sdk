import React, { useCallback } from 'react';
import { Network as CapacitorNetwork } from "@capacitor/network"
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep, DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';

import initializePackage, { PACKAGE_NAME } from "../imports/dev/initialize-package";
import createContainers from '../imports/dev/create-containers';

function Page() {
  const deep = useDeep();
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
    <Button onClick={async () => { await createContainers(deep, ["Network", "Camera", "AudioRec"]) }}>
      <Text>Create container links</Text>
    </Button>
    <Button onClick={async () => { await createContainers(deep, ["AudioRec"]) }}>
      <Text>Create AudioRec container</Text>
    </Button>
    <Button onClick={async () => { await createContainers(deep, ["Network"]) }}>
      <Text>Create Network container</Text>
    </Button>
    <Button onClick={async () => { await createContainers(deep, ["Camera"]) }}>
      <Text>Create Camera container</Text>
    </Button>
  </Stack>
}

export default function Dev() {
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