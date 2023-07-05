import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder";
import { uploadRecords } from "./upload-records";

export interface ISound {
  recordDataBase64: string;
  msDuration: number;
  mimeType: string;
}

export interface IStopRecording {
  deep: DeepClient;
  containerLinkId: number;
  startTime: string;
}

export async function stopRecording({
  deep,
  containerLinkId,
  startTime,
}: IStopRecording): Promise<ISound> {
  const { value: sound } = await VoiceRecorder.stopRecording();
  const endTime = new Date().toLocaleDateString();
  await uploadRecords({ deep, containerLinkId, records: [{ sound, startTime, endTime }] });
  return sound;
}