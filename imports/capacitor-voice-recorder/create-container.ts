import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { CAPACITOR_VOICE_RECORDER_PACKAGE_NAME } from './package-name';

export async function createContainer(deep: DeepClient): Promise<number> {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const audioRecordsTypeLinkId = await deep.id(CAPACITOR_VOICE_RECORDER_PACKAGE_NAME, "AudioRecords");

  const { data: [{ id: containerLinkId = undefined } = {}] = [] } = await deep.select({ type_id: audioRecordsTypeLinkId });

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
    return newContainerLinkId;
  } else alert("Container link already exists!"); return containerLinkId;
}