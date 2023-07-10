import { Camera, GalleryPhoto, GalleryImageOptions } from '@capacitor/camera';

/**
 * Retrieves gallery photos from the device.
 * @param {GalleryImageOptions} [options] - Optional options for picking gallery photos.
 * @returns {Promise<GalleryPhoto[]>} A Promise that resolves with an array of gallery photos.
 */
export async function pickGalleryPhotos(options?: GalleryImageOptions): Promise<GalleryPhoto[]> {
  const defaultOptions: GalleryImageOptions = {
    quality: 90,
    ...options // User provided options will override the defaults
  };

  const { photos: galleryPhotos } = await Camera.pickImages(defaultOptions); // Use the Camera plugin to pick images from the gallery.
  return galleryPhotos; // Return the selected gallery photos.
}