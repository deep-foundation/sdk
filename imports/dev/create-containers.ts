import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./initialize-package";

export const containers = ["Network", "Camera", "AudioRec"];

export default async function createContainers(deep: DeepClient) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain")
  const containerTypeLinkId = await deep.id(PACKAGE_NAME, "Container")

  const { data } = await deep.insert(containers.map((container) => ({
    type_id: containerTypeLinkId,
    string: { data: { value: container } },
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: deep.linkId,
        string: { data: { value: container } },
      }]
    }
  })))
  const containerIds = data.map((item) => item.id);
  console.log(containerIds);
  return containerIds;
}