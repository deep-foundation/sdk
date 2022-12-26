import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"
import getRecordingStatus from "./get-recording-status";

export default async function startAudioRec(deep: DeepClient) {
    const { value: isrecording } = await VoiceRecorder.startRecording();
    if (isrecording) {
        await getRecordingStatus(deep);
    }
}