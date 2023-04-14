import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Camera } from "@capacitor/camera"
import { PACKAGE_NAME } from "./package-name";

export default async function getCameraPermission(deep: DeepClient, deviceLinkId) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const cameraPermissionTypelinkId = await deep.id(PACKAGE_NAME, "CameraPermissions");
  const photosPermissionTypelinkId = await deep.id(PACKAGE_NAME, "PhotoPermissions");
  const customContainerTypeLinkId = await deep.id(deviceLinkId, "Camera");

  const { camera, photos } = await Camera.requestPermissions();

  if (camera && photos) {
    const { data: [{ id: permissionLinkId }] } = await deep.insert([{
      type_id: cameraPermissionTypelinkId,
      string: { data: { value: camera } },
      in: {
        data: [{
          type_id: containTypeLinkId,
          from_id: customContainerTypeLinkId,
        }]
      }
    },
    {
      type_id: photosPermissionTypelinkId,
      string: { data: { value: photos } },
      in: {
        data: [{
          type_id: containTypeLinkId,
          from_id: customContainerTypeLinkId,
        }]
      }
    }
    ])
  }
  return { camera, photos }
}

