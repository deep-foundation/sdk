import React, { useCallback } from 'react';
import { Network } from "@capacitor/network"
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import initializePackage, { PACKAGE_NAME } from '../imports/audiorec/initialize-package';
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
  const [audioChunks, setAudioChunks] = useLocalStore("AudioChunks", []);

  const handleRecordingStop = async (deep) => {
    const record = await stopAudioRec(deep);
    if (record) {
      const customContainerTypeLinkId = await deep.id(deep.linkId, "AudioRec");
      const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
      const audioChunkTypeLinkId = await deep.id(PACKAGE_NAME, "AudioChunk");

      setAudioChunks([...audioChunks, record]);

      const { data: [{ id: audioChunkLinkId }] } = await deep.insert(audioChunks.map((audioChunk) => ({
        type_id: audioChunkTypeLinkId,
        string: { data: { value: audioChunk["recordDataBase64"] } },
        in: {
          data: [{
            type_id: containTypeLinkId,
            from_id: customContainerTypeLinkId,
          }]
        }
      })));
    }
    setAudioChunks([]);
  }


  return <Stack>
    <Button onClick={async () => {
      await deep.guest();
      await deep.login({ linkId: await deep.id("deep", "admin") });
    }}>
      <Text>Login as admin</Text>
    </Button>
    <Button onClick={async () => await initializePackage(deep)}>
      <Text>Initialize package</Text>
    </Button>
    <Button onClick={async () => await checkDeviceSupport(deep)}>
      <Text>checkDeviceSupport</Text>
    </Button>
    <Button onClick={async () => await checkAudioRecPermission(deep)}>
      <Text>checkAudioRecPermission</Text>
    </Button>
    <Button onClick={async () => await getAudioRecPermission(deep)}>
      <Text>getAudioRecPermission</Text>
    </Button>
    <Button onClick={async () => await getRecordingStatus(deep)}>
      <Text>getRecordingStatus</Text>
    </Button>
    <Button onClick={async () => await startAudioRec(deep)}>
      <Text>startAudioRec</Text>
    </Button>
    <Button onClick={async () => await handleRecordingStop(deep)}>
      <Text>stopAudioRec</Text>
    </Button>
    <Button onClick={async () => await pauseAudioRec(deep)}>
      <Text>pauseAudioRec</Text>
    </Button>
    <Button onClick={async () => await resumeAudioRec(deep)}>
      <Text>resumeAudioRec</Text>
    </Button>
  </Stack>
  { audioChunks?.map((r) => <audio id={Math.random().toString()} controls src={`data:${r["mimeType"]};base64,${r["recordDataBase64"]}`} />) }
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