import { useMemo, useState, useEffect } from "react";
import { VoiceRecorder, VoiceRecorderPlugin, RecordingData, GenericResponse, CurrentRecordingStatus } from 'capacitor-voice-recorder';
import {
  DeepProvider,
  useDeep,
} from "@deep-foundation/deeplinks/imports/client";
import { Provider } from "../imports/provider";

function Content() {
  const [record, setRecord] = useState({})
  const deep = useDeep();

  const authUser = async () => {
    await deep.guest();
    
    const { linkId, token, error } = await deep.login({
      linkId: await deep.id("deep", 'admin')
    })
    console.log(linkId, token, error);
  };
  
  const isDeviceSupported = async () => {
    const { value }= await VoiceRecorder.canDeviceVoiceRecord();
    if (value) { console.log("can record on this device");
     return value;
    } else {console.log("cant record on this device")}
  }

  const askRecordingPermission = async () => {
    const canRecord = await isDeviceSupported();
    if (canRecord) {
      console.log("can record on this device")
      const { value } = await VoiceRecorder.hasAudioRecordingPermission();
      if (!value) {
        VoiceRecorder.requestAudioRecordingPermission().then((res) => console.log(res.value) )
      } else {console.log("permission already granted")}
    } else {console.log("cant record on this device")}
  }

  const startRec = async () => {
    await VoiceRecorder.startRecording();
  }

  const stopRec = async () => {
    const { value } = await VoiceRecorder.stopRecording();
    setRecord(value);
    console.log(record);
  }

  const playRec = () => {
    const audioRef = new Audio(`data:${record["mimeType"]};base64,${record["recordDataBase64"]}`).play();
    // console.log(audioRef)
    // audioRef.oncanplaythrough = () => audioRef.play()
    // audioRef.load()
  }

  const addLink = async (
    containName: string,
    value: string,
    from_id: number
  ) => {
    const new_list = await deep.insert({
      type_id: 1,
      in: {
        data: {
          type_id: 3,
          from_id: from_id, // 362
          string: { data: { value: containName } },
        },
      },
    });

    console.log(JSON.stringify(new_list));
  };

  return (
    <>
      <button style={{height:60, width:140, background:"grey" }} onClick={() => authUser()}>Auth User</button>
      <button style={{height:60, width:140, background:"grey" }} onClick={() => isDeviceSupported()}>Is Rec Allowed</button>
      <button style={{height:60, width:140, background:"grey" }} onClick={() => askRecordingPermission()}>Allow Rec</button>
      <button style={{height:60, width:140, background:"grey" }} onClick={() => startRec()}>Rec</button>
      <button style={{height:60, width:140, background:"grey" }} onClick={() => stopRec()}>Stop</button>
      <button style={{height:60, width:140, background:"grey" }} onClick={() => playRec()}>Play</button>
      <audio controls src={`data:${record["mimeType"]};base64,${record["recordDataBase64"]}`} />
    </>
  );
}
import { ChakraProvider } from "@chakra-ui/react";

export default function Index() {
  return (
    <>
      <ChakraProvider>
        <Provider>
          <DeepProvider>
            <Content />
          </DeepProvider>
        </Provider>
      </ChakraProvider>
    </>
  );
}