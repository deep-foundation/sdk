import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import initializePackage, { PACKAGE_NAME } from '../imports/audiorecord/initialize-package';
import checkDeviceSupport from '../imports/audiorecord/check-device-support';
import checkAudioRecPermission from '../imports/audiorecord/check-permission';
import getAudioRecPermission from '../imports/audiorecord/get-permission';
import getRecordingStatus from '../imports/audiorecord/get-recording-status';
import startAudioRec from '../imports/audiorecord/strart-recording';
import stopAudioRec from '../imports/audiorecord/stop-recording';
import uploadRecords from '../imports/audiorecord/upload-records';

export const delay = (time) => new Promise(res => setTimeout(() => res(null), time));

function Page() {
  const deep = useDeep();
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useLocalStore("AudioChunks", []);
  const [records, setRecords] = useState([]);
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  useEffect(() => {
    const useRecords = async () => {
      await uploadRecords(deep, deviceLinkId, audioChunks);
      setAudioChunks([]);
    }
    if (audioChunks.length > 0) useRecords();
  }, [audioChunks])

  useEffect(() => {
    let loop = true;
    const startRecordingCycle = async (duration) => {
      for (; recording && loop ;) {
        console.log("inside cycle loop: " + recording)
        await startAudioRec(deep);
        const startTime = new Date().toLocaleDateString();
        await delay(duration);
        const record = await stopAudioRec(deep);
        const endTime = new Date().toLocaleDateString();
        console.log({ record });
        setAudioChunks([...audioChunks, { record, startTime, endTime }]);
      }
    }
    if (recording) startRecordingCycle(5000);
    return function stopCycle() { loop = false };
  }, [recording])

  const startRecording = async (duration) => {
    await startAudioRec(deep);
    const startTime = new Date().toLocaleTimeString();
    await delay(duration);
    const record = await stopAudioRec(deep);
    const endTime = new Date().toLocaleTimeString();
    console.log({ record });
    setAudioChunks([...audioChunks, { record, startTime, endTime }]);
  }

  const fetchRecords = async () => {
    const audioChunkTypeLinkId = await deep.id(PACKAGE_NAME, "AudioChunk");
    const { data } = await deep.select({
      type_id: audioChunkTypeLinkId
    });
    console.log({data});
    setRecords(data);
  }

  const createContainer = async (deep) => {
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const audioRecordsTypeLinkId = await deep.id(PACKAGE_NAME, "AudioRecords");
    await deep.insert({ type_id: audioRecordsTypeLinkId,
      string: { data: { value: "Audio Records" } },
      in :{
        data : {
          type_id: containTypeLinkId,
          from_id: deviceLinkId
        }
      }
    })
  }

  return <Stack>
    <Button onClick={async () => await initializePackage(deep, deviceLinkId)}>
      INITIALIZE PACKAGE
    </Button>
    <Button onClick={async () => await createContainer(deep)}>
      CREATE NEW CONTAINER
    </Button>
    <Button onClick={async () => await checkDeviceSupport(deep, deviceLinkId)}>
      CHECK DEVICE SUPPORT
    </Button>
    <Button onClick={async () => await checkAudioRecPermission(deep, deviceLinkId)}>
      CHECK RECORDING PERMISSION
    </Button>
    <Button onClick={async () => await getAudioRecPermission(deep, deviceLinkId)}>
      GET RECORDING PERMISSION
    </Button>
    <Button onClick={async () => await getRecordingStatus(deep)}>
      GET RECORDING STATUS
    </Button>
    <Button onClick={() => {
      setRecording(true); console.log(recording)}}>
      START RECORDING CYCLE
    </Button>
    <Button onClick={() => {
      setRecording(false);  console.log("inside Stop onClick: " +recording);
    }}>
      STOP RECORDING CYCLE
    </Button>
    <Button onClick={async () => await startRecording(5000)}>
      RECORD ONE CHUNK
    </Button>
    <Button  onClick={async () => await fetchRecords()}>
     LOAD RECORDS
    </Button>
    { records?.map((r) => <audio key={Math.random().toString()} controls src={`data:audio/webm;base64,${r.value.value}`} />) }
  </Stack>
}

export default function Index() {
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