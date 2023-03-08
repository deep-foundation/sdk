import { PromptOptions } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function getPromptOptionsFromDeep({deep, promptLinkId}: {deep: DeepClient, promptLinkId: number}): Promise<PromptOptions> {
  const titleTypeLinkId = await deep.id(PACKAGE_NAME, "PromptTitle");
  const messageTypeLinkId = await deep.id(PACKAGE_NAME, "PromptMessage");
  const okButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "PromptOkButtonTitle");
  const cancelButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "PromptCancelButtonTitle");
  const inputPlaceholderTypeLinkId = await deep.id(PACKAGE_NAME, "PromptInputPlaceholder");
  const inputTextTypeLinkId = await deep.id(PACKAGE_NAME, "PromptInputText");
  const dialogTreeLinkId = await deep.id(PACKAGE_NAME, "DialogTree")

  const { data: linksDownToPromptmMp } = await deep.select({
    up: {
      parent_id: { _eq: promptLinkId },
      tree_id: { _eq: dialogTreeLinkId }
    }
  }, 
  {
    returning: `type_id id from_id to_id 
    to {
      value 
    }
    `
  });

  const titleLink = linksDownToPromptmMp.find(link => link.type_id === titleTypeLinkId);
  const messageLink = linksDownToPromptmMp.find(link => link.type_id === messageTypeLinkId);
  if(!messageLink) {
    throw new Error(`A link with type ##${messageTypeLinkId} is not found`)
  }
  const okButtonTitleLink = linksDownToPromptmMp.find(link => link.type_id === okButtonTitleTypeLinkId);
  const cancelButtonTitleLink = linksDownToPromptmMp.find(link => link.type_id === cancelButtonTitleTypeLinkId);
  const inputPlaceholderLink = linksDownToPromptmMp.find(link => link.type_id === inputPlaceholderTypeLinkId);
  const inputTextLink = linksDownToPromptmMp.find(link => link.type_id === inputTextTypeLinkId);

  return {
    title: titleLink?.to.value.value,
    message: messageLink.to.value.value,
    okButtonTitle: okButtonTitleLink?.to.value.value,
    cancelButtonTitle: cancelButtonTitleLink?.to.value.value,
    inputPlaceholder: inputPlaceholderLink?.to.value.value,
    inputText: inputTextLink?.to.value.value
  };
}