import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { useScreenReaderSubscription } from "../../imports/screen-reader/use-screen-reader-subscription";

export function WithScreenReaderSubscription({deep, deviceLinkId}: {deep: DeepClient, deviceLinkId: number}) {
   useScreenReaderSubscription({deep, deviceLinkId})

   return null
}