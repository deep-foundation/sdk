import { useState, useEffect } from 'react';
import { VoiceRecorder } from "capacitor-voice-recorder";
import { uploadRecords, IRecord } from '../upload-records';
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";

// Delays the execution by a specified amount of time.

export const delay = (time: number) => new Promise<void>(res => setTimeout(() => res(), time));

export interface IUseRecordingCycle { // Represents the parameters for the useRecordingCycle hook.
  deep: DeepClient; // The DeepClient instance.
  containerLinkId: number; // The ID of the container link.
  recording: boolean; // Indicates whether recording is enabled or not.
  duration: number; // The duration of each recording cycle in milliseconds.
}

// Custom React hook that manages the recording cycle.
// Returns an array of recorded sound objects.

export function useRecordingCycle({ deep, recording, containerLinkId, duration }: IUseRecordingCycle): IRecord[] {
  const [records, setRecords] = useState<IRecord[]>([]); // State variable to store the recorded sounds.

  useEffect(() => {
    const uploadAndResetRecords = async () => {
      await uploadRecords({ deep, containerLinkId, records }); // Upload the recorded sounds.
      setRecords([]); // Reset the records.
    };

    if (records.length > 0) {
      uploadAndResetRecords(); // Upload the recorded sounds when there are records available.
    }
  }, [records]);

  useEffect(() => {
    let loop = true; // Variable to control the recording loop.

    const startRecordingCycle = async () => {
      for (; recording && loop;) { // Continue recording while recording is enabled and the loop is not interrupted.
        await VoiceRecorder.startRecording(); // Start the recording.
        const startTime = new Date().toLocaleDateString(); // Get the start time of the recording.
        await delay(duration); // Delay for the specified duration.
        const { value: sound } = await VoiceRecorder.stopRecording(); // Stop the recording and obtain the recorded sound.
        const endTime = new Date().toLocaleDateString(); // Get the end time of the recording.
        setRecords([...records, { sound, startTime, endTime }]); // Add the recorded sound to the records.
      }
    };

    if (recording) {
      startRecordingCycle(); // Start the recording cycle when recording is enabled.
    }

    return function stopCycle() {
      loop = false; // Interrupt the recording loop when the component unmounts or the recording is disabled.
    };
  }, [recording]);

  return records; // Return the recorded sounds.
}