import React, { useEffect, useRef, useState } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
  useDeepSubscription,
} from '@deep-foundation/deeplinks/imports/client';

import { Button, ChakraProvider, Input, Stack, Text } from '@chakra-ui/react';
import { PACKAGE_NAME } from '../imports/dialog/package-name';
import { PACKAGE_NAME as NOTIFICATION_PACKAGE_NAME } from '../imports/notification/package-name';
import { Provider } from '../imports/provider';
import { Dialog } from '@capacitor/dialog';
import { getPromptOptionsFromDeep } from '../imports/dialog/get-prompt-options-from-deep';
import { insertPromptResultToDeep } from '../imports/dialog/insert-prompt-result-to-deep';
import { getConfirmOptionsFromDeep } from '../imports/dialog/get-confirm-options-from-deep';
import { insertConfirmResultToDeep } from '../imports/dialog/insert-confirm-result-to-deep';
import { getAlertOptionsFromDeep } from '../imports/dialog/get-alert-options-from-deep';
import { useSubscriptionToNotNotifiedLinks } from '../imports/notification/use-subscription-to-not-notified-links';
import { useNotNotifiedLinksHandling } from '../imports/notification/use-not-notified-links-handling';
import { insertNotifiedLinks } from '../imports/notification/insert-notified-links';
import { usePackageInstalling } from '../imports/use-package-installing';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';
import { insertAlertToDeep } from '../imports/dialog/insert-alert-to-deep';
import { notifyDialog } from '../imports/dialog/notify-dialog';
import { insertPromptToDeep } from '../imports/dialog/insert-prompt-to-deep';
import { insertConfirmToDeep } from '../imports/dialog/insert-confirm-to-deep';

