import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from './package-name';
import { LinkName } from "./link-name";

/**
 * Creates a new container for the camera records.
 * @param {DeepClient} deep - The DeepClient object instance.
 * @returns {Promise<number>} A Promise that resolves with the ID of the new container.
 */
export async function createContainer(deep: DeepClient): Promise<number> {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain"); // Retrieve the link ID for the "Contain" type.
  const cameraTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Camera]); // Retrieve the link ID for the "Camera" type.

  const { data: [{ id: containerLinkId = undefined } = {}] = [] } = await deep.select({ type_id: cameraTypeLinkId }); // Check if a container link already exists for the "Camera" type.

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
    }); // Create a new container link for the "Camera" type.

    return newContainerLinkId; // Return the ID of the new container.
  } else {
    alert("Container link already exists!"); // If a container link already exists, show an alert.
    return containerLinkId; // Return the existing container link ID.
  }
}