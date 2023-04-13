import React, { useCallback, useEffect, useRef, useState } from 'react';
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

import { Button, ChakraProvider, Code, Stack, Text } from '@chakra-ui/react';
import { insertGeneralInfoToDeep } from '../imports/device/insert-general-info-to-deep';
import { PACKAGE_NAME } from '../imports/screen-reader/package-name';
import { insertBatteryInfoToDeep } from '../imports/device/insert-battery-info-to-deep';
import { insertLanguageIdToDeep as insertLanguageCodeToDeep } from '../imports/device/insert-language-id-to-deep';
import { insertLanguageTagToDeep } from '../imports/device/insert-language-tag-to-deep';
import { Provider } from '../imports/provider';
import { Device } from '@capacitor/device';
import { ScreenReader } from '@capacitor/screen-reader';
import { getSpeakOptions } from '../imports/screen-reader/get-speak-options';
import { insertSpeakOptions } from '../imports/screen-reader/insert-speak-options';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';

function Content() {
  const deep = useDeep();
  const [platform, setPlatform] = useState<string | undefined>(undefined);

  const [deviceLinkId] = useLocalStore('deviceLinkId', undefined);

  const [isEnabled, setIsEnabled] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    self['ScreenReader'] = ScreenReader;
    ScreenReader.addListener('stateChange', ({ value }) => {
      setIsEnabled(value);
    });
    Device.getInfo().then((info) => setPlatform(info.platform));
  }, []);

  const notifyConfirmLinksBeingProcessed = useRef<Link<number>[]>([]);
  const {
    data: notifyLinks,
    loading,
    error,
  } = useDeepSubscription({
    type_id: {
      _id: [PACKAGE_NAME, 'Notify'],
    },
    _not: {
      out: {
        type_id: {
          _id: [PACKAGE_NAME, 'Notified'],
        },
      },
    },
    to_id: deviceLinkId,
  });

  useEffect(() => {
    if (loading) {
      return;
    }
    new Promise(async () => {
      const containTypeLinkId = await deep.id(
        '@deep-foundation/core',
        'Contain'
      );
      const notProcessedNotifyConfirmLinks = notifyLinks.filter(
        (link) => !notifyConfirmLinksBeingProcessed.current.includes(link)
      );
      notifyConfirmLinksBeingProcessed.current = [
        ...notifyConfirmLinksBeingProcessed.current,
        ...notProcessedNotifyConfirmLinks,
      ];
      for (const notifyLink of notifyLinks) {
        const options = await getSpeakOptions({
          deep,
          linkId: notifyLink.from_id,
        });
        console.log(`await ScreenReader.speak(${JSON.stringify(options)});`);
        await ScreenReader.speak(options);
        await deep.insert({
          type_id: await deep.id(PACKAGE_NAME, "Notified"),
          from_id: notifyLink.id,
          to_id: deviceLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }
          }
        });
      }
      const processedNotifyConfirmLinks = notProcessedNotifyConfirmLinks;
      notifyConfirmLinksBeingProcessed.current =
        notifyConfirmLinksBeingProcessed.current.filter(
          (link) => !processedNotifyConfirmLinks.includes(link)
        );
    });
  }, [notifyLinks, loading, error]);

  const content = (
    <Stack>
      <Text suppressHydrationWarning>isEnabled: {isEnabled ?? ' '}</Text>
      {platform === 'web' && (
        <Text suppressHydrationWarning>Allow sound in website settings</Text>
      )}
      <Text>Install the package by using these commands in terminal:</Text>
      <Code display={'block'} whiteSpace={'pre'}>
        {`
package_name="screen-reader" 
npx ts-node "./imports/\${package_name}/install-package.ts"
`}
      </Code>
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
      <Text>
        Insert a link with type Notify from ScreenReader to device. You should
        get a notification after that.
      </Text>
      <Code display={'block'} whiteSpace={'pre'}>
        {`
await deep.insert({
    type_id: await deep.id("${PACKAGE_NAME}", "Notify"),
    from_id: pushNotificationLinkId, 
    to_id: deviceLinkId, 
    in: {data: {type_id: await deep.id("@deep-foundation/core", "Contain"), from_id: deep.linkId}}
})
  `}
      </Code>
    </Stack>
  );

  return content;
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
