import React, { useEffect, useState } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import {
  DeepClient,
  DeepProvider,
  useDeep,
} from '@deep-foundation/deeplinks/imports/client';

import {
  Box,
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
  useDisclosure,
} from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import {
  ActionSheet,
  ActionSheetButton,
  ActionSheetButtonStyle,
  ShowActionsOptions,
} from '@capacitor/action-sheet';
import { insertActionSheet } from '../imports/action-sheet/insert-action-sheet';
import { ACTION_SHEET_PACKAGE_NAME } from '../imports/action-sheet/package-name';
import { useActionSheetSubscription } from '../imports/action-sheet/use-action-sheet-subscription';
import { WithActionSheetSubscription } from '../components/action-sheet/with-action-sheet-subscription';
import GenerateSchema from 'generate-schema';
import validator from '@rjsf/validator-ajv8';
import { RJSFSchema } from '@rjsf/utils';
import Form from '@rjsf/chakra-ui';
import _ from 'lodash';
const schema: RJSFSchema = require('../imports/action-sheet/schema.json');

function InsertActionSheetModal({deep, deviceLinkId} : {deep: DeepClient, deviceLinkId: number}){
  const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
        <Button onClick={onOpen}>Insert Action Sheet</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent maxWidth={'fit-content'}>
            <ModalHeader>Insert Action Sheet</ModalHeader>
            <ModalCloseButton />
            <ModalBody >
            <Form
                schema={schema}
                validator={validator}
                onSubmit={async (arg) => {
                  console.log('changed', arg);
                  await insertActionSheet({
                    deep,
                    containerLinkId: deviceLinkId,
                    actionSheetData: arg.formData
                  })
                }}
              />
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

function Content() {
  const deep = useDeep();
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );
  useEffect(() => {
    defineCustomElements(window);
    self['deep'] = deep;
    self['ActionSheet'] = ActionSheet;
    self['ActionSheetButtonStyle'] = ActionSheetButtonStyle;
  }, []);

  const [isInsertActionSheetModalEnabled, setIsInsertActionSheetModalOpen] =
    useState(false);

  return (
    <Stack>
      {Boolean(deviceLinkId) && (
        <WithActionSheetSubscription deep={deep} deviceLinkId={deviceLinkId} />
      )}
      <InsertActionSheetModal deep={deep} deviceLinkId={deviceLinkId} />

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
