import React, { useState, useEffect, useRef } from 'react';
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Button, Card, CardBody, CardHeader, Heading, Stack, Text } from '@chakra-ui/react';
import { VoiceRecorder as CapacitorVoiceRecorder } from 'capacitor-voice-recorder';
import { useRecordingStatus } from '../hooks/use-recording-status';
import { useRecordingCycle } from '../hooks/use-recording-cycle';
import { useContainer } from '../hooks/use-container';
import { startRecording } from '../strart-recording';
import { stopRecording } from '../stop-recording';
import { downloadRecords } from '../download-records';

export function VoiceRecorder({ deep }: { deep: DeepClient }) {
  const [recording, setRecording] = useState(false);
  const [records, setRecords] = useState<any[]>([]);

  const [arePermissionsGranted, setArePermissionsGranted] = useState<boolean | undefined>(undefined)
  const [canDeviceRecord, setCanDeviceRecord] = useState<boolean | undefined>(undefined)


  useEffect(() => {
    new Promise(async () => {
      const { value: canDeviceRecord } = await CapacitorVoiceRecorder.canDeviceVoiceRecord();
      setCanDeviceRecord(canDeviceRecord);
    })
  }, [])

  const containerLinkId = useContainer(deep);
  const audioRecordingStatus = useRecordingStatus({});
  const sounds = useRecordingCycle({ deep, recording, containerLinkId, duration: 5000 });

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
          const { value: arePermissionsGranted } = await CapacitorVoiceRecorder.requestAudioRecordingPermission();
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
    <Button onClick={async () => startTime.current = await startRecording()}>
      START RECORDING
    </Button>
    <Button onClick={async () => await stopRecording({ deep, containerLinkId, startTime: startTime.current })}>
      STOP RECORDING
    </Button>
    <Button onClick={() => setRecording(true)}>
      START RECORDING CYCLE
    </Button>
    <Button onClick={() => setRecording(false)}>
      STOP RECORDING CYCLE
    </Button>
    <Button onClick={async () => setRecords(await downloadRecords(deep))}>
      DOWNLOAD RECORDS
    </Button>
    {records?.map((r) => <audio key={Math.random().toString()} controls src={`data:${r.mimetype};base64,${r.sound}`} />)}
  </Stack>
}
