import { Camera, GalleryPhoto, GalleryImageOptions } from '@capacitor/camera';

export async function pickGalleryPhotos(options?: GalleryImageOptions): Promise<GalleryPhoto[]> {
  const defaultOptions: GalleryImageOptions = {
    quality: 90,
    ...options // User provided options will override the defaults
  };

  const { photos: galleryPhotos } = await Camera.pickImages(defaultOptions);
  return galleryPhotos;
}