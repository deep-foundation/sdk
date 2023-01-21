import React, { useCallback, useEffect } from 'react';
import { TokenProvider } from '@deep-foundation/deeplinks/imports/react-token';
import {
  LocalStoreProvider,
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  DeepClient,
  DeepProvider,
  useDeep,
  useDeepSubscription,
} from '@deep-foundation/deeplinks/imports/client';

import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { saveGeneralInfo } from '../imports/device/save-general-info';
import { initializePackage } from '../imports/device/initialize-package';
import { PACKAGE_NAME } from '../imports/dialog/package-name';
import { getBatteryInfo as saveBatteryInfo } from '../imports/device/save-battery-info';
import { getLanguageId as saveLanguageId } from '../imports/device/save-language-id';
import { getLanguageTag as saveLanguageTag } from '../imports/device/save-language-tag';
import { Provider } from '../imports/provider';
import { AlertOptions, ConfirmOptions, ConfirmResult, Dialog, PromptOptions, PromptResult } from '@capacitor/dialog'
import { getPromptOptionsFromDeep } from '../imports/dialog/getPromptOptionsFromDeep';
import { insertPromptResultToDeep } from '../imports/dialog/insertPromptResultToDeep';
import { getConfirmOptionsFromDeep } from '../imports/dialog/getConfirmOptionsFromDeep';
import { insertConfirmResultToDeep } from '../imports/dialog/insertConfirmResultToDeep';
import { getAlertOptionsFromDeep } from '../imports/dialog/getAlertOptionsFromDeep';

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
