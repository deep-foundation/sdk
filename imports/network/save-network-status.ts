import { Network } from "@capacitor/network"
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";

export default async function saveNetworkStatus(deep: DeepClient) {
  const networkLinkId = await deep.id(deep.linkId, "Network");
  const wifiLinkId = await deep.id(networkLinkId, "Wifi");
  const cellularLinkId = await deep.id(networkLinkId, "Cellular");
  const unknownLinkId = await deep.id(networkLinkId, "Unknown");
  const noneLinkId = await deep.id(networkLinkId, "None");

  const connection = await Network.getStatus();
  console.log({ connection });

  switch (connection.connectionType) {
    case "wifi": const { data: [{ id: _wifiLinkId }] } = await deep.insert(
      { link_id: wifiLinkId, value: connection.connected ? "connected" : "disconnected" },
      { table: "strings" }
    );
      break;
    case "cellular": const { data: [{ id: _cellularLinkId }] } = await deep.insert(
      {
        link_id: cellularLinkId, value: connection.connected ? "connected" : "disconnected"
      },
      { table: "strings" }
    );
      break;
    case "unknown": const { data: [{ id: _unknownLinkId }] } = await deep.insert(
      {
        link_id: unknownLinkId, value: connection.connected ? "connected" : "disconnected"
      },
      { table: "strings" }
    );
      break;
    case "none": const { data: [{ id: _noneLinkId }] } = await deep.insert(
      {
        link_id: noneLinkId, value: connection.connected ? "connected" : "disconnected"
      },
      { table: "strings" }
    );
      break;
  }
}
