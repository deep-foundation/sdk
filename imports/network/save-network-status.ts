import { Network } from "@capacitor/network"
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./initialize-package";

export default async function saveNetworkStatus(deep: DeepClient, deviceLinkId: number, newConnection?: any) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const wifiTypeLinkId = await deep.id(PACKAGE_NAME, "Wifi");
  const cellularTypeLinkId = await deep.id(PACKAGE_NAME, "Cellular");
  const unknownTypeLinkId = await deep.id(PACKAGE_NAME, "Unknown");
  const noneTypeLinkId = await deep.id(PACKAGE_NAME, "None");

  const connection = !!newConnection ? newConnection : await Network.getStatus();

  switch (connection.connectionType) {
    case "wifi": const { data: [{ id: wifiLinkId }] } = await deep.select({ type_id: wifiTypeLinkId });
      const { data: [{ id: deletedWifiLinkId }] } = await deep.delete({
        _or: [{
          type_id: { _eq: containTypeLinkId },
          to_id: { _eq: wifiLinkId }
        }, {
          id: { _eq: wifiLinkId }
        }]
      });
      const { data: [{ id: newWifiLinkId }] } = await deep.insert({
        type_id: wifiTypeLinkId,
        string: { data: { value: "connected" } },
        in: {
          data: [{
            type_id: containTypeLinkId,
            string: { data: { value: "Network" } },
            from_id: deviceLinkId
          }]
        }
      });
      break;
    case "cellular": const { data: [{ id: cellularLinkId }] } = await deep.select({ type_id: cellularTypeLinkId });
      const { data: [{ id: deletedCellularLinkId }] } = await deep.delete({
        _or: [{
          type_id: { _eq: containTypeLinkId },
          to_id: { _eq: cellularLinkId }
        }, {
          id: { _eq: cellularLinkId }
        }]
      });
      const { data: [{ id: newCellularLinkId }] } = await deep.insert({
        type_id: cellularTypeLinkId,
        string: { data: { value: "connected" } },
        in: {
          data: [{
            type_id: containTypeLinkId,
            string: { data: { value: "Network" } },
            from_id: deviceLinkId
          }]
        }
      });
      break;
    case "unknown": const { data: [{ id: unknownLinkId }] } = await deep.select({ type_id: unknownTypeLinkId });
      const { data: [{ id: deletedUnknownLinkId }] } = await deep.delete({
        _or: [{
          type_id: { _eq: containTypeLinkId },
          to_id: { _eq: unknownLinkId }
        }, {
          id: { _eq: unknownLinkId }
        }]
      });
      const { data: [{ id: newUnknownLinkId }] } = await deep.insert({
        type_id: unknownTypeLinkId,
        string: { data: { value: "connected" } },
        in: {
          data: [{
            type_id: containTypeLinkId,
            string: { data: { value: "Network" } },
            from_id: deviceLinkId
          }]
        }
      });
      break;
    case "none": const { data: [{ id: noneLinkId }] } = await deep.select({ type_id: noneTypeLinkId });
      const { data: [{ id: deletedNoneLinkId }] } = await deep.delete({
        _or: [{
          type_id: { _eq: containTypeLinkId },
          to_id: { _eq: noneLinkId }
        }, {
          id: { _eq: noneLinkId }
        }]
      });
      const { data: [{ id: newNoneLinkId }] } = await deep.insert({
        type_id: noneTypeLinkId,
        string: { data: { value: "connected" } },
        in: {
          data: [{
            type_id: containTypeLinkId,
            string: { data: { value: "Network" } },
            from_id: deviceLinkId
          }]
        }
      });
      break;
  }
}
