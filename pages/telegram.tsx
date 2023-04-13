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
import { createAllContacts, initPackageContact } from '../imports/packages/contact/contact';
import { createTelegramPackage } from '../imports/packages/telegram/telegram';
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
      <Button onClick={() => createTelegramPackage({ deep })}>create telegram Package</Button>
    </Stack>
  );
}

export default function ContactsPage() {
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
