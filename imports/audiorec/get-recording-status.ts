import { VoiceRecorder } from "capacitor-voice-recorder";

export default async function getRecordingStatus() {
  const { status } = await VoiceRecorder.getCurrentStatus();
  return status;
}