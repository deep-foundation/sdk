import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";
import { PushNotification } from "./push-notification";

export async function getPushNotification({ deep, pushNotificationLinkId }: { deep: DeepClient, pushNotificationLinkId: number }): Promise<PushNotification> {
  const titleTypeLinkId = await deep.id(PACKAGE_NAME, "PushNotificationTitle");
  const bodyTypeLinkId = await deep.id(PACKAGE_NAME, "PushNotificationBody");
  const pushNotificationTreeLinkId = await deep.id(PACKAGE_NAME, "PushNotificationTree");

  const { data: linksDownToParentPushNotificationMp } = await deep.select({
    up: {
      parent_id: { _eq: pushNotificationLinkId },
      tree_id: { _eq: pushNotificationTreeLinkId }
    }
  }, 
  {
    returning: `${deep.selectReturning}
    to {
      ${deep.selectReturning}
    }
    `
  });

  const linkWithTitle = linksDownToParentPushNotificationMp.find(link => link.type_id === titleTypeLinkId);
  if(!linkWithTitle) {
    throw new Error(`A link with type ##${titleTypeLinkId} is not found`)
  }

  const linkWithBody = linksDownToParentPushNotificationMp.find(link => link.type_id === bodyTypeLinkId);
  if(!linkWithBody) {
    throw new Error(`A link with type ##${bodyTypeLinkId} is not found`)
  }

  return {
    title: linkWithTitle?.to.value.value,
    body: linkWithBody.to.value.value,
  }
}