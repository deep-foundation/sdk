import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { useActionSheetSubscription } from "../../imports/action-sheet/use-action-sheet-subscription";

export function WithActionSheetSubscription({deep, deviceLinkId}: {deep: DeepClient, deviceLinkId: number}) {
   useActionSheetSubscription({deep, deviceLinkId})

   return null
}