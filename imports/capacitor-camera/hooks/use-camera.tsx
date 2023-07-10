import React, { useEffect } from 'react';
import { Photo, ImageOptions } from '@capacitor/camera';
import { useLocalStore } from '@deep-foundation/store/local';
import { takePhoto } from '../take-photo';
import { uploadPhotos } from '../upload-photos';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';

/**
 * Represents the parameters for using the camera.
 */
export interface IUseCameraOptions {
  deep: DeepClient; // The DeepClient object used for communication.
  containerLinkId: number; // The ID of the container link.
  options?: ImageOptions; // The options for taking photos.
}

/**
 * Custom hook for using the camera.
 * @param {IUseCameraOptions} param0 - The parameters for using the camera.
 * @returns {Function} A function that can be called to capture a new photo.
 */
export const useCamera = ({ deep, containerLinkId, options }: IUseCameraOptions) => {
  const [photos, setPhotos] = useLocalStore<Photo[]>('CameraPhotos', []); // State to store the captured photos.

  useEffect(() => {
    const upload = async () => {
      await uploadPhotos({ deep, containerLinkId, photos }); // Upload the captured photos.
      setPhotos([]); // Clear the photos array after uploading.
    };

    if (photos.length > 0) {
      upload(); // Upload the photos if there are any in the array.
    }
  }, [photos, deep]);

  /**
   * Function to capture a new photo.
   * @returns {Promise<Photo>} A Promise that resolves with the captured photo.
   */
  const newPhoto = async () => {
    const photo = await takePhoto(options); // Capture a new photo.
    setPhotos([...photos, photo]); // Add the photo to the photos array.
    return photo; // Return the captured photo.
  };

  return newPhoto; // Return the function to capture a new photo.
};