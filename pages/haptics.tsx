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
import { useHapticVibrateSubscription } from '../imports/haptics/use-haptics-vibrate-subscription';

function Content() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  useHapticVibrateSubscription({deviceLinkId,deep});

  return (
    <Stack>
      <NavBar/>
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
