import { ShowActionsResult } from "@capacitor/action-sheet";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertActionSheetResultToDeep({ deep, actionSheetLinkId, actionSheetResult }: { deep: DeepClient, actionSheetLinkId: number, actionSheetResult: ShowActionsResult }) {
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const actionSheetResultIndexTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetResultIndex");
  await deep.insert({
    type_id: containTypeLinkId,
    from_id: actionSheetLinkId,
    to: {
      data: {
        type_id: actionSheetResultIndexTypeLinkId,
        number: {
          data: {
            value: actionSheetResult.index
          }
        }
      }
    }
  })
}