import { useEffect } from "react";
import { insertDevice } from "./insert-device";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";

export async function initDeviceIfNotInitedAndSaveData({deep, deviceLinkId, setDeviceLinkId} : {deep: DeepClient, deviceLinkId: number, setDeviceLinkId: (deviceLinkId: number) => void}) {
   if(deviceLinkId) {
      const { data: deviceLinks } = await deep.select(deviceLinkId);
      if (deviceLinks.length === 0) {
        setDeviceLinkId(undefined);
        return {deviceLinkId: undefined}
      }
    } else {
      const { deviceLink } = await insertDevice({ deep });
      setDeviceLinkId(deviceLink.id);
      return {deviceLinkId: deviceLink.id}
    }
}