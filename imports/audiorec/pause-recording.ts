import { VoiceRecorder } from "capacitor-voice-recorder"

export default async function pauseAudioRec() {
    await VoiceRecorder.pauseRecording();
}