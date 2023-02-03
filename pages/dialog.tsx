import React, { useEffect, useRef, useState } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
  useDeepSubscription,
} from '@deep-foundation/deeplinks/imports/client';

import { Button, ChakraProvider, Input, Stack, Text } from '@chakra-ui/react';
import { PACKAGE_NAME } from '../imports/dialog/package-name';
import { Provider } from '../imports/provider';
import { Dialog } from '@capacitor/dialog';
import { getPromptOptionsFromDeep } from '../imports/dialog/get-prompt-options-from-deep';
import { insertPromptResultsToDeep } from '../imports/dialog/insert-prompt-results-to-deep';
import { getConfirmOptionsFromDeep } from '../imports/dialog/get-confirm-options-from-deep';
import { insertConfirmResultsToDeep } from '../imports/dialog/insert-confirm-results-to-deep';
import { getAlertOptionsFromDeep } from '../imports/dialog/get-alert-options-from-deep';
import { insertPackageToDeep } from '../imports/dialog/insert-package-to-deep';
import { useSubscriptionToNotNotifiedLinks } from '../imports/dialog/use-subscription-to-not-notified-links';
import { useNotNotifiedLinksHandling } from '../imports/dialog/use-not-notified-links-handling';
import { insertNotifiedLinks } from '../imports/dialog/insert-notified-links';
import { alert } from '../imports/dialog/alert';
import { prompt } from '../imports/dialog/prompt';
import { confirm } from '../imports/dialog/confirm';
import { usePackageInstalling } from '../imports/use-package-installing';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';
import { insertAlertToDeep } from '../imports/dialog/insert-alert-to-deep';

function Content() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore('deviceLinkId', undefined);
  const alertLinksBeingProcessed = useRef<Set<Link<number>>>(new Set());

  useEffect(() => {
    self["Dialog"] = Dialog;
  }, [])

  useEffect(() => {
    if (deep.linkId == 0) {
      return;
    }
    new Promise(async () => {
      const adminLinkId = await deep.id('deep', 'admin');
      if (deep.linkId != adminLinkId) {
        return;
      }

      const getIsDevicePackageInstalled = async () => {
        const devicePackageSelectResponse = await deep.select({
          type_id: {
            _id: ['@deep-foundation/core', 'Contain'],
          },
          from_id: deep.linkId,
          to: {
            type_id: {
              _id: ['@deep-foundation/core', 'Package'],
            },
            string: {
              value: PACKAGE_NAME,
            },
          },
        });
        const isDevicePackageInstalled =
          devicePackageSelectResponse.data.length > 0;
        return isDevicePackageInstalled;
      }

      if (!await getIsDevicePackageInstalled()) {
        await insertPackageToDeep({ deep });
      }
    });
  }, [deep]);

  useNotNotifiedLinksHandling({
    deep,
    deviceLinkId,
    query: {
      type_id: {
        _id: [PACKAGE_NAME, 'Alert'],
      },
      out: [
        {
          type_id: {
            _id: [PACKAGE_NAME, "AlertMessage"]
          }
        }
      ]
    },
    callback: async ({ notNotifiedLinks }) => {
      const alertLinksNotBeingProcessed = notNotifiedLinks.filter(link => !alertLinksBeingProcessed.current.has(link))
      alertLinksBeingProcessed.current = new Set([...alertLinksBeingProcessed.current, ...alertLinksNotBeingProcessed]);
      await alert({ deep, links: alertLinksNotBeingProcessed });
      await insertNotifiedLinks({ deep, deviceLinkId, links: alertLinksNotBeingProcessed });
      const processedLinks = alertLinksNotBeingProcessed;
      alertLinksBeingProcessed.current = new Set([...alertLinksBeingProcessed.current].filter(link => !processedLinks.includes(link)));
    },
  });

  const [alertTitle, setAlertTitle] = useState<undefined|string>(undefined);
  const [alertMessage, setAlertMessage] = useState<undefined|string>(undefined);
  const [alertButtonTitle, setAlertButtonTitle] = useState<undefined|string>(undefined);

  // useNotNotifiedLinksHandling({
  //   deep,
  //   deviceLinkId,
  //   type_id: {
  //     _id: [PACKAGE_NAME, 'Prompt'],
  //   },
  //   callback: async ({ notNotifiedLinks }) => {
  //     await insertNotifiedLinks({ deep, deviceLinkId, notNotifiedLinks });
  //     const {promptResults} = await prompt({ deep, notNotifiedLinks });
  //     await insertPromptResultsToDeep({ deep, promptResults });
  //   },
  // });

  // useNotNotifiedLinksHandling({
  //   deep,
  //   deviceLinkId,
  //   type_id: {
  //     _id: [PACKAGE_NAME, 'Confirm'],
  //   },
  //   callback: async ({ notNotifiedLinks }) => {
  //     await insertNotifiedLinks({ deep, deviceLinkId, notNotifiedLinks });
  //     const {confirmResults} = await confirm({ deep, alertLinks: notNotifiedLinks});
  //     await insertConfirmResultsToDeep({ deep, confirmResults });
  //   },
  // });
  return (
    <Stack>
      <Text>Device package</Text>
      <Input placeholder='Alert Title' onChange={(event) => {
        setAlertTitle(event.target.value);
      }}/>
      <Input placeholder='Alert Message' onChange={(event) => {
        setAlertMessage(event.target.value);
      }}/>
      <Input placeholder='Alert Button Title' onChange={(event) => {
        setAlertButtonTitle(event.target.value);
      }}/>
      <Button onClick={async () => {
        await insertAlertToDeep({deep, alertOptions: {
          title: alertTitle,
          message: alertMessage,
          buttonTitle: alertButtonTitle
        }})
      }}>
        Insert Alert
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
