import {NotificationPayload} from 'firebase/messaging';
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";
import { PushNotification } from './push-notification';

export async function insertPushNotification({deep, pushNotification, containerLinkId}:{deep: DeepClient, pushNotification: PushNotification, containerLinkId: number}) {
  const pushNotificationTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'PushNotification'
  );
  const titleTypeLinkId = await deep.id(PACKAGE_NAME, 'PushNotificationTitle');
  const bodyTypeLinkId = await deep.id(PACKAGE_NAME, 'PushNotificationBody');
  const imageUrlTypeLinkId = await deep.id(PACKAGE_NAME, 'PushNotificationImageUrl');
  const syncTextFileTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'SyncTextFile'
  );
  const containTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Contain'
  );
  await deep.insert({
    type_id: pushNotificationTypeLinkId,
    in: {
      data: [
        {
          type_id: containTypeLinkId,
          from_id: containerLinkId,
        },
      ],
    },
    out: {
      data: [
        {
          type_id: titleTypeLinkId,
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              in: {
                data: [
                  {
                    type_id: containTypeLinkId,
                    from_id: containerLinkId,
                  },
                ],
              },
              string: {
                data: {
                  value: pushNotification.title,
                },
              },
            },
          },
          in: {
            data: [
              {
                type_id: containTypeLinkId,
                from_id: containerLinkId,
              },
            ],
          },
        },
        {
          type_id: bodyTypeLinkId,
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              in: {
                data: [
                  {
                    type_id: containTypeLinkId,
                    from_id: containerLinkId,
                  },
                ],
              },
              string: {
                data: {
                  value: pushNotification.body,
                },
              },
            },
          },
          in: {
            data: [
              {
                type_id: containTypeLinkId,
                from_id: containerLinkId,
              },
            ],
          },
        },
        ...(pushNotification.image ? [{
          type_id: imageUrlTypeLinkId,
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              in: {
                data: [
                  {
                    type_id: containTypeLinkId,
                    from_id: containerLinkId,
                  },
                ],
              },
              string: {
                data: {
                  value: pushNotification.body,
                },
              },
            },
          },
          in: {
            data: [
              {
                type_id: containTypeLinkId,
                from_id: containerLinkId,
              },
            ],
          },
        }] : [])
      ],
    },
  });

}