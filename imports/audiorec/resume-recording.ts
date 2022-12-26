import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"
import getRecordingStatus from "./get-recording-status";

export default async function resumeAudioRec(deep: DeepClient) {
    const { value: isresumed } = await VoiceRecorder.resumeRecording();
    if (isresumed) {
       await getRecordingStatus(deep);
    }
}