import { VoiceRecorder } from "capacitor-voice-recorder"

export default async function pauseAudioRec() {
    const { value: ispaused } = await VoiceRecorder.pauseRecording();
    return ispaused;
}