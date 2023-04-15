import { Camera, CameraResultType } from '@capacitor/camera';

export default async function pickImages() {
  const images = await Camera.pickImages({
    quality: 90
  });
  return images;
}