import { DeviceInfo } from "@capacitor/device";
import { PushNotifications } from "@capacitor/push-notifications";

export async function requestPermissions({platform}: {platform: DeviceInfo["platform"]}){
  let isPermissionsGranted: boolean;
  if (platform === 'web') {
    const permissionsStatus = await Notification.requestPermission();
    isPermissionsGranted = permissionsStatus === 'granted';
  } else {
    const permissionsStatus =
      await PushNotifications.requestPermissions();
    isPermissionsGranted = permissionsStatus.receive === 'granted';
  }
  return isPermissionsGranted
}