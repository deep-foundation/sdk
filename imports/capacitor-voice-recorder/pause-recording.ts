import { VoiceRecorder } from "capacitor-voice-recorder"

export async function pauseRecording() {
    const { value: ispaused } = await VoiceRecorder.pauseRecording();
    return ispaused;
}