import { ShowActionsOptions } from "@capacitor/action-sheet";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "../notification/package-name";

export async function getActionSheetOptionsFromDeep({ deep, actionSheetLinkId }: { deep: DeepClient, actionSheetLinkId: number }): Promise<ShowActionsOptions> {
  const actionSheetTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetTitle");
  const actionSheetMessageTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetMessage");
  const actionSheetOptionTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetOption");
  const actionSheetOptionTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetOptionTitle");
  const actionSheetOptionIconTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetOptionIcon");
  
  const { data: [{ value: { value: title } }] } = await deep.select({
    in: {
      type_id: actionSheetTitleTypeLinkId,
      from_id: actionSheetLinkId,
    }
  });

  const { data: [{ value: { value: message } }] } = await deep.select({
    in: {
      type_id: actionSheetMessageTypeLinkId,
      from_id: actionSheetLinkId,
    }
  });

  const optionsSelectResponse = await deep.select({
    in: {
      type_id: actionSheetOptionTypeLinkId,
      from_id: actionSheetLinkId,
    }
  });

  optionsSelectResponse.data.map(optionLink => {
    const optionsSelectResponse = await deep.select({
      in: {
        type_id: actionSheetButtonTitleTypeLinkId,
        from_id: optionLink.id,
      }
    });
  })

  return {
    title,
    message,
    options: 
    
  }
}