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

function Page() {
  const deep = useDeep();
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  return (
    <Stack>
      <Text>{deviceLinkId}</Text>
      <Button
        onClick={useCallback(() => {
          saveGeneralInfo(deep, deviceLinkId);
        }, [deep, deviceLinkId])}
      >
        Save general info
      </Button>
      <Button
        onClick={useCallback(() => {
          saveBatteryInfo(deep, deviceLinkId);
        }, [deep, deviceLinkId])}
      >
        Save battery info
      </Button>
      <Button
        onClick={useCallback(() => {
          saveLanguageId(deep, deviceLinkId);
        }, [deep, deviceLinkId])}
      >
        Save language id
      </Button>
      <Button
        onClick={useCallback(() => {
          saveLanguageTag(deep, deviceLinkId);
        }, [deep, deviceLinkId])}
      >
        Save language tag
      </Button>
      <Button
        onClick={useCallback(() => {
          console.log(deep);
          
        }, [deep, deviceLinkId])}
      >
        Aaaaaaaaaa
      </Button>
    </Stack>
  );
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
