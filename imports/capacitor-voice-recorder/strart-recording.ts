import { VoiceRecorder } from "capacitor-voice-recorder";

// Starts the recording process.

export async function startRecording(): Promise<string> {
  const { value: isrecording } = await VoiceRecorder.startRecording(); // Start the recording.
  const startTime = new Date().toLocaleDateString(); // Get the start time of the recording.
  return startTime; // Return the start time.
}