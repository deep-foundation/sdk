import React, { useState, useEffect } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import takePhoto from './take-photo';
import uploadPhotos from './upload-photos';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';

export const useCamera = (deep: DeepClient, containerLinkId: number) => {
  const [photos, setPhotos] = useLocalStore('CameraPhotos', []);
  
  useEffect(() => {
    const upload = async () => {
      await uploadPhotos({ deep, containerLinkId, photos });
      setPhotos([]);
    }
    if (photos.length > 0) upload();
  }, [photos, deep])

  const newPhoto = async () => {
    const photo = await takePhoto();
    setPhotos([...photos, photo]);
    return photo;
  }
  return newPhoto;
};