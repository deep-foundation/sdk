import { Network } from "@capacitor/network"
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export default async function saveNetworkStatus(deep: DeepClient) {
  const packageTypeLinkId = await deep.id('@deep-foundation/core', "Package")
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain")
  const joinTypeLinkId = await deep.id("@deep-foundation/core", "Join")
  const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type")
  const connectionTypeLinkId = await deep.id(PACKAGE_NAME, "ConnectionType")
  
  const { connectionType } = await Network.getStatus();
  const { data: [{ id: connectionLinkId }] } = await deep.insert({
    type_id: connectionTypeLinkId,
    string: { data: { value: connectionType } },
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: deep.linkId,
      }]
    }
  })
}
