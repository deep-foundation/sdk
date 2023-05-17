import { VoiceRecorder } from "capacitor-voice-recorder";
import { useState, useEffect } from "react";

export const useRecordingStatus = ({intervalInMs = 1000}: {intervalInMs?: number}) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const {status} = await VoiceRecorder.getCurrentStatus(); // Replace with the actual function from the audio recording library
        setStatus(status);
      } catch (error) {
        console.error('Error fetching recording status:', error);
      }
    };

    const intervalId = setInterval(fetchStatus, intervalInMs); // Update the status every 1 second (1000 ms)

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []);

  return status;
};