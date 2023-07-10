import { Camera, Photo, ImageOptions, CameraResultType } from '@capacitor/camera';

/**
 * Takes a photo using the device's camera.
 * @param {ImageOptions} [options] - Optional options for taking a photo.
 * @returns {Promise<Photo>} A Promise that resolves with the taken photo.
 */
export async function takePhoto(options?: ImageOptions): Promise<Photo> {
  const defaultOptions: ImageOptions = {
    quality: 90,
    allowEditing: true,
    saveToGallery: true,
    resultType: CameraResultType.Base64,
    ...options // User provided options will override the defaults
  };
  const photo = await Camera.getPhoto(defaultOptions); // Use the Camera plugin to capture a photo.
  return photo; // Return the taken photo.
}
