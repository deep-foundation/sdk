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
import { usePermissions } from "../hooks/use-permissions";

/**
 * React component for using the camera.
 * @param {DeepClient} deep - The DeepClient object used for communication.
 */
export function Camera({ deep }: { deep: DeepClient }) {
  const [images, setImages] = useState<any[]>([]); // State variable for storing images downloaded from deep database.

  const {cameraPermissions, getPermissions} = usePermissions(); // Get camera permissions.
  const containerLinkId = useContainer(deep); // Retrieve the container link ID.
  const pickPhotosFromGallery = useGallery({ deep, containerLinkId }); // Custom hook for using the gallery.
  const newPhoto = useCamera({ deep, containerLinkId }); // Custom hook for taking a new photo with the camera.

  return (
    <>
      <Stack>
        <Card align={"center"}>
          <CardHeader>
            <Heading>
              CAMERA
            </Heading>
          </CardHeader>
          {!(isAndroid && isIOS)
            ? null
            : (
              <>
                <CardHeader>
                  <Heading>
                    Permissions
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Stack align={"center"} spacing={4}>
                    <Text>{`Camera Permissions are ${!cameraPermissions?.camera ? 'not' : ''} granted.`}</Text>
                    <Text>{`Gallery Permissions are ${!cameraPermissions?.photos ? 'not' : ''} granted.`}</Text>
                    <Button onClick={async () => await getPermissions()}>
                      REQUEST PERMISSIONS
                    </Button>
                  </Stack>
                </CardBody>
              </>
            )
          }
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
  );
}