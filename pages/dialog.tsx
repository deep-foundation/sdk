import React, { useEffect } from 'react';
import {
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
  useDeepSubscription,
} from '@deep-foundation/deeplinks/imports/client';

import { ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { PACKAGE_NAME } from '../imports/dialog/package-name';
import { Provider } from '../imports/provider';
import { Dialog } from '@capacitor/dialog'
import { getPromptOptionsFromDeep } from '../imports/dialog/get-prompt-options-from-deep';
import { insertPromptResultToDeep } from '../imports/dialog/insert-prompt-result-to-deep';
import { getConfirmOptionsFromDeep } from '../imports/dialog/getConfirmOptionsFromDeep';
import { insertConfirmResultToDeep } from '../imports/dialog/insert-confirm-result-to-deep';
import { getAlertOptionsFromDeep } from '../imports/dialog/get-alert-options-from-deep';

function Content() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  const { data: notExecutedAlertLinks } = useDeepSubscription({
    type_id: {
      _id: [PACKAGE_NAME, "Alert"]
    },
    _not: {
      in: {
        type_id: {
          _id: [PACKAGE_NAME, "Executed"]
        }
      }
    }
  })

  useEffect(() => {
    

    new Promise(async () => {
      for (const notExecutedAlertLink of notExecutedAlertLinks) {
        const alertOptions = await getAlertOptionsFromDeep({deep, alertLinkId: notExecutedAlertLink.id});
        await Dialog.alert(alertOptions)
      }
    });
  }, [notExecutedAlertLinks])

  const { data: notExecutedPromptLinks } = useDeepSubscription({
    type_id: {
      _id: ["@deep-foundation/dialog", "Prompt"]
    },
    _not: {
      in: {
        type_id: {
          _id: [PACKAGE_NAME, "Executed"]
        }
      }
    }
  })

  useEffect(() => {
    new Promise(async () => {
      for (const notExecutedPromptLink of notExecutedPromptLinks) {
        const promptOptions = await getPromptOptionsFromDeep({ deep, promptLinkId: notExecutedPromptLink.id });
        const promptResult = await Dialog.prompt(promptOptions);
        await insertPromptResultToDeep({ deep, promptResult });
      }
    })
  }, [notExecutedPromptLinks])

  const { data: notExecutedConfirmLinks } = useDeepSubscription({
    type_id: {
      _id: ["@deep-foundation/dialog", "Confirm"]
    },
    _not: {
      in: {
        type_id: {
          _id: [PACKAGE_NAME, "Executed"]
        }
      }
    }
  })

  useEffect(() => {
    new Promise(async () => {
      for (const notExecutedConfirmLink of notExecutedConfirmLinks) {
        const confirmOptions = await getConfirmOptionsFromDeep({ deep, confirmLinkId: notExecutedConfirmLink.id });
        const confirmResult = await Dialog.confirm(confirmOptions);
        await insertConfirmResultToDeep({ deep, confirmResult });
      }
    })
  }, [notExecutedConfirmLinks])

  return (
    <Stack>
      <Text>{deviceLinkId}</Text>
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
