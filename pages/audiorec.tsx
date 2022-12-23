import React, { useCallback } from 'react';
import { Network } from "@capacitor/network"
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep, useDeepSubscription, DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';

import { PACKAGE_NAME } from "../imports/audiorec/package-name";
import initializePackage from '../imports/audiorec/initialize-package';
import checkDeviceSupport from '../imports/audiorec/check-device-support';
import checkAudioRecPermission from '../imports/audiorec/check-permission';
import getAudioRecPermission from '../imports/audiorec/get-permission';
import getRecordingStatus from '../imports/audiorec/get-recording-status';
import startAudioRec from '../imports/audiorec/strart-recording';
import stopAudioRec from '../imports/audiorec/stop-recording';
import pauseAudioRec from '../imports/audiorec/pause-recording';
import resumeAudioRec from '../imports/audiorec/resume-recording';

function Page() {
  const deep = useDeep();
  const [ audioChunks, setAudioChunks ] = useLocalStore("AudioChunks", []);

  const handleRecordingStop = async () => {
     const record  = await stopAudioRec();
     setAudioChunks([...audioChunks, record])
  }


  return <Stack>
    <Button onClick={async () => {
      await deep.guest(); 
      await deep.login({ linkId: await deep.id("deep", "admin") });
    }}>
     <Text>Login as admin</Text> 
    </Button>
    <Button onClick={async () => { await initializePackage(deep); }}>
      <Text>Initialize package</Text>
    </Button>
    <Button onClick={async () => await checkDeviceSupport()}>
      <Text>checkDeviceSupport</Text>
    </Button>
    <Button onClick={async () => await checkAudioRecPermission()}>
      <Text>checkAudioRecPermission</Text>
    </Button>
    <Button onClick={async () => await getAudioRecPermission()}>
      <Text>getAudioRecPermission</Text>
    </Button>
    <Button onClick={async () => await getRecordingStatus()}>
      <Text>getRecordingStatus</Text>
    </Button>
    <Button onClick={async () => await startAudioRec()}>
      <Text>startAudioRec</Text>
    </Button>
    <Button onClick={async () => await handleRecordingStop()}>
      <Text>stopAudioRec</Text>
    </Button>
    <Button onClick={async () => await pauseAudioRec()}>
      <Text>pauseAudioRec</Text>
    </Button>
    <Button onClick={async () => await resumeAudioRec()}>
      <Text>resumeAudioRec</Text>
    </Button>
  </Stack>
  {audioChunks?.map((r) => <audio id={Math.random().toString()} controls src={`data:${r["mimeType"]};base64,${r["recordDataBase64"]}`} />)}
}

export default function AudioRec() {
  return (
    <ChakraProvider>
      <Provider>
        <DeepProvider>
          <Page />
        </DeepProvider>
      </Provider>
    </ChakraProvider>
  );
}