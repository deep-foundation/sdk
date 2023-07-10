import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from './package-name';
import { LinkName } from "./link-name";

/**
 *  Creates a new container for audio records.
 * @param {DeepClient} deep - The DeepClient instance.
 */

export async function createContainer(deep: DeepClient): Promise<number> {

  // Get the link IDs for nessesary types.

  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const audioRecordsTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.AudioRecords]);

  // Check if a container link already exists for "AudioRecords" type.

  const { data: [{ id: containerLinkId = undefined } = {}] = [] } = await deep.select({ type_id: audioRecordsTypeLinkId });

  // Create a new container link of "AudioRecords" type if it does not exist.

  if (!containerLinkId) {
    const { data: [{ id: newContainerLinkId }] } = await deep.insert({
      type_id: audioRecordsTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: deep.linkId,
          string: { data: { value: "AudioRecords" } },
        }
      }
    });

    return newContainerLinkId; // Return the ID of the new container.
  } else {
    alert("Container link already exists!"); // If a container link already exists, show an alert.
    return containerLinkId; // Return the existing container link ID.
  }
}