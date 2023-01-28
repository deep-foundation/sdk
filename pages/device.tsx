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
import { insertGeneralInfoToDeep } from '../imports/device/insert-general-info-to-deep';
import { insertPackageLinksToDeep } from '../imports/device/insert-package-links-to-deep';
import { PACKAGE_NAME } from '../imports/device/package-name';
import { insertBatteryInfoToDeep } from '../imports/device/insert-battery-info-to-deep';
import { insertLanguageIdToDeep as insertLanguageCodeToDeep } from '../imports/device/insert-language-id-to-deep';
import { insertLanguageTagToDeep } from '../imports/device/insert-language-tag-to-deep';
import { Provider } from '../imports/provider';
import { Device } from '@capacitor/device';

function Content() {
  const deep = useDeep();
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  return (
    <Stack>
      <Text suppressHydrationWarning>Device link id: {deviceLinkId ?? " "}</Text>
      <Button
        onClick={async () => {
          const deviceGeneralInfo = await Device.getInfo();
          await insertGeneralInfoToDeep({deep, deviceLinkId, deviceGeneralInfo});
        }}
      >
        Save general info
      </Button>
      <Button
        onClick={async () => {
          const deviceBatteryInfo = await Device.getBatteryInfo();
          await insertBatteryInfoToDeep({deep, deviceLinkId, deviceBatteryInfo});
        }}
      >
        Save battery info
      </Button>
      <Button
        onClick={async () => {
          const deviceLanguageCode = await Device.getLanguageCode();
          await insertLanguageCodeToDeep({deep, deviceLinkId, deviceLanguageCode});
        }}
      >
        Save language id
      </Button>
      <Button
        onClick={async () => {
          const deviceLanguageTag = await Device.getLanguageTag();
          await insertLanguageTagToDeep({deep, deviceLinkId, deviceLanguageTag});
        }}
      >
        Save language tag
      </Button>
    </Stack>
  );
}

export default function DevicePage() {
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
