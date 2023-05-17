import { useEffect } from "react"
import { DeepClient } from "@deep-foundation/deeplinks/imports/client"
import { initDeviceIfNotInitedAndSaveData } from "../../imports/device/init-device-if-not-inited-and-save-data"

export function WithInitDeviceIfNotInitedAndSaveData({deep, deviceLinkId, setDeviceLinkId}: {deep: DeepClient, deviceLinkId: number, setDeviceLinkId: (deviceLinkId: number) => void}) {
  useEffect(() => {
    initDeviceIfNotInitedAndSaveData({
      deep,
      deviceLinkId,
      setDeviceLinkId
    })
  })
  return null;
}