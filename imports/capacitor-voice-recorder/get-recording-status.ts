import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"

export default async function getRecordingStatus(deep: DeepClient) {
  const { status } = await VoiceRecorder.getCurrentStatus();
  return status;
}
