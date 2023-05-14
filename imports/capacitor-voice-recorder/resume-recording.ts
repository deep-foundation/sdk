import { VoiceRecorder } from "capacitor-voice-recorder"

export default async function resumeAudioRec() {
    const { value: isresumed } = await VoiceRecorder.resumeRecording();
    return isresumed;
}