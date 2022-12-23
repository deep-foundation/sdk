import { VoiceRecorder } from "capacitor-voice-recorder"

export default async function checkDeviceSupport() {
    const { value:support } = await VoiceRecorder.canDeviceVoiceRecord();
    return support;
  }
