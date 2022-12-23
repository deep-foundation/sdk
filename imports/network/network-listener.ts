import { Network } from "@capacitor/network"
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { LocalStoreProvider, useLocalStore } from '@deep-foundation/store/local';
import { PACKAGE_NAME } from "./package-name";

export default async function subscribeToNetworkStatus({deep, connectionTypes, setConnectionTypes}:
  {deep:DeepClient, connectionTypes:string[], setConnectionTypes:( connectionTypes:string[]) => void }) {
  console.log("y");
  
  Network.addListener('networkStatusChange', async ({ connectionType }) => {
    console.log(connectionType);
    if (connectionType === 'none') {
      setConnectionTypes([...connectionTypes, connectionType]);
    } else {
      console.log("z");
      const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain")
      const connectionTypeLinkId = await deep.id(PACKAGE_NAME, "ConnectionType")
      console.log(JSON.stringify(connectionTypes));
      setConnectionTypes([...connectionTypes, connectionType]);
      console.log(JSON.stringify(connectionTypes));
      const { data: [{ id: connectionLinkId }] } = await deep.insert([...connectionTypes.map((connectionType)=>({
        type_id: connectionTypeLinkId,
        string: { data: { value: connectionType } },
        in: {
          data: [{
            type_id: containTypeLinkId,
            from_id: deep.linkId,
          }]
        }
      }))])
    }
  });
}
