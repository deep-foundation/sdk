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
import { saveGeneralInfo } from '../imports/device/save-general-info';
import { initializePackage } from '../imports/device/initialize-package';
import { PACKAGE_NAME } from '../imports/dialog/package-name';
import { getBatteryInfo as saveBatteryInfo } from '../imports/device/save-battery-info';
import { getLanguageId as saveLanguageId } from '../imports/device/save-language-id';
import { getLanguageTag as saveLanguageTag } from '../imports/device/save-language-tag';
import { Provider } from '../imports/provider';
import {Dialog} from '@capacitor/dialog'

function Content() {
  const deep = useDeep();
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  const {data: notExecutedAlertLinks} = useDeepSubscription({
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
    async function alertNotExecutedAlert({alertLinkId}: {alertLinkId: number}) {
      const alertTitleTypeLinkId = await deep.id(PACKAGE_NAME, "AlertTitle");
      const alertMessageTypeLinkId = await deep.id(PACKAGE_NAME, "AlertMessage");
      const alertButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "AlertButtonTitle");

      const {data: [{value: {value: title}}]} = await deep.select({
        from: {
          type_id: alertTitleTypeLinkId,
          from_id: alertLinkId,
        }
      });

      const {data: [{value: {value: message}}]} = await deep.select({
        from: {
          type_id: alertMessageTypeLinkId,
          from_id: alertLinkId,
        }
      });

      const {data: [{value: {value: buttonTitle}}]} = await deep.select({
        from: {
          type_id: alertButtonTitleTypeLinkId,
          from_id: alertLinkId,
        }
      });

      await Dialog.alert({
        title,
        message,
        buttonTitle,
      })
    }

    for (const notExecutedAlertLink of notExecutedAlertLinks) {
      alertNotExecutedAlert({alertLinkId: notExecutedAlertLink.id});
    }   
  }, [notExecutedAlertLinks])

    const {data: notExecutedPromptLinks} = useDeepSubscription({
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
      async function promptNotExecutedPrompt({promptLinkId: promptLinkId}: {promptLinkId: number}) {
        const promptTitleTypeLinkId = await deep.id(PACKAGE_NAME, "PromptTitle");
        const promptMessageTypeLinkId = await deep.id(PACKAGE_NAME, "PromptMessage");
        const promptOkButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "PromptOkButtonTitle");
        const promptCancelButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "PromptCancelButtonTitle");
        const promptInputPlaceholderTypeLinkId = await deep.id(PACKAGE_NAME, "PromptInputPlaceholder");
        const promptInputTextTypeLinkId = await deep.id(PACKAGE_NAME, "PromptInputText");
  
        const {data: [{value: {value: title}}]} = await deep.select({
          from: {
            type_id: promptTitleTypeLinkId,
            from_id: promptLinkId,
          }
        });
  
        const {data: [{value: {value: message}}]} = await deep.select({
          from: {
            type_id: promptMessageTypeLinkId,
            from_id: promptLinkId,
          }
        });
  
        const {data: [{value: {value: okButtonTitle}}]} = await deep.select({
          from: {
            type_id: promptOkButtonTitleTypeLinkId,
            from_id: promptLinkId,
          }
        });

        const {data: [{value: {value: cancelButtonTitle}}]} = await deep.select({
          from: {
            type_id: promptCancelButtonTitleTypeLinkId,
            from_id: promptLinkId,
          }
        });

        const {data: [{value: {value: inputPlaceholder}}]} = await deep.select({
          from: {
            type_id: promptInputPlaceholderTypeLinkId,
            from_id: promptLinkId,
          }
        });

        const {data: [{value: {value: inputText}}]} = await deep.select({
          from: {
            type_id: promptInputTextTypeLinkId,
            from_id: promptLinkId,
          }
        });
  
        return await Dialog.prompt({
          title,
          message,
          okButtonTitle,
          cancelButtonTitle,
          inputPlaceholder,
          inputText
        })
      }
  
      for (const notExecutedPromptLink of notExecutedPromptLinks) {
        promptNotExecutedPrompt({promptLinkId: notExecutedPromptLink.id});
      }   
    }, [notExecutedPromptLinks])

        const {data: notExecutedConfirmLinks} = useDeepSubscription({
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
          async function confirmNotExecutedConfirm({confirmLinkId: confirmLinkId}: {confirmLinkId: number}) {
            const confirmTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmTitle");
            const confirmMessageTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmMessage");
            const confirmOkButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmOkButtonTitle");
            const confirmCancelButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmCancelButtonTitle");
      
            const {data: [{value: {value: title}}]} = await deep.select({
              from: {
                type_id: confirmTitleTypeLinkId,
                from_id: confirmLinkId,
              }
            });
      
            const {data: [{value: {value: message}}]} = await deep.select({
              from: {
                type_id: confirmMessageTypeLinkId,
                from_id: confirmLinkId,
              }
            });
      
            const {data: [{value: {value: okButtonTitle}}]} = await deep.select({
              from: {
                type_id: confirmOkButtonTitleTypeLinkId,
                from_id: confirmLinkId,
              }
            });
    
            const {data: [{value: {value: cancelButtonTitle}}]} = await deep.select({
              from: {
                type_id: confirmCancelButtonTitleTypeLinkId,
                from_id: confirmLinkId,
              }
            });
      
            return await Dialog.confirm({
                title,
                message,
                okButtonTitle,
                cancelButtonTitle,
            })
          }
      
          for (const notExecutedConfirmLink of notExecutedConfirmLinks) {
            confirmNotExecutedConfirm({confirmLinkId: notExecutedConfirmLink.id});
          }   
        }, [notExecutedConfirmLinks])

  return (
    <Stack>
      <Text>{deviceLinkId}</Text>
      <Button
        onClick={async () => {

        }}
      >
        Alert
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
