
import { Camera as CapacitorCamera, PermissionStatus } from "@capacitor/camera";

/**
 * Get camera permissions.
 */

export const getCameraPermissions = async () => {
  const cameraPermissions= await CapacitorCamera.requestPermissions();
  return cameraPermissions as PermissionStatus | undefined ;
}