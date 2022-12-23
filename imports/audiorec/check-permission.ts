import { VoiceRecorder } from "capacitor-voice-recorder";

export default async function checkAudioRecPermission() {
    const { value:hasAudioRecPermission } = await VoiceRecorder.hasAudioRecordingPermission();
    return hasAudioRecPermission;
}