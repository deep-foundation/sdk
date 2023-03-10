import { PushNotifications } from "@capacitor/push-notifications";

export async function requestPermissions({platform}: {platform: string}){
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