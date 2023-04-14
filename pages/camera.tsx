import React, { useCallback, useEffect } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Image, Stack, Text, Box } from '@chakra-ui/react';
import checkCameraPermission from '../imports/camera/check-permission';
import getCameraPermission from '../imports/camera/get-permission';
import takePhoto from '../imports/camera/take-photo';
import pickImages from '../imports/camera/pick-images';
import uploadPhotos from '../imports/camera/upload-photos';
import uploadGallery from '../imports/camera/upload-gallery';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import ImageCard from './image-card';
import { PACKAGE_NAME } from '../imports/camera/package-name';

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
    if (typeof (window) === "object") defineCustomElements(window);
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
    const cameraTypeLinkId = await deep.id(PACKAGE_NAME, "Camera");
    const { data } = await deep.select({
      type_id: photoTypeLinkId,
      in: {
        type_id: containTypeLinkId,
        from: {
          type_id: cameraTypeLinkId
        }
      }
    }, {
      "returning": `id
    properties: out {
      property: to {
        type {
          in(where: {value: {_is_null: false}}) {
            value
          }
        }
        value
      }
    }
  `})

    const images = data.map(photo => {
      photo.properties.forEach(property => photo[property.property.type.in[0].value.value] = property.property.value.value)
      return photo;
    })
    setImages(images);
  }

  const createCameraLink = async (deep) => {
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const { data: [{ id: cameraLinkId }] } = await deep.insert({
      type_id: await deep.id(PACKAGE_NAME, "Camera"),
      in: {
        data: [{
          type_id: containTypeLinkId,
          from_id: deviceLinkId,
          string: { data: { value: "Camera" } }
        }]
      }
    })
  }

  return <>
    <Stack>
      <Text suppressHydrationWarning>Device link id: {deviceLinkId ?? "NONE"}</Text>
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
        <Text>VIEW IMAGES</Text>
      </Button>
    </Stack>
    <Stack align="center" direction="column">
      {images?.map((image) => <ImageCard key={image.id} image={image} />)}
    </Stack>
  </>
}

export default function CameraPage() {
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