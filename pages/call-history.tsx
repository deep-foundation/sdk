import React from 'react';
import {
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
} from '@deep-foundation/deeplinks/imports/client';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import { Device } from '@capacitor/device';
import { saveDeviceData } from '../imports/device/save-device-data';
import { createAllCallHistory } from '../imports/packages/callhistory/callhistory';
import { NavBar } from '../components/navbar';

function Content() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  return (
    <Stack>
      <NavBar/>
      <Button onClick={() => createAllCallHistory({ deep, deviceLinkId })}>Save Call History</Button>
    </Stack>
  );
}

export default function CallHistoryPage() {
  return (
    <ChakraProvider>
      <Provider>
        <DeepProvider>
          <Content />
        </DeepProvider>
      </Provider>
    </ChakraProvider>
  );
}
