import { VoiceRecorder } from "capacitor-voice-recorder";

export default async function getAudioRecPermission() {
  const { value:audioRecPermission } = await VoiceRecorder.requestAudioRecordingPermission();
  return audioRecPermission;
}