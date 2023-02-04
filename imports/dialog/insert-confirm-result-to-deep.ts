import { ConfirmResult } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertConfirmResultToDeep({deep, deviceLinkId , confirmLinkId, confirmResult}: {deep: DeepClient, deviceLinkId: number, confirmLinkId: number, confirmResult: ConfirmResult}) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  await deep.insert([
   {
    type_id: confirmResult.value ? await deep.id(PACKAGE_NAME, "ConfirmIsConfirmed") : await deep.id(PACKAGE_NAME, "ConfirmIsNotConfirmed"),
    from_id: deviceLinkId,
    to_id: confirmLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: deep.linkId
      }
    }
   }
  ])

}