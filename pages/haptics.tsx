import React from 'react';
import {
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
} from '@deep-foundation/deeplinks/imports/client';
import { ChakraProvider, Stack } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import { NavBar } from '../components/navbar';
import { useHapticsSubscription } from '../imports/haptics/use-haptics-vibrate-subscription';
import { WithHapticsSubscription } from '../components/haptics/with-haptics-vibrate-subscription';

function Content() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  return (
    <Stack>
      <NavBar/>
      {
        Boolean(deviceLinkId) &&
        <WithHapticsSubscription deep={deep} deviceLinkId={deviceLinkId} />
      }
    </Stack>
  );
}

export default function HapticsPage() {
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
