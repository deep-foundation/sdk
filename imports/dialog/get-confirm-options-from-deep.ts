import { ConfirmOptions } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function getConfirmOptionsFromDeep({deep, confirmLinkId}: {deep: DeepClient, confirmLinkId: number}): Promise<ConfirmOptions> {
  const titleTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmTitle");
  const messageTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmMessage");
  const okButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmOkButtonTitle");
  const cancelButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmCancelButtonTitle");
  const dialogTreeLinkId = await deep.id(PACKAGE_NAME, "DialogTree")

  const { data: linksDownToConfirmMp } = await deep.select({
    up: {
      parent_id: { _eq: confirmLinkId },
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

  const titleLink = linksDownToConfirmMp.find(link => link.type_id === titleTypeLinkId);

  const messageLink = linksDownToConfirmMp.find(link => link.type_id === messageTypeLinkId);
  if(!messageLink) {
    throw new Error(`A link with type ##${messageTypeLinkId} is not found`)
  }

  const okButtonTitleLink = linksDownToConfirmMp.find(link => link.type_id === okButtonTitleTypeLinkId);

  const cancelButtonTitleLink = linksDownToConfirmMp.find(link => link.type_id === cancelButtonTitleTypeLinkId);

  return {
    title: titleLink?.to.value.value,
    message: messageLink.to.value.value,
    okButtonTitle: okButtonTitleLink?.to.value.value,
    cancelButtonTitle: cancelButtonTitleLink?.to.value.value
  }
}