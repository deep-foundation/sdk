import React, { useState, useEffect, useRef } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, Card, CardBody, CardHeader, ChakraProvider, Heading, Stack, Text } from '@chakra-ui/react';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { useRecordingStatus } from '../imports/capacitor-voice-recorder/use-recording-status';
import useRecordingCycle from '../imports/capacitor-voice-recorder/use-recording-cycle';
import startRecording from '../imports/capacitor-voice-recorder/strart-recording';
import stopRecording from '../imports/capacitor-voice-recorder/stop-recording';
import createContainer from '../imports/capacitor-voice-recorder/create-container';
import loadRecords from '../imports/capacitor-voice-recorder/load-records';

export const delay = (time) => new Promise(res => setTimeout(() => res(null), time));

function Page() {
  const deep = useDeep();
  const [recording, setRecording] = useState(false);
  const [records, setRecords] = useState([]);
  const [containerLinkId, setContainerLinkId] = useLocalStore(
    'containerLinkId',
    undefined
  );

  useEffect(() => {
    if (!containerLinkId) {
      const initializeContainerLink = async () => {
        setContainerLinkId(await createContainer(deep));
      };
      initializeContainerLink();
    }
  }, [])

  const [arePermissionsGranted, setArePermissionsGranted] = useState<boolean | undefined>(undefined)
  const [canDeviceRecord, setCanDeviceRecord] = useState<boolean | undefined>(undefined)


  useEffect(() => {
    new Promise(async () => {
      const { value: canDeviceRecord } = await VoiceRecorder.canDeviceVoiceRecord();
      setCanDeviceRecord(canDeviceRecord);
    })
  }, [])

  const audioRecordingStatus = useRecordingStatus({});
  const sounds = useRecordingCycle({ deep, recording, duration: 5000 });

  const startTime = useRef('');

  return <Stack>
    <Card>
      <CardHeader>
        <Heading>
          Ability to record
        </Heading>
      </CardHeader>
      <CardBody>
        <Text>{`Device is ${!canDeviceRecord ? 'not' : ""} able to record.`}</Text>
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <Heading>
          Permissions
        </Heading>
      </CardHeader>
      <CardBody>
        <Text>{`Permissions are ${!arePermissionsGranted ? 'not' : ""} granted.`}</Text>
        <Button onClick={async () => {
          const { value: arePermissionsGranted } = await VoiceRecorder.requestAudioRecordingPermission();
          setArePermissionsGranted(arePermissionsGranted);
        }}>
          Request permissions
        </Button>
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <Heading>
          {`Audio Recording Status: ${audioRecordingStatus}`}
        </Heading>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <Heading>
          {`Container Link Id: ${containerLinkId}`}
        </Heading>
      </CardHeader>
    </Card>
    <Button onClick={async () => setContainerLinkId(await createContainer(deep))}>
      CREATE NEW CONTAINER
    </Button>
    <Button onClick={async () => startTime.current = await startRecording() }>
      START RECORDING
    </Button>
    <Button onClick={async () => await stopRecording({deep, containerLinkId, startTime: startTime.current})}>
      STOP RECORDING
    </Button>
    <Button onClick={() => setRecording(true)}>
      START RECORDING CYCLE
    </Button>
    <Button onClick={() => setRecording(false)}>
      STOP RECORDING CYCLE
    </Button>
    <Button onClick={async () => setRecords(await loadRecords(deep))}>
      DOWNLOAD RECORDS
    </Button>
    {records?.map((r) => <audio key={Math.random().toString()} controls src={`data:${r.mimetype};base64,${r.sound}`} />)}
  </Stack>
}

export default function AudioRecordPage() {
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