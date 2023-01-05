import { Network } from "@capacitor/network"
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./initialize-package";

export default async function saveNetworkStatus(deep: DeepClient) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const connectionTypeLinkId = await deep.id(PACKAGE_NAME, "Connection");
  const connectionTypeTypeLinkId = await deep.id(PACKAGE_NAME, "ConnectionType");
  const connectedTypeLinkId = await deep.id(PACKAGE_NAME, "Connected");
  const timestampTypeLinkId = await deep.id(PACKAGE_NAME, "Timestamp");
  const networkLinkId = await deep.id(deep.linkId, "Network");

  const connection = await Network.getStatus();

  const { data: [{ id:connectionLinkId }] } = await deep.insert({
    type_id: connectionTypeLinkId,
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: networkLinkId,
      }]
    },
    out: {
      data: [
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: connectionTypeTypeLinkId,
              string: { data: { value: connection.connectionType } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: connectedTypeLinkId,
              string: { data: { value: connection.connected ? "connected" : "disconnected" } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: timestampTypeLinkId,
              string: { data: { value: new Date().toLocaleDateString() } },
            }
          }
        }]
    }
  })
}
