import React, { useCallback, useEffect, useReducer, useState } from 'react';
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

import { Box, Button, ChakraProvider, Input, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import { insertGeneralInfoToDeep } from '../imports/device/insert-general-info-to-deep';
import { insertPackageLinksToDeep } from '../imports/device/insert-package-links-to-deep';
import { PACKAGE_NAME } from '../imports/device/package-name';
import { insertBatteryInfoToDeep } from '../imports/device/insert-battery-info-to-deep';
import { insertLanguageIdToDeep as insertLanguageCodeToDeep } from '../imports/device/insert-language-id-to-deep';
import { insertLanguageTagToDeep } from '../imports/device/insert-language-tag-to-deep';
import { Provider } from '../imports/provider';
import { Device } from '@capacitor/device';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { ActionSheet, ActionSheetButton, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { insertPackageToDeep } from '../imports/action-sheet/insert-package-to-deep';
import { useNotNotifiedLinksHandling } from '../imports/notification/use-not-notified-links-handling';
import { getOptionStyleName } from '../imports/action-sheet/get-option-style-name';
import { insertActionSheetToDeep } from '../imports/action-sheet/insert-action-sheet-to-deep';

function Content() {
  const deep = useDeep();
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );
  useEffect(() => {
    defineCustomElements(window);
    self["ActionSheet"] = ActionSheet;
    self["ActionSheetButtonStyle"] = ActionSheetButtonStyle;
  }, []);


  // useNotNotifiedLinksHandling({
  //   deep,
  //   deviceLinkId,
  //   query: {
  //     type: { in: { string: { value: { _eq: "ActionSheet" } } } }
  //   },
  //   callback: async ({ notNotifiedLinks }) => {     
  //     for (const actionSheetLink of notNotifiedLinks) {
  //       const actionSheetOptions = await getActionSheetOptionsFromDeep({ deep, actionSheetLinkId: actionSheetLink.id });
  //       await ActionSheet.showActions(actionSheetOptions);
  //     }
  //     const { data: notifyLinks } = await deep.select({
  //       type: { in: { string: { value: { _eq: "Notify" } } } },
  //       from_id: {
  //         _in: notNotifiedLinks.map(link => link.id),
  //       },
  //       _not: {
  //         out: { type: { in: { string: { value: { _eq: "Notified" } } } } }
  //       }
  //     })
  //     await insertNotifiedLinks({ deep, deviceLinkId, notifyLinkIds: notifyLinks.map(link => link.id) });
  //   },
  // });

  const [actionSheetTitle, setActionSheetTitle] = useState<string | undefined>();
  const [actionSheetMessage, setActionSheetMessage] = useState<string | undefined>();
  const [actionSheetOptions, setActionSheetOptions] = useState<ActionSheetButton[] | undefined>();
  // const [actionSheetOptionInputsCount, dispatchActionSheetOptionInputsCount] = useReducer((state, action) => {
  //   if (action.type === "++") {
  //     return ++state;
  //   } else {
  //     return --state;
  //   }
  // }, 0);

  return (
    <Stack>
      <Input defaultValue={"Action Sheet Title"} onChange={async (event) => {
        setActionSheetTitle(event.target.value)
      }}></Input>
      <Input defaultValue={"Action Sheet Message"} onChange={async (event) => {
        setActionSheetMessage(event.target.value)
      }}></Input>
      <Button onClick={async () => {
        // dispatchActionSheetOptionInputsCount("++")
        setActionSheetOptions((oldActionSheets) => {
          const newActionSheet = { title: "" };
          const newActionSheets = oldActionSheets ? [...oldActionSheets, newActionSheet] : [newActionSheet];
          return newActionSheets
        })
      }}>++ Action Sheet Option</Button>
      <Button isDisabled={!actionSheetOptions} onClick={async () => {
        // dispatchActionSheetOptionInputsCount("--")
        setActionSheetOptions((oldActionSheets) => {
          const newActionSheets = [...oldActionSheets]
          newActionSheets.pop();
          return newActionSheets
        })
      }}>-- Action Sheet Option</Button>
      {
        actionSheetOptions && actionSheetOptions.map((actionSheetOption, i) => (
          <Box key={i}>
            <Input defaultValue={"Action Sheet Option Title" + i} onChange={async (event) => {
              setActionSheetOptions((oldActionSheets) => {
                const newActionSheets = [...oldActionSheets];
                const newActionSheet = actionSheetOption;
                newActionSheet.title = event.target.value;
                newActionSheets[i] = newActionSheet;
                return newActionSheets;
              })
            }}></Input>
            <RadioGroup defaultValue={ActionSheetButtonStyle.Default} onChange={async (value) => {
              setActionSheetOptions((oldActionSheets) => {
                const newActionSheets = [...oldActionSheets];
                const newActionSheet = actionSheetOption;
                newActionSheet.style = ActionSheetButtonStyle[value];
                newActionSheets[i] = newActionSheet;
                return newActionSheets;
              })
            }}>
              <Radio value={ActionSheetButtonStyle.Cancel} title={ActionSheetButtonStyle.Cancel}>{ActionSheetButtonStyle.Cancel}</Radio>
              <Radio value={ActionSheetButtonStyle.Default} title={ActionSheetButtonStyle.Default}>{ActionSheetButtonStyle.Default}</Radio>
              <Radio value={ActionSheetButtonStyle.Destructive} title={ActionSheetButtonStyle.Destructive}>{ActionSheetButtonStyle.Destructive}</Radio>
            </RadioGroup>


          </Box>
        ))
      }
      <Button onClick={async () => {
        await insertActionSheetToDeep({
          deep, containInLinkId: deep.linkId, actionSheetData: {
            title: actionSheetTitle,
            message: actionSheetMessage,
            options: actionSheetOptions
          }
        })
      }}>Insert Action Sheet</Button>
    </Stack>
  );
}

export default function ActionSheetPage() {
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
