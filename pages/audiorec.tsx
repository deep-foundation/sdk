import React, { useState, useEffect, useCallback } from 'react';
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

export const delay = (time) => new Promise(res => setTimeout(() => res(null), time));

function Page() {
  const deep = useDeep();
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useLocalStore("AudioChunks", []);
  console.log("component top: " + recording);
  

  useEffect(() => {
    const uploadAudioChunks = async (audioChunks) => {
      console.log("Uploading");
      const customContainerTypeLinkId = await deep.id(deep.linkId, "AudioRec");
      const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
      const audioChunkTypeLinkId = await deep.id(PACKAGE_NAME, "AudioChunk");
      const recordTypeLinkId = await deep.id(PACKAGE_NAME, "Record");
      const durationTypeLinkId = await deep.id(PACKAGE_NAME, "Duration");
      const startTimeTypeLinkId = await deep.id(PACKAGE_NAME, "StartTime");
      const endTimeTypeLinkId = await deep.id(PACKAGE_NAME, "EndTime");
      const formatTypeLinkId = await deep.id(PACKAGE_NAME, "Format");
      await deep.insert(audioChunks.map((audioChunk) => ({
        type_id: recordTypeLinkId,
        in: {
          data: [{
            type_id: containTypeLinkId,
            from_id: customContainerTypeLinkId,
          }]
        },
        out: {
          data: [
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: audioChunkTypeLinkId,
                  string: { data: { value: audioChunk.record["recordDataBase64"] } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: durationTypeLinkId,
                  string: { data: { value: audioChunk.record["msDuration"].toString() } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: startTimeTypeLinkId,
                  string: { data: { value: audioChunk.startTime } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: endTimeTypeLinkId,
                  string: { data: { value: audioChunk.endTime } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: formatTypeLinkId,
                  string: { data: { value: audioChunk.record["mimeType"] } },
                }
              }
            }]
        }
      })));
      setAudioChunks([]);
    }
    if (audioChunks.length > 0) uploadAudioChunks(audioChunks);
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

  return <Stack>
    <Button onClick={async () => {
      await deep.guest();
      await deep.login({ linkId: await deep.id("deep", "admin") });
    }}>
      Login as admin
    </Button>
    <Button onClick={async () => await initializePackage(deep)}>
      Initialize package
    </Button>
    <Button onClick={async () => await checkDeviceSupport(deep)}>
      checkDeviceSupport
    </Button>
    <Button onClick={async () => await checkAudioRecPermission(deep)}>
      checkAudioRecPermission
    </Button>
    <Button onClick={async () => await getAudioRecPermission(deep)}>
      getAudioRecPermission
    </Button>
    <Button onClick={async () => await getRecordingStatus(deep)}>
      getRecordingStatus
    </Button>
    <Button onClick={() => {
      setRecording(true); console.log(recording)}}>
      Start Recording Cycle
    </Button>
    <Button onClick={() => {
      setRecording(false);  console.log("inside Stop onClick: " +recording);
    }}>
      Stop Recording Cycle
    </Button>
    <Button onClick={async () => await startRecording(5000)}>
      Record One Chunk
    </Button>
    <Button onClick={async () => await pauseAudioRec(deep)}>
      Pause
    </Button>
    <Button onClick={async () => await resumeAudioRec(deep)}>
      Resume
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