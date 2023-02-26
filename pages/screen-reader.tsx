import React, { useCallback, useEffect, useState } from 'react';
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
import { PACKAGE_NAME } from '../imports/device/package-name';
import { insertBatteryInfoToDeep } from '../imports/device/insert-battery-info-to-deep';
import { insertLanguageIdToDeep as insertLanguageCodeToDeep } from '../imports/device/insert-language-id-to-deep';
import { insertLanguageTagToDeep } from '../imports/device/insert-language-tag-to-deep';
import { Provider } from '../imports/provider';
import { Device } from '@capacitor/device';
import { ScreenReader } from '@capacitor/screen-reader';
import { getSpeakOptions } from '../imports/screen-reader/get-speak-options';
import { insertSpeakOptions } from '../imports/screen-reader/insert-speak-options';


function Content () {

  const deep = useDeep();

  const [deviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  const [isEnabled, setIsEnabled] = useState<boolean|undefined>(undefined);

  useEffect(() => {
    ScreenReader.addListener('stateChange', ({ value }) => {
      setIsEnabled(value)
    });
  }, 
  [])

  const {data: notifyLinks, loading, error} = useDeepSubscription({
    type_id: {
      _id: [PACKAGE_NAME, "Notify"]
    },
    _not: {
      out: {
        type_id: {
          _id: [PACKAGE_NAME, "Notified"]
        }
      }
    },
    to_id: deviceLinkId
  })

  useEffect(() => {
    if(loading) {
      return
    }
    for (const notifyLink of notifyLinks) {
      const options = getSpeakOptions({
        deep,
        linkId: notifyLink.from_id
      })
    }
  }, [notifyLinks, loading, error])

  const content = <Stack>
          <Text suppressHydrationWarning>isEnabled: {isEnabled ?? " "}</Text>
    <Text>Install the package by using these commands in terminal:</Text> 
    <Code display={"block"} whiteSpace={"pre"}>
        {
`
package_name="screen-reader" 
npx ts-node "./imports/\${package_name}/install-package.ts"
`
        }
      </Code>
      <Button onClick={async () => {
        await insertSpeakOptions({
          deep,
          options: {
            value: "Hello!",
            language: "en"
          }
        })
      }}>
        Insert Default Speak Options
      </Button>
          <Text>Insert a link with type Notify from ScreenReader to device. You should get a notification after that.</Text>
      <Code display={"block"} whiteSpace={"pre"}>
{
  `
await deep.insert({
    type_id: await deep.id("${PACKAGE_NAME}", "Notify"),
    from_id: pushNotificationLinkId, 
    to_id: deviceLinkId, 
    in: {data: {type_id: await deep.id("@deep-foundation/core", "Contain"), from_id: deep.linkId}}
})
  `
}
      </Code>
  </Stack>

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
