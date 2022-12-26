import { Network } from "@capacitor/network"
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./initialize-package";

export default async function saveNetworkStatus(deep: DeepClient) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain")
  const connectionTypeLinkId = await deep.id(PACKAGE_NAME, "ConnectionType")
  const customContainerTypeLinkId = await deep.id(deep.linkId, "Network");
  
  const { connectionType } = await Network.getStatus();

  const { data: [{ id: connectionLinkId }] } = await deep.insert({
    type_id: connectionTypeLinkId,
    string: { data: { value: connectionType } },
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: customContainerTypeLinkId,
      }]
    }
  })
}
