import { VoiceRecorder } from "capacitor-voice-recorder"

// Pauses the ongoing recording.

export async function pauseRecording() {
  const { value: ispaused } = await VoiceRecorder.pauseRecording(); // Pause the recording.
  return ispaused; // Return the pause status.
}