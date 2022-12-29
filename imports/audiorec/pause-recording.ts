import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"

export default async function pauseAudioRec(deep: DeepClient) {
    const { value: ispaused } = await VoiceRecorder.pauseRecording();
    return ispaused;
}