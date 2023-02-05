import React, { useEffect, useState } from 'react';
import {
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
} from '@deep-foundation/deeplinks/imports/client';

import { Box, Button, ChakraProvider, Input, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { ActionSheet, ActionSheetButton, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { insertActionSheetToDeep } from '../imports/action-sheet/insert-action-sheet-to-deep';

const defaultOption: ActionSheetButton = { title: "Action Sheet Option Title",  style: ActionSheetButtonStyle.Default}

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

  const [actionSheetTitle, setActionSheetTitle] = useState<string | undefined>("Title");
  const [actionSheetMessage, setActionSheetMessage] = useState<string | undefined>("Message");
  const [actionSheetOptions, setActionSheetOptions] = useState<ActionSheetButton[] | undefined>([defaultOption, defaultOption, defaultOption]);
  // const [actionSheetOptionInputsCount, dispatchActionSheetOptionInputsCount] = useReducer((state, action) => {
  //   if (action.type === "++") {
  //     return ++state;
  //   } else {
  //     return --state;
  //   }
  // }, 0);

  return (
    <Stack>
      <Input value={actionSheetTitle} onChange={async (event) => {
        setActionSheetTitle(event.target.value)
      }}></Input>
      <Input value={actionSheetMessage} onChange={async (event) => {
        setActionSheetMessage(event.target.value)
      }}></Input>
      <Button onClick={async () => {
        // dispatchActionSheetOptionInputsCount("++")
        setActionSheetOptions((oldActionSheets) => {
          const newOptions = oldActionSheets ? [...oldActionSheets, defaultOption] : [defaultOption];
          return newOptions
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
            <Input value={actionSheetOption.title} onChange={async (event) => {
              setActionSheetOptions((oldActionSheets) => {
                const newActionSheets = [...oldActionSheets];
                const newActionSheet = actionSheetOption;
                newActionSheet.title = event.target.value;
                newActionSheets[i] = newActionSheet;
                return newActionSheets;
              })
            }}></Input>
            <RadioGroup value={actionSheetOption.style} onChange={async (value) => {
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
