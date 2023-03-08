import { AlertOptions } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function getAlertOptionsFromDeep({ deep, alertLinkId }: { deep: DeepClient, alertLinkId: number }): Promise<AlertOptions> {
  const titleTypeLinkId = await deep.id(PACKAGE_NAME, "AlertTitle");
  const messageTypeLinkId = await deep.id(PACKAGE_NAME, "AlertMessage");
  const buttonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "AlertButtonTitle");
  const dialogTreeLinkId = await deep.id(PACKAGE_NAME, "DialogTree")

  const { data: linksDownToAlertMp } = await deep.select({
    up: {
      parent_id: { _eq: alertLinkId },
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

  const titleLink = linksDownToAlertMp.find(link => link.type_id === titleTypeLinkId);
  if(!titleLink) {
    throw new Error(`A link with type ##${titleTypeLinkId} is not found`)
  }


  const linkWithMessage = linksDownToAlertMp.find(link => link.type_id === messageTypeLinkId);
  if(!linkWithMessage) {
    throw new Error(`A link with type ##${messageTypeLinkId} is not found`)
  }

  const linkWithButtonTitle = linksDownToAlertMp.find(link => link.type_id === buttonTitleTypeLinkId);

  return {
    title: titleLink.to.value.value,
    message: linkWithMessage.to.value.value,
    buttonTitle: linkWithButtonTitle?.to.value.value
  }
}