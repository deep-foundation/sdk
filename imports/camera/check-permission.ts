import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Camera } from "@capacitor/camera"
import { PACKAGE_NAME } from "./initialize-package";

export default async function checkCameraPermission(deep: DeepClient, deviceLinkId) {
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const cameraPermissionTypelinkId = await deep.id(PACKAGE_NAME, "CameraPermission");
    const photosPermissionTypelinkId = await deep.id(PACKAGE_NAME, "PhotoPermission");
    const cameraLinkId = await deep.id(deviceLinkId, "Camera");

    const { camera, photos } = await Camera.checkPermissions();

    const { data: [{ id: permissionLinkId }] } = await deep.insert([{
        type_id: cameraPermissionTypelinkId,
        string: { data: { value: camera } },
        in: {
            data: [{
                type_id: containTypeLinkId,
                from_id: cameraLinkId,
            }]
        }
    },
        {
            type_id: photosPermissionTypelinkId,
            string: { data: { value: photos } },
            in: {
                data: [{
                    type_id: containTypeLinkId,
                    from_id: cameraLinkId,
                }]
            }
        }
    ])
    return { camera, photos }
}

