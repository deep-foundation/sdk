import { VoiceRecorder } from "capacitor-voice-recorder"

// Resumes the paused recording.

export async function resumeRecording() {
  const { value: isresumed } = await VoiceRecorder.resumeRecording(); // Resume the recording.
  return isresumed; // Return the resume status.
}