import React, { useCallback, useEffect } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';

import initializePackage, { PACKAGE_NAME } from '../imports/camera/initialize-package';
import checkCameraPermission from '../imports/camera/check-permission';
import getCameraPermission from '../imports/camera/get-permission';
import takePhoto from '../imports/camera/take-photo';
import pickImages from '../imports/camera/pick-images';

function Page() {
  const deep = useDeep();
  const [photos, setPhotos] = useLocalStore("PhotoAlbum", []);
  const [pickedImages, setPickedImages] = useLocalStore("Gallery", []);
  const [images, setImages] = useLocalStore("Images", []);

  useEffect(() => {
    const uploadPhotos = async (photos) => {
      const cameraLinkId = await deep.id(deep.linkId, "Camera");
      const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
      const photoTypeLinkId = await deep.id(PACKAGE_NAME, "Photo");
      const base64TypeLinkId = await deep.id(PACKAGE_NAME, "Base64");
      const webPathTypeLinkId = await deep.id(PACKAGE_NAME, "WebPath");
      const exifTypeLinkId = await deep.id(PACKAGE_NAME, "Exif");
      const formatTypeLinkId = await deep.id(PACKAGE_NAME, "Format");
      const timestampTypeLinkId = await deep.id(PACKAGE_NAME, "TimeStamp");
      const { data: [{ id: photoLinkId }] } = await deep.insert(photos.map((photo) => ({
        type_id: photoTypeLinkId,
        in: {
          data: [{
            type_id: containTypeLinkId,
            from_id: cameraLinkId,
          }]
        },
        out: {
          data: [
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: base64TypeLinkId,
                  string: { data: { value: photo.base64String } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: webPathTypeLinkId,
                  string: { data: { value: photo.webPath ? photo.webPath : "none" } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: formatTypeLinkId,
                  string: { data: { value: photo.format } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: exifTypeLinkId,
                  string: { data: { value: photo.exif ? photo.exif : "none" } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: timestampTypeLinkId,
                  string: { data: { value: new Date() } },
                }
              }
            }]
        }
      })));
      setPhotos([]);
    }
    if (photos.length > 0) uploadPhotos(photos);
  }, [photos])

  useEffect(() => {
    const uploadPickedImages = async (pickedImages) => {
      const cameraLinkId = await deep.id(deep.linkId, "Camera");
      const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
      const photoTypeLinkId = await deep.id(PACKAGE_NAME, "Photo");
      const base64TypeLinkId = await deep.id(PACKAGE_NAME, "Base64");
      const webPathTypeLinkId = await deep.id(PACKAGE_NAME, "WebPath");
      const exifTypeLinkId = await deep.id(PACKAGE_NAME, "Exif");
      const formatTypeLinkId = await deep.id(PACKAGE_NAME, "Format");
      const pathTypeLinkId = await deep.id(PACKAGE_NAME, "Path");
      const timestampTypeLinkId = await deep.id(PACKAGE_NAME, "TimeStamp");
      const { data: [{ id: photoLinkId }] } = await deep.insert(pickedImages.map((photo) => ({
        type_id: photoTypeLinkId,
        in: {
          data: [{
            type_id: containTypeLinkId,
            from_id: cameraLinkId,
          }]
        },
        out: {
          data: [
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: pathTypeLinkId,
                  string: { data: { value: photo.path ? photo.path : "none" } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: webPathTypeLinkId,
                  string: { data: { value: photo.webPath ? photo.webPath : "none" } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: formatTypeLinkId,
                  string: { data: { value: photo.format } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: exifTypeLinkId,
                  string: { data: { value: photo.exif ? photo.exif : "none" } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: timestampTypeLinkId,
                  string: { data: { value: new Date() } },
                }
              }
            }]
        }
      })));
      setPickedImages([]);
    }
    if (pickedImages.length > 0) uploadPickedImages(photos);
  }, [pickedImages])

  const handleCamera = async () => {
    const image = await takePhoto();
    setPhotos([...photos, image])
  }

  const handleGallery = async () => {
    const images = await pickImages();
    setPickedImages([...pickedImages, images])
    console.log({images})
  }

  const fetchPhotos = async (deep) => {
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const photoTypeLinkId = await deep.id(PACKAGE_NAME, "Photo");
    const base64TypeLinkId = await deep.id(PACKAGE_NAME, "Base64");
    const formatTypeLinkId = await deep.id(PACKAGE_NAME, "Format");
    const { data } = await deep.select({
      type_id: base64TypeLinkId,
      in: {
          type_id: containTypeLinkId,
          from: {
              type_id: photoTypeLinkId
          }
        }
    },);
    console.log({ data });
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
      <Button onClick={async () => await initializePackage(deep)}>
        <Text>INITIALIZE PACKAGE</Text>
      </Button>
      <Button onClick={async () => await createCameraLink(deep)}>
        <Text>CREATE NEW CAMERA LINK</Text>
      </Button>
      <Button onClick={async () => await checkCameraPermission(deep)}>
        <Text>CHECK PERMISSIONS</Text>
      </Button>
      <Button onClick={async () => await getCameraPermission(deep)}>
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