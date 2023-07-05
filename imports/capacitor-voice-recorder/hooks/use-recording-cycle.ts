import { useState, useEffect } from 'react';
import { VoiceRecorder } from "capacitor-voice-recorder";
import { uploadRecords, IRecord } from '../upload-records';
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";

export const delay = (time: number) => new Promise<void>(res => setTimeout(() => res(), time));

export interface IUseRecordingCycle {
  deep: DeepClient;
  containerLinkId: number,
  recording: boolean;
  duration: number;
}

export function useRecordingCycle({ deep, recording, containerLinkId, duration }: IUseRecordingCycle): IRecord[] {
  const [records, setRecords] = useState<IRecord[]>([]);

  useEffect(() => {
    const useRecords = async () => {
      await uploadRecords({ deep, containerLinkId, records });
      setRecords([]);
    }
    if (records.length > 0) useRecords();
  }, [records]);

  useEffect(() => {
    let loop = true;
    const startRecordingCycle = async () => {
      for (; recording && loop;) {
        VoiceRecorder.startRecording();
        const startTime = new Date().toLocaleDateString();
        await delay(duration);
        const { value: sound } = await VoiceRecorder.stopRecording();
        const endTime = new Date().toLocaleDateString();
        setRecords([...records, { sound, startTime, endTime }]);
      }
    }
    if (recording) startRecordingCycle();
    return function stopCycle() { loop = false };
  }, [recording]);

  return records;
}