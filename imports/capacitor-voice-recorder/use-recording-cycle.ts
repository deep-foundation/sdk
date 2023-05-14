import { useEffect } from 'react';
import { VoiceRecorder } from "capacitor-voice-recorder";
import uploadRecords from './upload-records';
import { CapacitorStoreKeys } from '../capacitor-store-keys';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { IRecord } from "./upload-records";

export const delay = (time: number) => new Promise<void>(res => setTimeout(() => res(null), time));

interface IUseRecordingCycle {
  deep: DeepClient;
  recording: boolean;
  duration: number;
}

export default function useRecordingCycle({deep, recording, duration}:IUseRecordingCycle):IRecord[] {
  const [containerLinkId, setContainerLinkId] = useLocalStore(
    'containerLinkId',
    undefined
  );
  const [records, setRecords] = useLocalStore(CapacitorStoreKeys[CapacitorStoreKeys.Sounds], []);

  useEffect(() => {
    const useRecords = async () => {
      await uploadRecords({deep, containerLinkId, records});
      setRecords([]);
    }
    if (records.length > 0) useRecords();
  }, [records]);

  useEffect(() => {
    let loop = true;
    const startRecordingCycle = async (duration) => {
      for (; recording && loop;) {
        VoiceRecorder.startRecording();
        const startTime = new Date().toLocaleDateString();
        await delay(duration);
        const { value: sound } = await VoiceRecorder.stopRecording();
        const endTime = new Date().toLocaleDateString();
        setRecords([...records, { sound, startTime, endTime }]);
      }
    }
    if (recording) startRecordingCycle(duration);
    return function stopCycle() { loop = false };
  }, [recording]);

  return records;
}
