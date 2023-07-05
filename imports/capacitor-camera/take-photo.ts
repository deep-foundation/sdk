import { Camera, Photo, ImageOptions, CameraResultType } from '@capacitor/camera';

export async function takePhoto(options?: ImageOptions): Promise<Photo> {
  const defaultOptions: ImageOptions = {
    quality: 90,
    allowEditing: true,
    saveToGallery: true,
    resultType: CameraResultType.Base64,
    ...options // User provided options will override the defaults
  };
  const photo = await Camera.getPhoto(defaultOptions);
  return photo;
}