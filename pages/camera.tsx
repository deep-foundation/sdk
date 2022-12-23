import React, { useCallback } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep, useDeepSubscription, DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';

import { PACKAGE_NAME } from "../imports/audiorec/package-name";
import initializePackage from '../imports/camera/initialize-package';
import checkCameraPermission from '../imports/camera/check-permission';
import getCameraPermission from '../imports/camera/get-permission';
import takePhoto from '../imports/camera/take-photo';

function Page() {
  const deep = useDeep();
  const [ photos, setPhotos ] = useLocalStore("PhotoAlbum", []);

  const photoHandler = async () => {
    const image = await takePhoto();
    setPhotos([...photos, image])
  }

  return <Stack>
    <Button onClick={async () => {
      await deep.guest(); 
      await deep.login({ linkId: await deep.id("deep", "admin") });
    }}>
     <Text>Login as admin</Text> 
    </Button>
    <Button onClick={async () => { await initializePackage(deep); }}>
      <Text>Initialize package</Text>
    </Button>
    <Button onClick={async () => await checkCameraPermission()}>
      <Text>checkCameraPermission</Text>
    </Button>
    <Button onClick={async () => await getCameraPermission()}>
      <Text>getCameraPermission</Text>
    </Button>
    <Button onClick={async () => await photoHandler()}>
      <Text>takePhoto</Text>
    </Button>
  </Stack>
  {photos?.map((p) => <img id={Math.random().toString()} src={p.webPath}/>)}
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