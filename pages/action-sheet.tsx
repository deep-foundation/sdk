import React, { useEffect, useState } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
} from '@deep-foundation/deeplinks/imports/client';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  ChakraProvider,
  Code,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import {
  ActionSheet,
  ActionSheetButton,
  ActionSheetButtonStyle,
  ShowActionsOptions,
} from '@capacitor/action-sheet';
import { insertActionSheetToDeep } from '../imports/action-sheet/insert-action-sheet-to-deep';
import { ACTION_SHEET_PACKAGE_NAME } from '../imports/action-sheet/package-name';
import { useActionSheetSubscription } from '../imports/action-sheet/use-action-sheet-subscription';
import { WithActionSheetSubscription } from '../components/action-sheet/with-action-sheet-subscription';
import GenerateSchema from 'generate-schema';
import validator from '@rjsf/validator-ajv8';
import { RJSFSchema } from '@rjsf/utils';
import Form from '@rjsf/chakra-ui';
const schema: RJSFSchema = require('../imports/action-sheet/schema.json');

function Content() {
  const deep = useDeep();
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );
  useEffect(() => {
    defineCustomElements(window);
    self['ActionSheet'] = ActionSheet;
    self['ActionSheetButtonStyle'] = ActionSheetButtonStyle;
  }, []);

  // useEffect(() => {
  //   new Promise(async () => {
  //     deep.minilinks.apply([
  //       await deep.id("@deep-foundation/core", "Contain"),
  //       await deep.id(PACKAGE_NAME, "ActionSheet"),
  //       await deep.id(PACKAGE_NAME, "ActionSheetTitle"),
  //       await deep.id(PACKAGE_NAME, "ActionSheetMessage"),
  //       await deep.id(PACKAGE_NAME, "ActionSheetOption"),
  //       await deep.id(PACKAGE_NAME, "ActionSheetResultIndex"),
  //       await deep.id(PACKAGE_NAME, "Notify"),
  //       await deep.id(PACKAGE_NAME, "Notified"),
  //     ])
  //   })
  // }, []);

  // const [actionSheetToInsert, setActionSheetToInsert] = useState<string>(
  //   JSON.stringify(defaultActionSheet, null, 2)
  // );

  // const [actionSheetTitle, setActionSheetTitle] = useState<string | undefined>("Title");
  // const [actionSheetMessage, setActionSheetMessage] = useState<string | undefined>("Message");
  // const [actionSheetOptions, setActionSheetOptions] = useState<ActionSheetButton[] | undefined>([defaultOption, defaultOption, defaultOption]);
  // const [actionSheetOptionInputsCount, dispatchActionSheetOptionInputsCount] = useReducer((state, action) => {
  //   if (action.type === "++") {
  //     return ++state;
  //   } else {
  //     return --state;
  //   }
  // }, 0);

  const [isInsertActionSheetModalEnabled, setIsInsertActionSheetModalOpen] =
    useState(false);

  const insertActionSheetModal = (
    <Modal
      isOpen={isInsertActionSheetModalEnabled}
      onClose={() => setIsInsertActionSheetModalOpen(false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Insert Action Sheet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Card>
            <CardBody>
              <Form
                schema={schema}
                validator={validator}
                onSubmit={(data) => {
                  console.log('changed', data);
                }}
                onError={(data) => {
                  console.log('changed', data);
                }}
              />
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => setIsInsertActionSheetModalOpen(false)}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <Stack>
      {Boolean(deviceLinkId) && (
        <WithActionSheetSubscription deep={deep} deviceLinkId={deviceLinkId} />
      )}
      <Button
        onClick={async () => {
          setIsInsertActionSheetModalOpen(true);
        }}
      >
        Insert Action Sheet
      </Button>
      {insertActionSheetModal}

      <Text>
        Insert ActionSheet to Device. You should see action-sheet on your page
        after that and result will be saved to deep.
      </Text>

      <Text>
        Insert Notify link from ActionSheet to Device. You should see
        action-sheet on your page after that and result will be saved to deep.
      </Text>
      <Code display={'block'} whiteSpace={'pre'}>
        {`await deep.insert({
    type_id: await deep.id("${ACTION_SHEET_PACKAGE_NAME}", "Notify"),
    from_id: actionSheetLinkId, 
    to_id: deviceLinkId, 
    in: {data: {type_id: await deep.id("@deep-foundation/core", "Contain"), from_id: deep.linkId}}
})`}
      </Code>
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
