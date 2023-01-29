import React, { useEffect, useState } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
  useDeepSubscription,
} from '@deep-foundation/deeplinks/imports/client';

import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { PACKAGE_NAME } from '../imports/dialog/package-name';
import { Provider } from '../imports/provider';
import { Dialog } from '@capacitor/dialog';
import { getPromptOptionsFromDeep } from '../imports/dialog/get-prompt-options-from-deep';
import { insertPromptResultsToDeep } from '../imports/dialog/insert-prompt-results-to-deep';
import { getConfirmOptionsFromDeep } from '../imports/dialog/get-confirm-options-from-deep';
import { insertConfirmResultsToDeep } from '../imports/dialog/insert-confirm-results-to-deep';
import { getAlertOptionsFromDeep } from '../imports/dialog/get-alert-options-from-deep';
import { insertPackageLinksToDeep } from '../imports/dialog/insert-package-links-to-deep';
import { useSubscriptionToNotNotifiedLinks } from '../imports/dialog/use-subscription-to-not-notified-links';
import { useNotNotifiedLinksHandling } from '../imports/dialog/use-not-notified-links-handling';
import { insertNotifiedLinks } from '../imports/dialog/insert-notified-links';
import { alert } from '../imports/dialog/alert';
import { prompt } from '../imports/dialog/prompt';
import { confirm } from '../imports/dialog/confirm';
import { usePackageInstalling } from '../imports/use-package-installing';

function Content() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore('deviceLinkId', undefined);

  const { data, loading, error } = useDeepSubscription({
    type_id: {
      _id: ['@deep-foundation/core', 'SyncTextFile'],
    },
  });

  useEffect(() => {
    new Promise(async () => {
      console.log({ data, loading,error });
      if (loading) {
        return;
      }
      // await deep.insert({
      //   type_id: await deep.id('@deep-foundation/core', 'SyncTextFile'),
      //   in: {
      //     data: {
      //       type_id: await deep.id('@deep-foundation/core', 'Contain'),
      //       from_id: deep.linkId
      //     }
      //   }
      // });
    });
  }, [data, loading]);

  // usePackageInstalling({deep, installPackageCallback: async () => {
  //   await insertPackageLinksToDeep({deep});
  // }})

  // useNotNotifiedLinksHandling({
  //   deep,
  //   deviceLinkId,
  //   type_id: {
  //     _id: [PACKAGE_NAME, 'Alert'],
  //   },
  //   callback: async ({ notNotifiedLinks }) => {
  //     await insertNotifiedLinks({ deep, deviceLinkId, notNotifiedLinks });
  //     await alert({ deep, notNotifiedLinks });
  //   },
  // });

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
