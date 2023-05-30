import React, { useState, useEffect } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { Button, Card, CardBody, CardHeader, ChakraProvider, Heading, Stack, Text } from '@chakra-ui/react';
import { Camera, PermissionStatus } from "@capacitor/camera";
import installPackage, { PACKAGE_NAME } from '../imports/capacitor-camera/install-package';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import ImageCard from './image-card';
import createContainer from '../imports/capacitor-camera/create-container';
import { useCamera } from '../imports/capacitor-camera/use-camera';
import { useGallery } from '../imports/capacitor-camera/use-gallery';
import { downloadPhotos } from '../imports/capacitor-camera/download-photos';
import takePhoto from '../imports/capacitor-camera/take-photo';
import { isIOS, isAndroid } from "react-device-detect";

function Page() {
  const deep = useDeep();
  const [images, setImages] = useState([]);
  const [cameraPermissions, setCameraPermissions] = useState<PermissionStatus | undefined>(undefined);
  const [containerLinkId, setContainerLinkId] = useLocalStore(
    'containerLinkId',
    undefined
  );

  useEffect(() => {
    if (!containerLinkId) {
      const initializeContainerLink = async () => {
        setContainerLinkId(await createContainer(deep));
      };
      initializeContainerLink();
    }
  }, []);

  useEffect(() => {
    if (typeof (window) !== undefined) { defineCustomElements(window) } else {
      const getCameraPermissions = async () => {
        const newCameraPermissions: PermissionStatus | undefined = await Camera.requestPermissions();
        setCameraPermissions(newCameraPermissions);
      };
      getCameraPermissions();
    }
  });

  const getCameraPermissions = async () => {
    const newCameraPermissions: PermissionStatus | undefined = await Camera.requestPermissions();
    setCameraPermissions(newCameraPermissions);
  };

  useGallery(deep, containerLinkId);
  useCamera(deep, containerLinkId);

  return <>
    <Stack>
      <Card>
        <CardHeader>
          <Heading>
            Permissions
          </Heading>
        </CardHeader>
        {!(isAndroid && isIOS)
          ? null
          : (<CardBody>
            <Text>{`Camera Permissions are ${!cameraPermissions?.camera && 'not'} granted.`}</Text>
            <Text>{`Gallery Permissions are ${!cameraPermissions?.photos && 'not'} granted.`}</Text>
            <Button onClick={async () => await getCameraPermissions()}>
              Request permissions
            </Button>
          </CardBody>)}
      </Card>
      <Button onClick={async () => await installPackage(containerLinkId)}>
        INITIALIZE PACKAGE
      </Button>
      <Button onClick={async () => setContainerLinkId(await createContainer(deep))}>
        CREATE NEW CONTAINER
      </Button>
      <Button onClick={async () => { }}>
        <Text>USE CAMERA</Text>
      </Button>
      <Button onClick={async () => { }}>
        <Text>USE GALLERY</Text>
      </Button>
      <Button onClick={async () => { const images = await downloadPhotos(deep); setImages(images) }}>
        <Text>LOAD IMAGES</Text>
      </Button>
    </Stack>
    <Stack align="center" direction="column">
      {images?.map((image) => <ImageCard key={image.id} image={image} />)}
    </Stack>
  </>
}

export default function CapacitorCamera() {
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