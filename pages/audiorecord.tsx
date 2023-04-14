import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import initializePackage, { PACKAGE_NAME } from '../imports/audiorecord/install-package';
import checkDeviceSupport from '../imports/audiorecord/check-device-support';
import checkAudioRecPermission from '../imports/audiorecord/check-permission';
import getAudioRecPermission from '../imports/audiorecord/get-permission';
import getRecordingStatus from '../imports/audiorecord/get-recording-status';
import startAudioRec from '../imports/audiorecord/strart-recording';
import stopAudioRec from '../imports/audiorecord/stop-recording';
import uploadRecords from '../imports/audiorecord/upload-records';
import installPackage from '../imports/audiorecord/install-package';

export const delay = (time) => new Promise(res => setTimeout(() => res(null), time));

function Page() {
  const deep = useDeep();
  const [recording, setRecording] = useState(false);
  const [sounds, setSounds] = useLocalStore("Sounds", []);
  const [records, setRecords] = useState([]);
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  useEffect(() => {
    const useRecords = async () => {
      await uploadRecords(deep, deviceLinkId, sounds);
      setSounds([]);
    }
    if (sounds.length > 0) useRecords();
  }, [sounds])

  useEffect(() => {
    let loop = true;
    const startRecordingCycle = async (duration) => {
      for (; recording && loop;) {
        await startAudioRec(deep);
        const startTime = new Date().toLocaleDateString();
        await delay(duration);
        const record = await stopAudioRec(deep);
        const endTime = new Date().toLocaleDateString();
        console.log({ record });
        setSounds([...sounds, { record, startTime, endTime }]);
      }
    }
    if (recording) startRecordingCycle(5000);
    return function stopCycle() { loop = false };
  }, [recording])

  const startRecording = async (duration) => {
    await startAudioRec(deep);
    const startTime = new Date().toLocaleString();
    await delay(duration);
    const record = await stopAudioRec(deep);
    const endTime = new Date().toLocaleString();
    console.log({ record });
    setSounds([...sounds, { record, startTime, endTime }]);
  }

  const fetchRecords = async () => {
    const recordTypelinkId = await deep.id(PACKAGE_NAME, "Record");
    const soundTypelinkId = await deep.id(PACKAGE_NAME, "Sound");
    const mimetypeTypelinkId = await deep.id(PACKAGE_NAME, "MIME/type");
    const { data: recordLinks } = await deep.select({
      type_id: recordTypelinkId
    });

    let records = [];

    for (let recordLink of recordLinks) {
      const { data } = await deep.select({
        up: {
          parent: {
            id: recordLink.id
          },
          link: {
            type_id: {
              _in:
                [
                  soundTypelinkId,
                  mimetypeTypelinkId
                ]
            }
          }
        },
      })
      const soundLink = data.filter((link) => link.type_id === soundTypelinkId)
      const mimetypeLink = data.filter((link) => link.type_id === mimetypeTypelinkId)
      records = [...records, { sound: soundLink[0].value.value, mimetype: mimetypeLink[0].value.value }]
    }
    setRecords(records);
  }

  const createContainer = async (deep) => {
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const audioRecordsTypeLinkId = await deep.id(PACKAGE_NAME, "AudioRecords");
    await deep.insert({
      type_id: audioRecordsTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: deviceLinkId,
          string: { data: { value: "AudioRecords" } },
        }
      }
    })
  }

  return <Stack>
    <Text suppressHydrationWarning>Device link id: {deviceLinkId ?? " "}</Text>
    <Button onClick={async () => await installPackage(deviceLinkId)}>
      INSTALL PACKAGE
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
      setRecording(true); console.log(recording)
    }}>
      START RECORDING CYCLE
    </Button>
    <Button onClick={() => {
      setRecording(false);
    }}>
      STOP RECORDING CYCLE
    </Button>
    <Button onClick={async () => await startRecording(5000)}>
      RECORD ONE CHUNK
    </Button>
    <Button onClick={async () => await fetchRecords()}>
      LOAD RECORDS
    </Button>
    {records?.map((r) => <audio key={Math.random().toString()} controls src={`data:${r.mimetype};base64,${r.sound}`} />)}
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