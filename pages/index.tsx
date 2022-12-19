import { useMemo, useState, useEffect } from "react";
import { VoiceRecorder, VoiceRecorderPlugin, RecordingData, GenericResponse, CurrentRecordingStatus } from 'capacitor-voice-recorder';
import { Camera, CameraResultType } from '@capacitor/camera';
import {
  DeepProvider,
  useDeep,
} from "@deep-foundation/deeplinks/imports/client";
import { Provider } from "../imports/provider";

function Content() {
  const [record, setRecord] = useState({})
  const [photoUrl, setPhotoUrl] = useState("")
  const deep = useDeep();

  const authUser = async () => {
    await deep.guest();
    
    const { linkId, token, error } = await deep.login({
      linkId: await deep.id("deep", 'admin')
    })
    console.log(linkId, token, error);
  };
  
  const isAudioRecSupported = async () => {
    const { value }= await VoiceRecorder.canDeviceVoiceRecord();
    if (value) { console.log("can record on this device");
     return value;
    } else {console.log("cant record on this device")}
  }

  const getAudioRecPermissions = async () => {
    const canRecord = await isAudioRecSupported();
    if (canRecord) {
      const { value } = await VoiceRecorder.hasAudioRecordingPermission();
      if (!value) {
        VoiceRecorder.requestAudioRecordingPermission().then((res) => console.log(res.value) )
      } else {console.log("already can record")}
    }
  }

  const startAudioRec = async () => {
    await VoiceRecorder.startRecording();
  }

  const stopAudioRec = async () => {
    const { value } = await VoiceRecorder.stopRecording();
    setRecord(value);
  }

  const playAudioRec = () => {
    new Audio(`data:${record["mimeType"]};base64,${record["recordDataBase64"]}`).play();
  }

  const getCameraPermissions = async () => {
    const { camera, photos } = await Camera.checkPermissions();
    if(camera || photos !== "granted") { const { camera, photos } = await Camera.requestPermissions();
      if(camera && photos === "granted") { console.log("camera allowed"); return true; } 
    }
  }

  const takePicture = async () => {
    const permissions = await getCameraPermissions();
    if (permissions) {
      const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    setPhotoUrl(image.webPath); console.log(photoUrl);
    
    } else console.log("no camera allowed")
  };

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
      <button style={{height:60, width:140, background:"grey" }} onClick={() => isAudioRecSupported()}>Is Rec Allowed</button>
      <button style={{height:60, width:140, background:"grey" }} onClick={() => getAudioRecPermissions()}>Allow Rec</button>
      <button style={{height:60, width:140, background:"grey" }} onClick={() => startAudioRec()}>Rec Audio</button>
      <button style={{height:60, width:140, background:"grey" }} onClick={() => stopAudioRec()}>Stop Rec</button>
      <button style={{height:60, width:140, background:"grey" }} onClick={() => playAudioRec()}>Play Audio</button>
      <button style={{height:60, width:140, background:"grey" }} onClick={() => getCameraPermissions()}>Is Camera Allowed</button>
      <button style={{height:60, width:140, background:"grey" }} onClick={() => takePicture()}>Take Photo</button>
      <audio controls src={`data:${record["mimeType"]};base64,${record["recordDataBase64"]}`} />
      <img src={photoUrl} />
    </>
  );
}
import { ChakraProvider } from "@chakra-ui/react";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

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