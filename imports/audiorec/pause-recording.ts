import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"
import getRecordingStatus from "./get-recording-status";

export default async function pauseAudioRec(deep: DeepClient) {
    const { value: ispaused } = await VoiceRecorder.pauseRecording();
    if (ispaused) {
        await getRecordingStatus(deep);
    }
}