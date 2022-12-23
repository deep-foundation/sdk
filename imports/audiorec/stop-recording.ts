import { VoiceRecorder } from "capacitor-voice-recorder"

export default async function stopAudioRec() {
    const { value:record } = await VoiceRecorder.stopRecording();
    return record;
}