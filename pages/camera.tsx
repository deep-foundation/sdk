import React, { useCallback, useEffect } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';

import initializePackage, { PACKAGE_NAME } from '../imports/camera/initialize-package';
import checkCameraPermission from '../imports/camera/check-permission';
import getCameraPermission from '../imports/camera/get-permission';
import takePhoto from '../imports/camera/take-photo';

function Page() {
  const deep = useDeep();
  const [photos, setPhotos] = useLocalStore("PhotoAlbum", []);

  useEffect(() => {
    const uploadPhotos = async (photos) => {
      const cameraLinkId = await deep.id(deep.linkId, "Camera");
      const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
      const photoTypeLinkId = await deep.id(PACKAGE_NAME, "Photo");
      const { data: [{ id: photoLinkId }] } = await deep.insert(photos.map((photo) => ({
        type_id: photoTypeLinkId,
        string: { data: { value: photo.base64String } },
        in: {
          data: [{
            type_id: containTypeLinkId,
            from_id: cameraLinkId,
          }]
        }
      })));
      setPhotos([]);
    }
    if (photos.length > 0) uploadPhotos(photos);
  }, [photos])

  const handlePhoto = async (deep) => {
    const image = await takePhoto();
      setPhotos([...photos, image])
  }

  return <>
    <Stack>
      <Button onClick={async () => { await initializePackage(deep); }}>
        <Text>INITIALIZE PACKAGE</Text>
      </Button>
      <Button onClick={async () => await checkCameraPermission(deep)}>
        <Text>CHECK PERMISSIONS</Text>
      </Button>
      <Button onClick={async () => await getCameraPermission(deep)}>
        <Text>GET PERMISSIONS</Text>
      </Button>
      <Button onClick={async () => await handlePhoto(deep)}>
        <Text>TAKE PHOTO</Text>
      </Button>
    </Stack>
    <Stack>
      {photos?.map((p) => <img id={Math.random().toString()} src={`data:${p.format};base64, ${p.base64String}`} />)}
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