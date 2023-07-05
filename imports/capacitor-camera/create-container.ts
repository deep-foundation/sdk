import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { CAPACITOR_CAMERA_PACKAGE_NAME } from './package-name';

export async function createContainer(deep: DeepClient): Promise<number> {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const cameraTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Camera");

  const { data: [{ id: containerLinkId = undefined } = {}] = [] } = await deep.select({ type_id: cameraTypeLinkId });

  if (!containerLinkId) {
    const { data: [{ id: newContainerLinkId }] } = await deep.insert({
      type_id: cameraTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: deep.linkId,
          string: { data: { value: "Camera" } },
        }
      }
    });
    return newContainerLinkId;
  } else alert("Container link already exists!"); return containerLinkId;
}