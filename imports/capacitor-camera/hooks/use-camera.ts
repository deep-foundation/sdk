import React, { useEffect } from 'react';
import { Photo, ImageOptions } from '@capacitor/camera';
import { useLocalStore } from '@deep-foundation/store/local';
import { takePhoto } from '../take-photo';
import { uploadPhotos } from '../upload-photos';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';

export interface IUseCamera {
  deep: DeepClient,
  containerLinkId: number,
  options?: ImageOptions
}

export const useCamera = ({ deep, containerLinkId, options }: IUseCamera) => {
  const [photos, setPhotos] = useLocalStore<Photo[]>('CameraPhotos', []);

  useEffect(() => {
    const upload = async () => {
      await uploadPhotos({ deep, containerLinkId, photos });
      setPhotos([]);
    }
    if (photos.length > 0) upload();
  }, [photos, deep])

  const newPhoto = async () => {
    const photo = await takePhoto(options);
    setPhotos([...photos, photo]);
    return photo;
  }
  return newPhoto;
};