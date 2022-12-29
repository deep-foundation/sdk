import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"

export default async function startAudioRec(deep: DeepClient) {
    const { value: isrecording } = await VoiceRecorder.startRecording();
    return isrecording;
}