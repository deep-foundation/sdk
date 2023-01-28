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
    case "wifi":
      await deep.delete({
        up: {
          tree_id: {
            _id: ['@deep-foundation/core', 'containTree'],
          },
          parent: {
            type_id: {
              _id: ['@deep-foundation/core', 'Contain'],
            },
            from_id: deviceLinkId,
            to: {
              _or: [
                {
                  type_id: {
                    _id: [PACKAGE_NAME, 'Wifi'],
                  },
                },
              ],
            },
          },
        },
      }
      );
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
    case "cellular":
      await deep.delete({
        up: {
          tree_id: {
            _id: ['@deep-foundation/core', 'containTree'],
          },
          parent: {
            type_id: {
              _id: ['@deep-foundation/core', 'Contain'],
            },
            from_id: deviceLinkId,
            to: {
              _or: [
                {
                  type_id: {
                    _id: [PACKAGE_NAME, 'Cellular'],
                  },
                },
              ],
            },
          },
        },
      }
      );
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
    case "unknown":
      await deep.delete({
        up: {
          tree_id: {
            _id: ['@deep-foundation/core', 'containTree'],
          },
          parent: {
            type_id: {
              _id: ['@deep-foundation/core', 'Contain'],
            },
            from_id: deviceLinkId,
            to: {
              _or: [
                {
                  type_id: {
                    _id: [PACKAGE_NAME, 'Unknown'],
                  },
                },
              ],
            },
          },
        },
      }
      );
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
    case "none":
      await deep.delete({
        up: {
          tree_id: {
            _id: ['@deep-foundation/core', 'containTree'],
          },
          parent: {
            type_id: {
              _id: ['@deep-foundation/core', 'Contain'],
            },
            from_id: deviceLinkId,
            to: {
              _or: [
                {
                  type_id: {
                    _id: [PACKAGE_NAME, 'None'],
                  },
                },
              ],
            },
          },
        },
      }
      );
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
