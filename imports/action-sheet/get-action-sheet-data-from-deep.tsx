import { ActionSheetButton, ActionSheetButtonStyle, ShowActionsOptions } from "@capacitor/action-sheet";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function getActionSheetDataFromDeep({ deep, actionSheetLinkId }: { deep: DeepClient, actionSheetLinkId: number }): Promise<ShowActionsOptions> {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const titleTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetTitle");
  const messageTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetMessage");
  const optionTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetOption");
  const usesOptionTypeLinkId = await deep.id(PACKAGE_NAME, "UsesActionSheetOption");
  const optionTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetOptionTitle");
  const optionStyleTypeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetOptionStyle");
  const actionSheetTreeLinkId = await deep.id(PACKAGE_NAME, "ActionSheetTree");
  // const optionIconTypeLinkId = await deep.id(PACKAGE_NAME, "OptionIcon");

  const { data: linksDownToParentActionSheetMp } = await deep.select({
    up: {
      parent_id: { _eq: actionSheetLinkId },
      tree_id: { _eq: actionSheetTreeLinkId }
    }
  }, 
  {
    returning: `${deep.selectReturning}
    to {
      ${deep.selectReturning}
    }
    `
  });

  const linkWithTitle = linksDownToParentActionSheetMp.find(link => link.type_id === titleTypeLinkId);
  if(!linkWithTitle) {
    throw new Error(`A link with type ##${titleTypeLinkId} is not found`)
  }

  const linkWithMessage = linksDownToParentActionSheetMp.find(link => link.type_id === messageTypeLinkId);
  if(!linkWithMessage) {
    throw new Error(`A link with type ##${messageTypeLinkId} is not found`)
  }

  const usesOptionLinks = linksDownToParentActionSheetMp.filter(link => link.type_id === usesOptionTypeLinkId);
  if(usesOptionLinks.length === 0) {
    throw new Error(`A link with type ##${usesOptionTypeLinkId} is not found`)
  }

  const options: ActionSheetButton[] = [];

  for (const usesOptionLink of usesOptionLinks) {
    console.log({usesOptionLink})
    if(usesOptionLink?.value.value === undefined) {
      throw new Error(`##${usesOptionLink.id} must have a number value which indicates an index of the action sheet`)
    }

    const optionLink = usesOptionLink.to;
    const { data: [linkWithOptionTitle] } = await deep.select({
      in: {
        type_id: optionTitleTypeLinkId,
        from_id: optionLink.id
      }
    })
    if (!linkWithOptionTitle) {
      throw new Error(`To notify ##${actionSheetLinkId} - a link with type_id ##${optionTitleTypeLinkId} with from_id ##${optionLink.id} must exist`)
    }

    let style = undefined;
    const { data: [containToOptionStyleLink] } = await deep.select({
      type_id: containTypeLinkId,
      to: {
        in: {
          type_id: optionStyleTypeLinkId,
          from_id: usesOptionLink.id
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

    options[usesOptionLink.value.value] = option;
  }

  return {
    title: linkWithTitle?.to.value.value,
    message: linkWithMessage?.to.value.value,
    options: options
  }
}