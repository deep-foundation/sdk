import { ShowActionsResult } from "@capacitor/action-sheet";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertActionSheetResultToDeep({ deep, deviceLinkId, notifyLinkId, actionSheetResult }: { deep: DeepClient, deviceLinkId: number, notifyLinkId: number, actionSheetResult: ShowActionsResult }) {
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const actionSheetResultIndexTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetResultIndex");
  await deep.insert({
    type_id: actionSheetResultIndexTypeLinkId,
    from_id: deviceLinkId,
    to_id: notifyLinkId,
    number: {
      data: {
        value: actionSheetResult.index
      }
    },
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: deep.linkId
      }
    }
  })
}