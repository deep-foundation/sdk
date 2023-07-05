import { useState, useEffect } from "react";
import { Stack, Card, CardHeader, Heading, CardBody, Text, Button } from "@chakra-ui/react";
import { Camera as CapacitorCamera, PermissionStatus } from "@capacitor/camera";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { useCamera } from '../hooks/use-camera';
import { useGallery } from '../hooks/use-gallery';
import { downloadImages } from '../download-images';
import { isIOS, isAndroid } from "react-device-detect";
import { ImageCard } from "./image-card";
import { useContainer } from "../hooks/use-container";

export function Camera({ deep }: { deep: DeepClient }) {
  const [images, setImages] = useState<any[]>([]);
  const [cameraPermissions, setCameraPermissions] = useState<PermissionStatus | undefined>(undefined);

  useEffect(() => {
    if (typeof (window) !== undefined) { defineCustomElements(window); } else getCameraPermissions();
  });

  const getCameraPermissions = async () => {
    const newCameraPermissions: PermissionStatus | undefined = await CapacitorCamera.requestPermissions();
    setCameraPermissions(newCameraPermissions);
  };

  const containerLinkId = useContainer(deep);
  const pickPhotosFromGallery = useGallery({ deep, containerLinkId });
  const newPhoto = useCamera({ deep, containerLinkId });

  return <>
    <Stack>
      <Card align={"center"}>
        <CardHeader>
          <Heading>
            CAMERA
          </Heading>
        </CardHeader>
        {!(isAndroid && isIOS)
          ? null
          : (<>
            <CardHeader>
              <Heading>
                Permissions
              </Heading>
            </CardHeader>
            <CardBody>
              <Stack align={"center"} spacing={4}>
                <Text>{`Camera Permissions are ${!cameraPermissions?.camera && 'not'} granted.`}</Text>
                <Text>{`Gallery Permissions are ${!cameraPermissions?.photos && 'not'} granted.`}</Text>
                <Button onClick={async () => await getCameraPermissions()}>
                  REQUEST PERMISSIONS
                </Button>
              </Stack>
            </CardBody>
          </>
          )}
      </Card>
      <Button onClick={newPhoto}>
        <Text>USE CAMERA</Text>
      </Button>
      <Button onClick={pickPhotosFromGallery}>
        <Text>USE GALLERY</Text>
      </Button>
      <Button onClick={async () => { const images = await downloadImages(deep); setImages(images) }}>
        <Text>LOAD IMAGES</Text>
      </Button>
    </Stack>
    <Stack align="center" direction="column">
      {images?.map((image) => <ImageCard key={image.id} image={image} />)}
    </Stack>
  </>
}
