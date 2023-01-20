import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { MessagePayload } from "firebase/messaging";
import { PACKAGE_NAME } from "./package-name";

export async function insertPushNotificationToDeep({deep, deviceLinkId, payload}: {deep: DeepClient, deviceLinkId: number, payload: MessagePayload}) {
  const notificationTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'Notification'
  );
  const containTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Contain'
  );

  const {
    data: [{ id: notificationLinkId }],
  } = await deep.insert({
    type_id: notificationTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: deviceLinkId,
      },
    },
  });

  const titleTypeLinkId = await deep.id(PACKAGE_NAME, 'Title');
  await deep.insert({
    type_id: titleTypeLinkId,
    string: {
      data: {
        value: payload.notification.title,
      },
    },
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: notificationLinkId,
      },
    },
  });

  const bodyTypeLinkId = await deep.id(PACKAGE_NAME, 'Body');
  await deep.insert({
    type_id: bodyTypeLinkId,
    string: {
      data: {
        value: payload.notification.body,
      },
    },
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: notificationLinkId,
      },
    },
  });

  const iconUrlTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'IconUrl'
  );
  await deep.insert({
    type_id: iconUrlTypeLinkId,
    string: {
      data: {
        value: payload.notification.icon,
      },
    },
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: notificationLinkId,
      },
    },
  });

  const imageUrlTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'ImageUrl'
  );
  await deep.insert({
    type_id: imageUrlTypeLinkId,
    string: {
      data: {
        value: payload.notification.image,
      },
    },
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: notificationLinkId,
      },
    },
  });
}