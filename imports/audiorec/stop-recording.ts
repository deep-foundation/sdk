import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"

export default async function stopAudioRec(deep: DeepClient) {
    const { value: record } = await VoiceRecorder.stopRecording();
    return record;
}