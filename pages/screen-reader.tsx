import React, { useEffect, useRef, useState } from 'react';
import {
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  DeepClient,
  DeepProvider,
  useDeep,
  useDeepSubscription,
} from '@deep-foundation/deeplinks/imports/client';

import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { CAPACITOR_SCREEN_READER_PACKAGE_NAME } from '../imports/screen-reader/package-name';
import { Provider } from '../imports/provider';
import { Device } from '@capacitor/device';
import { ScreenReader } from '@capacitor/screen-reader';
import { getSpeakOptions } from '../imports/screen-reader/get-speak-options';
import { insertSpeakOptions } from '../imports/screen-reader/insert-speak-options';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';
import { useScreenReaderSubscription } from '../imports/screen-reader/use-screen-reader-subscription';
import { WithScreenReaderSubscription } from '../components/screen-reader/with-screen-reader-subscription';
import { CapacitorStoreKeys } from '../imports/capacitor-store-keys';
import { Page } from '../components/page';

function Content({deep, deviceLinkId}: {deep :DeepClient, deviceLinkId: number}) {
  const [platform, setPlatform] = useState<string | undefined>(undefined);

  const [isEnabled, setIsEnabled] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    self['ScreenReader'] = ScreenReader;
    ScreenReader.addListener('stateChange', ({ value }) => {
      setIsEnabled(value);
    });
    Device.getInfo().then((info) => setPlatform(info.platform));
  }, []);

  const content = (
    <Stack>
      {platform === 'web' && (
        <Text suppressHydrationWarning>Allow sound in website settings</Text>
      )}
      {
        Boolean(deviceLinkId) &&
        <WithScreenReaderSubscription deep={deep} deviceLinkId={deviceLinkId} />
      }
      <Button
        onClick={async () => {
          await insertSpeakOptions({
            deep,
            options: {
              value: 'Hello!',
              language: 'en',
            },
          });
        }}
      >
        Insert Default Speak Options
      </Button>
    </Stack>
  );

  return content;
}

export default function ScreenReaderPage() {
  return (
    <Page renderChildren={({deep,deviceLinkId}) => <Content deep={deep} deviceLinkId={deviceLinkId} />} />
  );
}
