import React, { useEffect } from 'react';
import { GalleryPhoto, GalleryImageOptions } from '@capacitor/camera';
import { useLocalStore } from '@deep-foundation/store/local';
import { pickGalleryPhotos } from '../pick-photos';
import { uploadGallery } from '../upload-gallery';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';

/**
 * Represents the parameters for using the gallery.
 */
export interface IUseGalleryOptions {
  deep: DeepClient; // The DeepClient object used for communication.
  containerLinkId: number; // The ID of the container link.
  options?: GalleryImageOptions; // Optional options for picking gallery photos.
}

/**
 * Custom hook for using the gallery to pick photos and upload them.
 * @param {IUseGalleryOptions} params - The parameters for using the gallery.
 * @returns {Function} A function to pick photos from the gallery.
 */
export const useGallery = ({ deep, containerLinkId, options }: IUseGalleryOptions) => {
  const [galleryPhotos, setGalleryPhotos] = useLocalStore<GalleryPhoto[]>("GalleryPhotos", []); // State for storing the gallery photos.

  useEffect(() => {
    const upload = async () => {
      await uploadGallery({ deep, containerLinkId, galleryPhotos }); // Upload the gallery photos.
      setGalleryPhotos([]); // Clear the gallery photos after upload.
    };

    if (galleryPhotos.length > 0) {
      upload(); // Trigger the upload process when there are photos in the gallery.
    }
  }, [galleryPhotos, deep]);

  /**
   * Function to pick photos from the gallery and add them to the state.
   */
  const pickPhotosFromGallery = async () => {
    const newGalleryPhotos = await pickGalleryPhotos(options); // Pick new photos from the gallery.
    setGalleryPhotos([...galleryPhotos, ...newGalleryPhotos]); // Add the new photos to the state.
  };

  return pickPhotosFromGallery; // Return the function for picking photos from the gallery.
};