import { VoiceRecorder } from "capacitor-voice-recorder";
import { useState, useEffect } from "react";

// Custom React hook for retrieving the current recording status.
// - intervalInMs: The interval in milliseconds at which the status should be updated (default: 1000 ms).
// Returns the current recording status.

export const useRecordingStatus = ({ intervalInMs = 1000 }: { intervalInMs?: number }): string => {
  const [status, setStatus] = useState(""); // State variable for storing the current status.

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { status } = await VoiceRecorder.getCurrentStatus(); // Retrieve the current recording status.
        setStatus(status); // Update the status state variable.
      } catch (error) {
        console.error('Error fetching recording status:', error);
      }
    };

    const intervalId = setInterval(fetchStatus, intervalInMs); // Set up an interval to fetch the status periodically.

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount.
  }, []);

  return status; // Return the current recording status.
};