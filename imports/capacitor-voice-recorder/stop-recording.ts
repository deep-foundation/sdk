import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"
import uploadRecords from "./upload-records";

export default async function stopRecording(deep: DeepClient, containerLinkId, startTime) {
    const { value: record } = await VoiceRecorder.stopRecording();
    const endTime = new Date().toLocaleDateString();
    await uploadRecords(deep, containerLinkId, [{record, startTime, endTime}])
    return record;
}