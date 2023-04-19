import React, { useEffect, useState } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
} from '@deep-foundation/deeplinks/imports/client';

import { Button, ChakraProvider, Code, Input, Stack, Text } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import { Dialog } from '@capacitor/dialog';
import { insertAlertToDeep } from '../imports/dialog/insert-alert-to-deep';
import { insertPromptToDeep } from '../imports/dialog/insert-prompt-to-deep';
import { insertConfirmToDeep } from '../imports/dialog/insert-confirm-to-deep';
import { useDialogSubscription } from '../imports/dialog/use-dialog-subscription';
import { WithDialogSubscription } from '../components/dialog/with-dialog-subscription';

function Content() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore('deviceLinkId', undefined);

  useEffect(() => {
    self["Dialog"] = Dialog;
  }, [])

  const [alertTitle, setAlertTitle] = useState<string>("AlertTitle");
  const [alertMessage, setAlertMessage] = useState<string>("AlertMessage");
  const [alertButtonTitle, setAlertButtonTitle] = useState<string>("AlertButtonTitle");

  const [promptTitle, setPromptTitle] = useState<string>("PromptTitle");
  const [promptMessage, setPromptMessage] = useState<string>("PromptrMessage");
  const [promptOkButtonTitle, setPromptOkButtonTitle] = useState<string>("PromptOkButtonTitle");
  const [promptCancelButtonTitle, setPromptCancelButtonTitle] = useState<string>("PromptCancelButtonTitle");
  const [promptInputPlaceholder, setPromptInputPlaceholder] = useState<string>("PromptInputPlaceholder");
  const [promptInputText, setPromptInputText] = useState<string>("PromptInputText");

  const [confirmTitle, setConfirmTitle] = useState<string>("ConfirmTitle");
  const [confirmMessage, setConfirmMessage] = useState<string>("ConfirmMessage");
  const [confirmOkButtonTitle, setConfirmOkButtonTitle] = useState<string>("ConfirmOkButtonTitle");
  const [confirmCancelButtonTitle, setConfirmCancelButtonTitle] = useState<string>("ConfirmCancelButtonTitle");

  return (
    <Stack>
      <Text>Device package</Text>
      {
        Boolean(deviceLinkId) && 
        <WithDialogSubscription deep={deep} deviceLinkId={deviceLinkId} />
      }
      <Input value={alertTitle} placeholder='Alert Title' onChange={(event) => {
        setAlertTitle(event.target.value);
      }} />
      <Input value={alertMessage} placeholder='Alert Message' onChange={(event) => {
        setAlertMessage(event.target.value);
      }} />
      <Input value={alertButtonTitle} placeholder='Alert Button Title' onChange={(event) => {
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
      <Input value={promptTitle} placeholder='Prompt Title' onChange={(event) => {
        setPromptTitle(event.target.value);
      }} />
      <Input value={promptMessage} placeholder='Prompt Message' onChange={(event) => {
        setPromptMessage(event.target.value);
      }} />
      <Input value={promptOkButtonTitle} placeholder='Prompt Ok Button Title' onChange={(event) => {
        setPromptOkButtonTitle(event.target.value);
      }} />
      <Input value={promptCancelButtonTitle} placeholder='Prompt Cancel Button Title' onChange={(event) => {
        setPromptCancelButtonTitle(event.target.value);
      }} />
      <Input value={promptInputPlaceholder} placeholder='Prompt Input Placeholder' onChange={(event) => {
        setPromptInputPlaceholder(event.target.value);
      }} />
      <Input value={promptInputText} placeholder='Prompt Input Text' onChange={(event) => {
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
      <Input value={confirmTitle} placeholder='Confirm Title' onChange={(event) => {
        setConfirmTitle(event.target.value);
      }} />
      <Input value={confirmMessage} placeholder='Confirm Message' onChange={(event) => {
        setConfirmMessage(event.target.value);
      }} />
      <Input value={confirmOkButtonTitle} placeholder='Confirm Ok Button Title' onChange={(event) => {
        setConfirmOkButtonTitle(event.target.value);
      }} />
      <Input value={confirmCancelButtonTitle} placeholder='Confirm Cancel Button Title' onChange={(event) => {
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
      <Text >
        Insert notify link from dialog to device link. You must get dialog showed on this page and then result must be saved in deep (Note that Alert does not have result)
      </Text>
      <Code display={"block"} whiteSpace={"pre"}>
        {
          `
await deep.insert({
    type_id: await deep.id("@deep-foundation/dialog", "Notify"),
    from_id: dialogLinkId, // Alert/Prompt/Confirm link id
    to_id: deviceLinkId, 
    in: {data: {type_id: await deep.id("@deep-foundation/core", "Contain"), from_id: deep.linkId}}
})
  `
        }
      </Code>
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
