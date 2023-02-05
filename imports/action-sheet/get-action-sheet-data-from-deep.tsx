import { ActionSheetButton, ActionSheetButtonStyle, ShowActionsOptions } from "@capacitor/action-sheet";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function getActionSheetDataFromDeep({ deep, actionSheetLinkId }: { deep: DeepClient, actionSheetLinkId: number }): Promise<ShowActionsOptions> {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const actionSheetTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetTitle");
  const actionSheetMessageTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetMessage");
  const optionTypeLinkId = await deep.id(PACKAGE_NAME, "Option");
  const optionTitleTypeLinkId = await deep.id(PACKAGE_NAME, "OptionTitle");
  const optionStyleTypeLinkId = await deep.id(PACKAGE_NAME, "OptionStyle");
  // const optionIconTypeLinkId = await deep.id(PACKAGE_NAME, "OptionIcon");
  const { data: [linkWithActionSheetTitleString] } = await deep.select({
    in: {
      type_id: actionSheetTitleTypeLinkId,
      from_id: actionSheetLinkId
    }
  });

  const { data: [linkWithActionSheetMessageString] } = await deep.select({
    in: {
      type_id: actionSheetMessageTypeLinkId,
      from_id: actionSheetLinkId
    }
  });


  const {
    data: optionLinks
  } = await deep.select({
    type_id: optionTypeLinkId,
    in: {
      type_id: containTypeLinkId,
      from_id: actionSheetLinkId
    }
  });
  if (optionLinks.length === 0) {
    throw new Error(`To notify ##${actionSheetLinkId} - one or more links with type_id ##${optionTypeLinkId} must exist`)
  }

  const options: ActionSheetButton[] = [];

  for (const optionLink of optionLinks) {
    const { data: [linkWithOptionTitleString] } = await deep.select({
      in: {
        type_id: optionTitleTypeLinkId,
        from_id: optionLink.id
      }
    })
    if (!linkWithOptionTitleString) {
      throw new Error(`To notify ##${optionLink.id} - a link with type_id ##${optionTitleTypeLinkId} with from_id ##${optionLink.id} must exist`)
    }

    let style = undefined;
    const { data: [optionStyleLink] } = await deep.select({
      type_id: optionStyleTypeLinkId,
      from_id: optionLink.id
    })
    if (optionStyleLink?.to_id) {
      const { data: [{ value: { value } }] } = await deep.select({
        type_id: containTypeLinkId,
        to_id: optionStyleLink.to_id
      });
      style = value;
    }

    const option: ActionSheetButton = {
      title: linkWithOptionTitleString.value.value,
      style: style
    };

    options.push(option);
  }

  return {
    title: linkWithActionSheetTitleString?.value?.value,
    message: linkWithActionSheetMessageString?.value?.value,
    options: options
  }
}