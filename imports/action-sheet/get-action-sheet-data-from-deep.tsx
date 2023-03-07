import { ActionSheetButton, ActionSheetButtonStyle, ShowActionsOptions } from "@capacitor/action-sheet";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function getActionSheetDataFromDeep({ deep, actionSheetLinkId }: { deep: DeepClient, actionSheetLinkId: number }): Promise<ShowActionsOptions> {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const titleTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetTitle");
  const messageTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetMessage");
  const optionTypeLinkId = await deep.id(PACKAGE_NAME, "Option");
  const optionTitleTypeLinkId = await deep.id(PACKAGE_NAME, "OptionTitle");
  const optionStyleTypeLinkId = await deep.id(PACKAGE_NAME, "OptionStyle");
  const actionSheetTreeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetTree");
  // const optionIconTypeLinkId = await deep.id(PACKAGE_NAME, "OptionIcon");
  const { data: linksDownToActionSheetMp } = await deep.select({
    up: {
      parent_id: { _eq: actionSheetLinkId },
      tree_id: { _eq: actionSheetTreeLinkId }
    }
  });

  const linkWithTitle = linksDownToActionSheetMp.find(link => link.type_id === titleTypeLinkId);
  if(!linkWithTitle) {
    throw new Error(`A link with type ##${titleTypeLinkId} is not found`)
  }

  const linkWithMessage = linksDownToActionSheetMp.find(link => link.type_id === messageTypeLinkId);
  if(!linkWithMessage) {
    throw new Error(`A link with type ##${messageTypeLinkId} is not found`)
  }

  const optionLinks = linksDownToActionSheetMp.filter(link => link.type_id === optionTypeLinkId);
  if(optionLinks.length === 0) {
    throw new Error(`A link with type ##${optionTypeLinkId} is not found`)
  }

  const options: ActionSheetButton[] = [];

  for (const optionLink of optionLinks) {
    const { data: [linkWithOptionTitle] } = await deep.select({
      in: {
        type_id: optionTitleTypeLinkId,
        from_id: optionLink.id
      }
    })
    if (!linkWithOptionTitle) {
      throw new Error(`To notify ##${optionLink.id} - a link with type_id ##${optionTitleTypeLinkId} with from_id ##${optionLink.id} must exist`)
    }

    let style = undefined;
    const { data: [containToOptionStyleLink] } = await deep.select({
      type_id: containTypeLinkId,
      to: {
        in: {
          type_id: optionStyleTypeLinkId,
          from_id: optionLink.id
        }
      }
    });
    if(containToOptionStyleLink) {
      style = containToOptionStyleLink.value.value;
    }
    

    const option: ActionSheetButton = {
      title: linkWithOptionTitle.value.value,
      style: style
    };

    options.push(option);
  }

  return {
    title: linkWithTitle?.value?.value,
    message: linkWithMessage?.value?.value,
    options: options
  }
}