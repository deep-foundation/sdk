import { Camera, CameraResultType } from '@capacitor/camera';

export default async function takePhoto() {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    saveToGallery: true,
    resultType: CameraResultType.Base64
  });
  return image
}