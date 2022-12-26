import React, { useCallback } from 'react';
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

  const photoHandler = async () => {
    const image = await takePhoto();
    setPhotos([...photos, image])
  }

  const handlePhoto = async (deep) => {
    const image = await takePhoto();
    if (image) {
      const customContainerTypeLinkId = await deep.id(deep.linkId, "Camera");
      const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
      const audioChunkTypeLinkId = await deep.id(PACKAGE_NAME, "AudioChunk");

      setPhotos([...photos, image]);

      const { data: [{ id: photoLinkId }] } = await deep.insert(photos.map((photo) => ({
        type_id: audioChunkTypeLinkId,
        string: { data: { value: photo.base64String } },
        in: {
          data: [{
            type_id: containTypeLinkId,
            from_id: customContainerTypeLinkId,
          }]
        }
      })));
    }
    setPhotos([]);
  }

  return <>
    <Stack>
      <Button onClick={async () => {
        await deep.guest();
        await deep.login({ linkId: await deep.id("deep", "admin") });
      }}>
        <Text>Login as admin</Text>
      </Button>
      <Button onClick={async () => { await initializePackage(deep); }}>
        <Text>Initialize package</Text>
      </Button>
      <Button onClick={async () => await checkCameraPermission(deep)}>
        <Text>Check Camera Permission</Text>
      </Button>
      <Button onClick={async () => await getCameraPermission(deep)}>
        <Text>Get Camera Permission</Text>
      </Button>
      <Button onClick={async () => await photoHandler()}>
        <Text>Take Photo</Text>
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