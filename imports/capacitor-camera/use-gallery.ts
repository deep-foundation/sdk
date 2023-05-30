import React, { useState, useEffect } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import pickImages from './pick-images';
import uploadGallery from './upload-gallery';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';

export const useGallery = (deep: DeepClient, containerLinkId: number) => {
  const [galleryImages, setGalleryImages] = useLocalStore("Gallery", []);

  useEffect(() => {
    const upload = async () => {
      await uploadGallery({ deep, containerLinkId, galleryImages });
      setGalleryImages([]);
    }
    if (galleryImages.length > 0) {
      upload();
    }
  }, [galleryImages, deep]);

  const addImages = async () => {
    const newImages = await pickImages();
    setGalleryImages([...galleryImages, newImages]);
  }

  return addImages;
};