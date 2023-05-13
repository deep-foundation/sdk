import { useState, useEffect } from 'react';
import { VoiceRecorder } from "capacitor-voice-recorder";
import uploadRecords from './upload-records';
import { CapacitorStoreKeys } from '../capacitor-store-keys';
import { useLocalStore } from '@deep-foundation/store/local';

export const delay = (time) => new Promise(res => setTimeout(() => res(null), time));

export default function useRecordingCycle({deep, recording, duration}) {
  const [containerLinkId, setContainerLinkId] = useLocalStore(
    'containerLinkId',
    undefined
  );
  const [sounds, setSounds] = useLocalStore(CapacitorStoreKeys[CapacitorStoreKeys.Sounds], []);

  useEffect(() => {
    const useRecords = async () => {
      await uploadRecords(deep, containerLinkId, sounds);
      setSounds([]);
    }
    if (sounds.length > 0) useRecords();
  }, [sounds]);

  useEffect(() => {
    let loop = true;
    const startRecordingCycle = async (duration) => {
      for (; recording && loop;) {
        VoiceRecorder.startRecording();
        const startTime = new Date().toLocaleDateString();
        await delay(duration);
        const { value: record } = await VoiceRecorder.stopRecording();
        const endTime = new Date().toLocaleDateString();
        setSounds([...sounds, { record, startTime, endTime }]);
      }
    }
    if (recording) startRecordingCycle(duration);
    return function stopCycle() { loop = false };
  }, [recording]);

  return sounds;
}
