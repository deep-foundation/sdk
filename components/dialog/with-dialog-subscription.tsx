import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { useDialogSubscription } from "../../imports/dialog/use-dialog-subscription";

export function WithDialogSubscription({deep, deviceLinkId}: {deep: DeepClient, deviceLinkId: number}) {
   useDialogSubscription({deep, deviceLinkId})

   return null
}