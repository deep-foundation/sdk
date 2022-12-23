import { Camera } from '@capacitor/camera';

export default async function checkCameraPermission() {
    const { camera, photos } = await Camera.checkPermissions();
    if (camera && photos) return true; else return false;
}