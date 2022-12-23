import { VoiceRecorder } from "capacitor-voice-recorder"

export default async function startAudioRec() {
    await VoiceRecorder.startRecording();
}