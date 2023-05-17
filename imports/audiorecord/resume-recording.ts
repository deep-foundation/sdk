import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"

export default async function resumeAudioRec(deep: DeepClient) {
    const { value: isresumed } = await VoiceRecorder.resumeRecording();
    return isresumed;
}