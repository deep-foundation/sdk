import { useState, useEffect } from "react";
import { VoiceRecorder as CapacitorVoiceRecorder } from 'capacitor-voice-recorder';

// Custom hook to check for device support and manage camera permissions.
 
export const usePermissions = () => {
	// State variable for storing camera permissions and device recording support.
	const [recorderPermissions, setCameraPermissions] = useState<boolean | undefined>(undefined);
	const [deviceSupport, setDeviceSupport] = useState<boolean | undefined>(undefined);

	useEffect(() => {
		getDeviceSupport();
		getPermissions();
	}, []);

	const getDeviceSupport = async () => {
		// Request ability to record from the device
		const { value: newDeviceSupport } = await CapacitorVoiceRecorder.canDeviceVoiceRecord();
		setCameraPermissions(newDeviceSupport); // Set the recorder permissions state.
	}
	const getPermissions = async () => {
		// Request audio recording permission
		const { value: newRecorderPermissions } = await CapacitorVoiceRecorder.requestAudioRecordingPermission();
		setDeviceSupport(newRecorderPermissions); // Set the device support state.
	}
	return {recorderPermissions, deviceSupport, getPermissions, getDeviceSupport}
}