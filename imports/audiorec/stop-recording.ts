import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"
import getRecordingStatus from "./get-recording-status";

export default async function stopAudioRec(deep: DeepClient) {
    const { value: record } = await VoiceRecorder.stopRecording();
    if (record) {
        await getRecordingStatus(deep);
    }
    return record;
}