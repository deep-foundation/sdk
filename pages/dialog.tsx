import React, { useCallback } from 'react';
import { TokenProvider } from '@deep-foundation/deeplinks/imports/react-token';
import {
  LocalStoreProvider,
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
  useDeepSubscription,
} from '@deep-foundation/deeplinks/imports/client';

import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { saveGeneralInfo } from '../imports/device/save-general-info';
import { initializePackage } from '../imports/device/initialize-package';
import { PACKAGE_NAME } from '../imports/device/package-name';
import { getBatteryInfo as saveBatteryInfo } from '../imports/device/save-battery-info';
import { getLanguageId as saveLanguageId } from '../imports/device/save-language-id';
import { getLanguageTag as saveLanguageTag } from '../imports/device/save-language-tag';
import { Provider } from '../imports/provider';

function Content() {
  const deep = useDeep();
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  return (
    <Stack>
      <Text>{deviceLinkId}</Text>
      <Button
        onClick={async () => {

        }}
      >
        Alert
      </Button>
    </Stack>
  );
}

export default function DialogPage() {
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
