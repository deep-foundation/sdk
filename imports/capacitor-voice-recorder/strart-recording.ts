import { VoiceRecorder } from "capacitor-voice-recorder";

export default async function startRecording(): Promise<string> {
    const { value: isrecording } = await VoiceRecorder.startRecording();
    const startTime = new Date().toLocaleDateString();
    return startTime;
}