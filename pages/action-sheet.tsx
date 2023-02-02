import React, { useCallback, useEffect } from 'react';
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
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { installPackage } from '../imports/action-sheet/install-package';


function Content() {
  const deep = useDeep();
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );
  useEffect(() => {
    defineCustomElements(window);
    self["ActionSheet"] = ActionSheet;
    self["ActionSheetButtonStyle"] = ActionSheetButtonStyle;
  }, []);


  return (
    <Stack>
      <Button onClick={async () => {
        await installPackage({deep});
      }}>Install package</Button>
    </Stack>
  );
}

export default function ActionSheetPage() {
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
