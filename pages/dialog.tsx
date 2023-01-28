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
import { insertPromptResultToDeep } from '../imports/dialog/insert-prompt-result-to-deep';
import { getConfirmOptionsFromDeep } from '../imports/dialog/getConfirmOptionsFromDeep';
import { insertConfirmResultToDeep } from '../imports/dialog/insert-confirm-result-to-deep';
import { getAlertOptionsFromDeep } from '../imports/dialog/get-alert-options-from-deep';
import { insertPackageLinksToDeep } from '../imports/dialog/insert-package-links-to-deep';

function Content() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore('deviceLinkId', undefined);

  const {
    data: dialogPackageLinksContainedInUser,
    loading: isDialogPackageLinksContainedInUserQueryLoading,
  } = useDeepSubscription({
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
  
  
  const [isDialogPackageInstalled, setIsDialogPackageInstalled] =
  useState(false);  
  

useEffect(() => {
  console.log({dialogPackageLinksContainedInUser, isDialogPackageLinksContainedInUserQueryLoading});
  if (isDialogPackageLinksContainedInUserQueryLoading) {
    return;
  }
  const isDialogPackageInstalled =
  dialogPackageLinksContainedInUser.length > 0;

  setIsDialogPackageInstalled(isDialogPackageInstalled);

  if (!isDialogPackageInstalled) {
    console.log('Install!');

    insertPackageLinksToDeep({deep});
  }
}, [dialogPackageLinksContainedInUser]);

  const { data: notNotifiedNotifyAlertLinks ,} = useDeepSubscription({
    type_id: {
      _id: [PACKAGE_NAME, 'Notify'],
    },
    from: {
      type_id: {
        _id: [PACKAGE_NAME, 'Alert'],
      },
    },
    to_id: deviceLinkId,
    _not: {
      out: {
        type_id: {
          _id: [PACKAGE_NAME, 'Notified'],
        },
        to_id: deviceLinkId,
      },
    },
  });

  useEffect(() => {
    new Promise(async () => {
      const notifiedTypeLinkid = await deep.id(PACKAGE_NAME, 'Notified');
      await deep.insert(
        notNotifiedNotifyAlertLinks.map((notNotifiedNotifyAlertLink) => ({
          type_id: notifiedTypeLinkid,
          from_id: notNotifiedNotifyAlertLink.id,
          to_id: deviceLinkId,
        }))
      );
      for (const notNotifiedNotifyAlertLink of notNotifiedNotifyAlertLinks) {
        const alertOptions = await getAlertOptionsFromDeep({
          deep,
          alertLinkId: notNotifiedNotifyAlertLink.id,
        });
        await Dialog.alert(alertOptions);
      }
    });
  }, [notNotifiedNotifyAlertLinks]);

  const { data: notNotifiedNotifyPromptLinks } = useDeepSubscription({
    type_id: {
      _id: [PACKAGE_NAME, 'Notify'],
    },
    from: {
      type_id: {
        _id: [PACKAGE_NAME, 'Prompt'],
      },
    },
    to_id: deviceLinkId,
    _not: {
      out: {
        type_id: {
          _id: [PACKAGE_NAME, 'Notified'],
        },
        to_id: deviceLinkId,
      },
    },
  });

  useEffect(() => {
    new Promise(async () => {
      for (const notNotifiedNotifyPromptLink of notNotifiedNotifyPromptLinks) {
        await deep.insert({
          type_id: await deep.id(PACKAGE_NAME, 'Notified'),
          from_id: notNotifiedNotifyPromptLink.id,
          to_id: deviceLinkId,
        });
      }
      for (const notNotifiedNotifyPromptLink of notNotifiedNotifyPromptLinks) {
        const promptOptions = await getPromptOptionsFromDeep({
          deep,
          promptLinkId: notNotifiedNotifyPromptLink.id,
        });
        const promptResult = await Dialog.prompt(promptOptions);
        await insertPromptResultToDeep({ deep, promptResult });
      }
    });
  }, [notNotifiedNotifyPromptLinks]);

  const { data: notNotifiedNotifyConfirmLinks } = useDeepSubscription({
    type_id: {
      _id: [PACKAGE_NAME, 'Notify'],
    },
    from: {
      type_id: {
        _id: [PACKAGE_NAME, 'Confirm'],
      },
    },
    to_id: deviceLinkId,
    _not: {
      out: {
        type_id: {
          _id: [PACKAGE_NAME, 'Notified'],
        },
        to_id: deviceLinkId,
      },
    },
  });

  useEffect(() => {
    new Promise(async () => {
      const notifiedTypeLinkid = await deep.id(PACKAGE_NAME, 'Notified');
      await deep.insert(
        notNotifiedNotifyConfirmLinks.map((notNotifiedNotifyConfirmLink) => ({
          type_id: notifiedTypeLinkid,
          from_id: notNotifiedNotifyConfirmLink.id,
          to_id: deviceLinkId,
        }))
      );
      for (const notNotifiedNotifyConfirmLink of notNotifiedNotifyConfirmLinks) {
        const confirmOptions = await getConfirmOptionsFromDeep({
          deep,
          confirmLinkId: notNotifiedNotifyConfirmLink.id,
        });
        const confirmResult = await Dialog.confirm(confirmOptions);
        await insertConfirmResultToDeep({ deep, confirmResult });
      }
    });
  }, [notNotifiedNotifyConfirmLinks]);

  return (
    <Stack>
      <Button
        onClick={async () => {
          await insertPackageLinksToDeep({ deep, deviceLinkId });
        }}
      >
        Install package
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
