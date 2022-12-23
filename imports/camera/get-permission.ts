import { Camera } from '@capacitor/camera';

export default async function getCameraPermission() {
    const { camera, photos } = await Camera.requestPermissions();
    if (camera && photos) return true; else return false;
}