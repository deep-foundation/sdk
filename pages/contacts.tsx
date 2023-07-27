import React from 'react';
import {
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  DeepClient,
  DeepProvider,
  useDeep,
} from '@deep-foundation/deeplinks/imports/client';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import { Device } from '@capacitor/device';
import { saveAllCallHistory } from '../imports/callhistory/callhistory';
import { saveAllContacts } from '../imports/contact/contact';
import { NavBar } from '../components/navbar';
import { Page } from '../components/page';

function Content({deep, deviceLinkId}: {deep :DeepClient, deviceLinkId: number}) {
  return (
    <Stack>
      <NavBar/>
      <Button onClick={() => saveAllContacts({ deep, deviceLinkId })}>Save All Contacts</Button>
    </Stack>
  );
}

export default function ContactsPage() {
  return (
    <Page renderChildren={({deep,deviceLinkId}) => <Content deep={deep} deviceLinkId={deviceLinkId} />} />
  );
}
