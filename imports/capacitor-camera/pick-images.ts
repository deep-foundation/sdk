import { Camera, GalleryImageOptions } from '@capacitor/camera';

export default async function pickImages(options?: GalleryImageOptions) {
  const defaultOptions: GalleryImageOptions = {
    quality: 90,
    ...options // User provided options will override the defaults
  };

  const images = await Camera.pickImages(defaultOptions);
  return images;
}