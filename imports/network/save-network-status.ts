import { Network } from "@capacitor/network"
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./initialize-package";

export default async function saveNetworkStatus(deep: DeepClient) {
  const networkLinkId = await deep.id(deep.linkId, "Network");
  const wifiLinkId = await deep.id(networkLinkId, "Wifi");
  const cellularLinkId = await deep.id(networkLinkId, "Cellular");
  const unknownLinkId = await deep.id(networkLinkId, "Unknown");
  const noneLinkId = await deep.id(networkLinkId, "None");

  const connection = await Network.getStatus();

  switch (connection.connectionType) {
    case "wifi": const { data: [{ id: updatedWifiLinkId }] } = await deep.update(wifiLinkId, { value: connection.connected ? "connected" : "disconnected" }, );
    case "cellular": const { data: [{ id: updatedCellularLinkId }] } = await deep.update(cellularLinkId, { value: connection.connected ? "connected" : "disconnected" });
    case "unknown": const { data: [{ id: updatedUnknownLinkId }] } = await deep.update(unknownLinkId, { value: connection.connected ? "connected" : "disconnected" });
    case "none": const { data: [{ id: updatedNoneLinkId }] } = await deep.update(noneLinkId, { value: connection.connected ? "connected" : "disconnected" });
  }
}
