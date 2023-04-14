import { ConnectionStatus, Network } from "@capacitor/network"
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export default async function saveNetworkStatus(deep: DeepClient, deviceLinkId: number, newConnection?: ConnectionStatus) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const networkTypeLinkId = await deep.id(PACKAGE_NAME, "Network");
  const wifiTypeLinkId = await deep.id(PACKAGE_NAME, "Wifi");
  const cellularTypeLinkId = await deep.id(PACKAGE_NAME, "Cellular");
  const unknownTypeLinkId = await deep.id(PACKAGE_NAME, "Unknown");
  const noneTypeLinkId = await deep.id(PACKAGE_NAME, "None");
  const trueLinkId = await deep.id("@freephoenix888/boolean", "True");
  const falseLinkId = await deep.id("@freephoenix888/boolean", "False");

  const connection = !!newConnection ? newConnection : await Network.getStatus();

  const { data: [{ id: networkLinkId }] } = await deep.select({
    type_id: networkTypeLinkId
  });

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
      });
      if (connection.connected) {
        const { data: [{ id: newWifiLinkId }] } = await deep.insert({
          type_id: wifiTypeLinkId,
          from_id: networkLinkId,
          to_id: trueLinkId,
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        });
      } else {
        const { data: [{ id: newWifiLinkId }] } = await deep.insert({
          type_id: wifiTypeLinkId,
          from_id: networkLinkId,
          to_id: falseLinkId,
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        });
      };
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
      });
      if (connection.connected) {
        const { data: [{ id: newCellularLinkId }] } = await deep.insert({
          type_id: cellularTypeLinkId,
          from_id: networkLinkId,
          to_id: trueLinkId,
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        });
      } else {
        const { data: [{ id: newCellularLinkId }] } = await deep.insert({
          type_id: cellularTypeLinkId,
          from_id: networkLinkId,
          to_id: falseLinkId,
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        });
      };
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
                    _id: [PACKAGE_NAME, 'unknown'],
                  },
                },
              ],
            },
          },
        },
      });
      if (connection.connected) {
        const { data: [{ id: newUnknownLinkId }] } = await deep.insert({
          type_id: unknownTypeLinkId,
          from_id: networkLinkId,
          to_id: trueLinkId,
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        });
      } else {
        const { data: [{ id: newUnknownLinkId }] } = await deep.insert({
          type_id: unknownTypeLinkId,
          from_id: networkLinkId,
          to_id: falseLinkId,
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        });
      };
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
                    _id: [PACKAGE_NAME, 'none'],
                  },
                },
              ],
            },
          },
        },
      });
      if (connection.connected) {
        const { data: [{ id: newNoneLinkId }] } = await deep.insert({
          type_id: noneTypeLinkId,
          from_id: networkLinkId,
          to_id: trueLinkId,
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        });
      } else {
        const { data: [{ id: newNoneLinkId }] } = await deep.insert({
          type_id: noneTypeLinkId,
          from_id: networkLinkId,
          to_id: falseLinkId,
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        });
      };
      break;
  }
}
