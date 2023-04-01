import React, { useCallback, useEffect } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';

import installPackage, { PACKAGE_NAME } from '../imports/camera/install-package';
import checkCameraPermission from '../imports/camera/check-permission';
import getCameraPermission from '../imports/camera/get-permission';
import takePhoto from '../imports/camera/take-photo';
import pickImages from '../imports/camera/pick-images';
import uploadPhotos from '../imports/camera/upload-photos';
import uploadGallery from '../imports/camera/upload-gallery';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

function Page() {
  const deep = useDeep();
  const [photos, setPhotos] = useLocalStore("PhotoAlbum", []);
  const [galleryImages, setGalleryImages] = useLocalStore("Gallery", []);
  const [images, setImages] = useLocalStore("Images", []);
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );
  useEffect(() => {
    if (typeof(window) === "object") defineCustomElements(window);
   });

  useEffect(() => {
    const useCamera = async () => {
      await uploadPhotos(deep, deviceLinkId, photos);
      setPhotos([]);
    }
    if (photos.length > 0) useCamera();
  }, [photos])

  useEffect(() => {
    const useGallery = async () => {
      await uploadGallery(deep, deviceLinkId, galleryImages)
      setGalleryImages([]);
    }
    if (galleryImages.length > 0) useGallery();
  }, [galleryImages])

  const handleCamera = async () => {
    const image = await takePhoto();
    setPhotos([...photos, image])
  }

  const handleGallery = async () => {
    const images = await pickImages();
    setGalleryImages([...galleryImages, images])
  }

  const fetchPhotos = async (deep) => {
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const photoTypeLinkId = await deep.id(PACKAGE_NAME, "Photo");
    const base64TypeLinkId = await deep.id(PACKAGE_NAME, "Base64");
    const { data } = await deep.select({
      type_id: base64TypeLinkId,
      in: {
        type_id: containTypeLinkId,
        from: {
          type_id: photoTypeLinkId
        }
      }
    },);
    setImages(data);
  }

  const createCameraLink = async (deep) => {
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const { data: [{ id: cameraLinkId }] } = await deep.insert({
      type_id: await deep.id(PACKAGE_NAME, "Camera"),
      in: {
        data: [{
          type_id: containTypeLinkId,
          from_id: await deep.id("deep", "admin"),
          string: { data: { value: "Camera" } }
        }]
      }
    })
  }

  return <>
    <Stack>
      <Text suppressHydrationWarning>Device link id: {deviceLinkId ?? " "}</Text>
      <Button onClick={async () => await installPackage(deviceLinkId)}>
        <Text>INITIALIZE PACKAGE</Text>
      </Button>
      <Button onClick={async () => await createCameraLink(deep)}>
        <Text>CREATE NEW CAMERA LINK</Text>
      </Button>
      <Button onClick={async () => await checkCameraPermission(deep, deviceLinkId)}>
        <Text>CHECK PERMISSIONS</Text>
      </Button>
      <Button onClick={async () => await getCameraPermission(deep, deviceLinkId)}>
        <Text>GET PERMISSIONS</Text>
      </Button>
      <Button onClick={async () => await handleCamera()}>
        <Text>USE CAMERA</Text>
      </Button>
      <Button onClick={async () => await handleGallery()}>
        <Text>USE GALLERY</Text>
      </Button>
      <Button onClick={async () => await fetchPhotos(deep)}>
        <Text>LOAD IMAGES</Text>
      </Button>
    </Stack>
    <Stack>
      {images?.map((i) => <img key={i.id} src={`data:${i.format};base64, ${i.value.value}`} />)}
    </Stack>
  </>
}

export default function Camera() {
  return (
    <ChakraProvider>
      <Provider>
        <DeepProvider>
          <Page />
        </DeepProvider>
      </Provider>
    </ChakraProvider>
  );
}