function Content() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore('deviceLinkId', undefined);

  useEffect(() => {
    self["Dialog"] = Dialog;
  }, [])


  useNotNotifiedLinksHandling({
    deep,
    deviceLinkId,
    query: {
      type: { in: { string: { value: { _eq: "Alert" } } } }
    },
    callback: async ({ notNotifiedLinks }) => {     
      for (const alertLink of notNotifiedLinks) {
        const alertOptions = await getAlertOptionsFromDeep({ deep, alertLinkId: alertLink.id });
        await Dialog.alert(alertOptions);
      }
      const { data: notifyLinks } = await deep.select({
        type: { in: { string: { value: { _eq: "Notify" } } } },
        from_id: {
          _in: notNotifiedLinks.map(link => link.id),
        },
        _not: {
          out: { type: { in: { string: { value: { _eq: "Notified" } } } } }
        }
      })
      await insertNotifiedLinks({ deep, deviceLinkId, notifyLinkIds: notifyLinks.map(link => link.id) });
    },
  });

  useNotNotifiedLinksHandling({
    deep,
    deviceLinkId,
    query: {
      type: { in: { string: { value: { _eq: "Prompt" } } } }
    },
    callback: async ({ notNotifiedLinks }) => {     
      for (const promptLink of notNotifiedLinks) {
        const promptOptions = await getPromptOptionsFromDeep({ deep, promptLinkId: promptLink.id });
        const promptResult = await Dialog.prompt(promptOptions);
        await insertPromptResultToDeep({deep, deviceLinkId, promptLinkId: promptLink.id, promptResult});
      }
      const { data: notifyLinks } = await deep.select({
        type: { in: { string: { value: { _eq: "Notify" } } } },
        from_id: {
          _in: notNotifiedLinks.map(link => link.id),
        },
        _not: {
          out: { type: { in: { string: { value: { _eq: "Notified" } } } } }
        }
      })
      await insertNotifiedLinks({ deep, deviceLinkId, notifyLinkIds: notifyLinks.map(link => link.id) });
    },
  });

  useNotNotifiedLinksHandling({
    deep,
    deviceLinkId,
    query: {
      type: { in: { string: { value: { _eq: "Confirm" } } } }
    },
    callback: async ({ notNotifiedLinks }) => {     
      for (const confirmLink of notNotifiedLinks) {
        const confirmOptions = await getConfirmOptionsFromDeep({ deep, confirmLinkId: confirmLink.id });
        const confirmResult = await Dialog.confirm(confirmOptions);
        await insertConfirmResultToDeep({deep, deviceLinkId, confirmLinkId: confirmLink.id, confirmResult});
      }
      const { data: notifyLinks } = await deep.select({
        type: { in: { string: { value: { _eq: "Notify" } } } },
        from_id: {
          _in: notNotifiedLinks.map(link => link.id),
        },
        _not: {
          out: { type: { in: { string: { value: { _eq: "Notified" } } } } }
        }
      })
      await insertNotifiedLinks({ deep, deviceLinkId, notifyLinkIds: notifyLinks.map(link => link.id) });
    },
  });

  // useNotNotifiedLinksHandling({
  //   deep,
  //   deviceLinkId,
  //   query: {
  //     type_id: {
  //       _id: [PACKAGE_NAME, 'Alert'],
  //     },
  //     out: {
  //       type_id: {
  //         _id: [PACKAGE_NAME, "AlertMessage"]
  //       }
  //     }
  //   },
  //   callback: async ({ notNotifiedLinks }) => {
  //     console.log({ notNotifiedLinks });
  //     const alertLinksNotBeingProcessed = notNotifiedLinks.filter(link => !notifyAlertLinksBeingProcessed.current.has(link))
  //     notifyAlertLinksBeingProcessed.current = new Set([...notifyAlertLinksBeingProcessed.current, ...alertLinksNotBeingProcessed]);
  //     await alert({ deep, linkId: alertLinksNotBeingProcessed.map(link => link.from_id) });
  //     await insertNotifiedLinks({ deep, deviceLinkId, links: alertLinksNotBeingProcessed });
  //     const processedLinks = alertLinksNotBeingProcessed;
  //     notifyAlertLinksBeingProcessed.current = new Set([...notifyAlertLinksBeingProcessed.current].filter(link => !processedLinks.includes(link)));
  //   },
  // });

  const [alertTitle, setAlertTitle] = useState<undefined | string>(undefined);
  const [alertMessage, setAlertMessage] = useState<undefined | string>(undefined);
  const [alertButtonTitle, setAlertButtonTitle] = useState<undefined | string>(undefined);

  // useNotNotifiedLinksHandling({
  //   deep,
  //   deviceLinkId,
  //   query: {
  //     type_id: {
  //       _id: [PACKAGE_NAME, 'Prompt'],
  //     },
  //     out: {
  //       type_id: {
  //         _id: [PACKAGE_NAME, "PromptMessage"]
  //       }
  //     }
  //   },
  //   callback: async ({ notNotifiedLinks }) => {
  //     console.log({ notNotifiedLinks });
  //     const promptLinksNotBeingProcessed = notNotifiedLinks.filter(link => !notifyPromptLinksBeingProcessed.current.has(link))
  //     notifyPromptLinksBeingProcessed.current = new Set([...notifyPromptLinksBeingProcessed.current, ...promptLinksNotBeingProcessed]);
  //     await prompt({ deep, links: promptLinksNotBeingProcessed });
  //     await insertNotifiedLinks({ deep, deviceLinkId, links: promptLinksNotBeingProcessed });
  //     const processedLinks = promptLinksNotBeingProcessed;
  //     notifyPromptLinksBeingProcessed.current = new Set([...notifyPromptLinksBeingProcessed.current].filter(link => !processedLinks.includes(link)));
  //   },
  // });

  const [promptTitle, setPromptTitle] = useState<undefined | string>(undefined);
  const [promptMessage, setPromptMessage] = useState<undefined | string>(undefined);
  const [promptOkButtonTitle, setPromptOkButtonTitle] = useState<undefined | string>(undefined);
  const [promptCancelButtonTitle, setPromptCancelButtonTitle] = useState<undefined | string>(undefined);
  const [promptInputPlaceholder, setPromptInputPlaceholder] = useState<undefined | string>(undefined);
  const [promptInputText, setPromptInputText] = useState<undefined | string>(undefined);

  // useNotNotifiedLinksHandling({
  //   deep,
  //   deviceLinkId,
  //   query: {
  //     type_id: {
  //       _id: [PACKAGE_NAME, 'Confirm'],
  //     },
  //     out: {
  //       type_id: {
  //         _id: [PACKAGE_NAME, "ConfirmMessage"]
  //       }
  //     }
  //   },
  //   callback: async ({ notNotifiedLinks }) => {
  //     console.log({ notNotifiedLinks });
  //     const confirmLinksNotBeingProcessed = notNotifiedLinks.filter(link => !notifyConfirmLinksBeingProcessed.current.has(link))
  //     notifyConfirmLinksBeingProcessed.current = new Set([...notifyConfirmLinksBeingProcessed.current, ...confirmLinksNotBeingProcessed]);
  //     // const alertOptions = await getAlertOptionsFromDeep({
  //     //   deep,
  //     //   alertLinkId: linkId,
  //     // });
  //     // await Dialog.alert(alertOptions);
  //     await insertNotifiedLinks({ deep, deviceLinkId, links: confirmLinksNotBeingProcessed });
  //     const processedLinks = confirmLinksNotBeingProcessed;
  //     notifyConfirmLinksBeingProcessed.current = new Set([...notifyConfirmLinksBeingProcessed.current].filter(link => !processedLinks.includes(link)));
  //   },
  // });

  const [confirmTitle, setConfirmTitle] = useState<undefined | string>(undefined);
  const [confirmMessage, setConfirmMessage] = useState<undefined | string>(undefined);
  const [confirmOkButtonTitle, setConfirmOkButtonTitle] = useState<undefined | string>(undefined);
  const [confirmCancelButtonTitle, setConfirmCancelButtonTitle] = useState<undefined | string>(undefined);

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
      }} />
      <Input placeholder='Alert Message' onChange={(event) => {
        setAlertMessage(event.target.value);
      }} />
      <Input placeholder='Alert Button Title' onChange={(event) => {
        setAlertButtonTitle(event.target.value);
      }} />
      <Button onClick={async () => {
        await insertAlertToDeep({
          deep, containInLinkId: deep.linkId, alertOptions: {
            title: alertTitle,
            message: alertMessage,
            buttonTitle: alertButtonTitle
          }
        })
      }}>
        Insert Alert
      </Button>
      <Input placeholder='Prompt Title' onChange={(event) => {
        setPromptTitle(event.target.value);
      }} />
      <Input placeholder='Prompt Message' onChange={(event) => {
        setPromptMessage(event.target.value);
      }} />
      <Input placeholder='Prompt Ok Button Title' onChange={(event) => {
        setPromptOkButtonTitle(event.target.value);
      }} />
            <Input placeholder='Prompt Cancel Button Title' onChange={(event) => {
        setPromptCancelButtonTitle(event.target.value);
      }} />
                  <Input placeholder='Prompt Input Placeholder' onChange={(event) => {
        setPromptInputPlaceholder(event.target.value);
      }} />
                        <Input placeholder='Prompt Input Text' onChange={(event) => {
        setPromptInputText(event.target.value);
      }} />
      <Button onClick={async () => {
        await insertPromptToDeep({
          deep, 
          promptOptions: {
            title: promptTitle,
            message: promptMessage,
            okButtonTitle: promptOkButtonTitle,
            cancelButtonTitle: promptCancelButtonTitle,
            inputPlaceholder: promptInputPlaceholder,
            inputText: promptInputText
          }
        })
      }}>
        Insert Prompt
      </Button>
      <Input placeholder='Confirm Title' onChange={(event) => {
        setConfirmTitle(event.target.value);
      }} />
      <Input placeholder='Confirm Message' onChange={(event) => {
        setConfirmMessage(event.target.value);
      }} />
      <Input placeholder='Confirm Ok Button Title' onChange={(event) => {
        setConfirmOkButtonTitle(event.target.value);
      }} />
            <Input placeholder='Confirm Cancel Button Title' onChange={(event) => {
        setConfirmCancelButtonTitle(event.target.value);
      }} />
      <Button onClick={async () => {
        await insertConfirmToDeep({
          deep, confirmOptions: {
            title: confirmTitle,
            message: confirmMessage,
            okButtonTitle: confirmOkButtonTitle,
            cancelButtonTitle: confirmCancelButtonTitle,
          }
        })
      }}>
        Insert Confirm
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
