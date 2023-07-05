import { VoiceRecorder } from "capacitor-voice-recorder"

export async function resumeRecording() {
    const { value: isresumed } = await VoiceRecorder.resumeRecording();
    return isresumed;
}