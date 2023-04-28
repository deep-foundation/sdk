import React, { useEffect, useState } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import {
  DeepClient,
  DeepProvider,
  useDeep,
} from '@deep-foundation/deeplinks/imports/client';

import {
  Button,
  ChakraProvider,
  Code,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import { Dialog } from '@capacitor/dialog';
import { insertAlert } from '../imports/dialog/insert-alert-to-deep';
import { insertPrompt } from '../imports/dialog/insert-prompt-to-deep';
import { insertConfirm } from '../imports/dialog/insert-confirm-to-deep';
import { useDialogSubscription } from '../imports/dialog/use-dialog-subscription';
import { WithDialogSubscription } from '../components/dialog/with-dialog-subscription';
import { CapacitorStoreKeys } from '../imports/capacitor-store-keys';
import Form from '@rjsf/chakra-ui';
import { insertActionSheet } from '../imports/action-sheet/insert-action-sheet';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
const alertSchema: RJSFSchema = require('../imports/dialog/alert-schema.json');
const promptSchema: RJSFSchema = require('../imports/dialog/prompt-schema.json');
const confirmSchema: RJSFSchema = require('../imports/dialog/confirm-schema.json');

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

function Content() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore(
    CapacitorStoreKeys[CapacitorStoreKeys.DeviceLinkId],
    undefined
  );

  useEffect(() => {
    self['Dialog'] = Dialog;
  }, []);

  

  return (
    <Stack>
      {Boolean(deviceLinkId) && (
        <WithDialogSubscription deep={deep} deviceLinkId={deviceLinkId} />
      )}
      <InsertAlertModal deep={deep} deviceLinkId={deviceLinkId} />
      <InsertPromptModal deep={deep} deviceLinkId={deviceLinkId} />
      <InsertConfirmModal deep={deep} deviceLinkId={deviceLinkId} />
      <Text>
        Insert notify link from dialog to device link. You must get dialog
        showed on this page and then result must be saved in deep (Note that
        Alert does not have result)
      </Text>
      <Code display={'block'} whiteSpace={'pre'}>
        {`
await deep.insert({
    type_id: await deep.id("@deep-foundation/dialog", "Notify"),
    from_id: dialogLinkId, // Alert/Prompt/Confirm link id
    to_id: deviceLinkId, 
    in: {data: {type_id: await deep.id("@deep-foundation/core", "Contain"), from_id: deep.linkId}}
})
  `}
      </Code>
    </Stack>
  );
}

function InsertAlertModal({
  deep,
  deviceLinkId,
}: {
  deep: DeepClient;
  deviceLinkId: number;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Insert Alert</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth={'fit-content'}>
          <ModalHeader>Insert Alert</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form
              schema={alertSchema}
              validator={validator}
              onSubmit={async (arg) => {
                console.log('changed', arg);
                await insertAlert({
                  deep,
                  containerLinkId: deviceLinkId,
                  alertData: arg.formData,
                });
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function InsertPromptModal({
  deep,
  deviceLinkId,
}: {
  deep: DeepClient;
  deviceLinkId: number;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Insert Prompt</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth={'fit-content'}>
          <ModalHeader>Insert Prompt</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form
              schema={alertSchema}
              validator={validator}
              onSubmit={async (arg) => {
                console.log('changed', arg);
                await insertPrompt({
                  deep,
                  containerLinkId: deviceLinkId,
                  promptData: arg.formData,
                });
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function InsertConfirmModal({
  deep,
  deviceLinkId,
}: {
  deep: DeepClient;
  deviceLinkId: number;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Insert Confirm</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth={'fit-content'}>
          <ModalHeader>Insert Confirm</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form
              schema={alertSchema}
              validator={validator}
              onSubmit={async (arg) => {
                console.log('changed', arg);
                await insertConfirm({
                  deep,
                  containerLinkId: deviceLinkId,
                  confirmData: arg.formData,
                });
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}