import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Device } from "./device";
import { PACKAGE_NAME } from "./package-name";

export async function getDevice({deep, deviceLinkId}: {deep: DeepClient, deviceLinkId: number}): Promise<Device> {
  const nameTypeLinkId = await deep.id(PACKAGE_NAME, "Name");
  const modelTypeLinkId = await deep.id(PACKAGE_NAME, "Model");

  const {data: deviceTreeLinksUpToParentDevice} = await deep.select({
    up: {
      tree_id: {
        _id: [PACKAGE_NAME, "DeviceTree"]
      },
      parent_id: deviceLinkId
    }
  });
  const nameLink = deviceTreeLinksUpToParentDevice.find(link => link.type_id === nameTypeLinkId);
  if(!nameLink) {
    throw new Error(`A link with type ##${nameTypeLinkId} associated with ##${deviceLinkId} is not found`);
  }
  if(!nameLink.value?.value) {
    throw new Error(`${nameLink.id} must have a value`)
  }
  const name = nameLink.value.value;

  const modelLink = deviceTreeLinksUpToParentDevice.find(link => link.type_id === modelTypeLinkId);
  if(!modelLink) {
    throw new Error(`A link with type ##${modelTypeLinkId} associated with ##${deviceLinkId} is not found`);
  }
  if(!modelLink.value?.value) {
    throw new Error(`${modelLink.id} must have a value`)
  }
  const model = modelLink.value.value;

  return {
    name,
    model
  }
}