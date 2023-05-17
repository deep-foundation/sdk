import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { useHapticsSubscription } from "../../imports/haptics/use-haptics-vibrate-subscription";

export function WithHapticsSubscription({deep, deviceLinkId}: {deep: DeepClient, deviceLinkId: number}) {
   useHapticsSubscription({deep, deviceLinkId})

   return null
}