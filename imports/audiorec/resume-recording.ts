import { VoiceRecorder } from "capacitor-voice-recorder"

export default async function resumeAudioRec() {
    await VoiceRecorder.resumeRecording();
}