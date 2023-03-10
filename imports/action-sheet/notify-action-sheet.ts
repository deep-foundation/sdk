import { ActionSheet } from "@capacitor/action-sheet";
import { Dialog } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";
import { getActionSheetDataFromDeep } from "./get-action-sheet-data-from-deep";
import { insertActionSheetResultToDeep } from "./insert-action-sheet-result-to-deep";
import { PACKAGE_NAME } from "./package-name";

export async function notifyActionSheet({ deep, deviceLinkId, notifyLink }: { deep: DeepClient, deviceLinkId: number, notifyLink: Link<number> }) {

  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");

  const actionSheetOptions = await getActionSheetDataFromDeep({
    deep,
    actionSheetLinkId: notifyLink.from_id,
  });
  const actionSheetResult = await ActionSheet.showActions(
    actionSheetOptions
  );
  await insertActionSheetResultToDeep({
    deep,
    deviceLinkId,
    notifyLinkId: notifyLink.id,
    actionSheetResult,
  });
  
  await deep.insert({
    type_id: await deep.id(PACKAGE_NAME, "Notified"),
    from_id: notifyLink.id,
    to_id: deviceLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: deep.linkId
      }
    }
  });
}
