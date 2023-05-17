import { ConnectionStatus, Network } from "@capacitor/network"
import { DeepClient, SerialOperation } from "@deep-foundation/deeplinks/imports/client";
import { CAPACITOR_NETWORK_PACKAGE_NAME } from "./package-name";

export default async function saveNetworkStatuses(deep: DeepClient, deviceLinkId: number, connectionStatuses?: Array<ConnectionStatus>) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const networkTypeLinkId = await deep.id(CAPACITOR_NETWORK_PACKAGE_NAME, "Network");
  const wifiTypeLinkId = await deep.id(CAPACITOR_NETWORK_PACKAGE_NAME, "Wifi");
  const cellularTypeLinkId = await deep.id(CAPACITOR_NETWORK_PACKAGE_NAME, "Cellular");
  const unknownTypeLinkId = await deep.id(CAPACITOR_NETWORK_PACKAGE_NAME, "Unknown");
  const noneTypeLinkId = await deep.id(CAPACITOR_NETWORK_PACKAGE_NAME, "None");
  const trueLinkId = await deep.id("@freephoenix888/boolean", "True");
  const falseLinkId = await deep.id("@freephoenix888/boolean", "False");

  if(connectionStatuses.length === 0) {
    const connectionStatus = await Network.getStatus()
    connectionStatuses.push(connectionStatus)
  }

  const { data: [{ id: networkLinkId }] } = await deep.select({
    type_id: networkTypeLinkId,
    in: {
      type_id: containTypeLinkId,
      from_id: deviceLinkId,
    }
  });

  await deep.serial({
    operations: [
      {
        table: 'links',
        type: 'delete',
        exp: {
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
                type_id: {
                  _in: [
                    connectionStatuses.find(connectionStatus => connectionStatus.connectionType === 'wifi') ? wifiTypeLinkId : 
                    connectionStatuses.find(connectionStatus => connectionStatus.connectionType === 'cellular') ? cellularTypeLinkId :
                    connectionStatuses.find(connectionStatus => connectionStatus.connectionType === 'none') ? noneTypeLinkId :
                    unknownTypeLinkId,
                  ]
                },
              },
            },
          },
        }
      },
      {
        table: 'links',
        type: 'insert',
        objects: connectionStatuses.map(connectionStatus => ({
          type_id: wifiTypeLinkId,
          from_id: networkLinkId,
          to_id: connectionStatus.connected ? trueLinkId : falseLinkId,
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        }))
      }
    ]
  })
}
