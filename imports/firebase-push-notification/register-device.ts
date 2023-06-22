import { DeviceInfo } from '@capacitor/device';
import { PushNotifications } from '@capacitor/push-notifications';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { BoolExpLink } from '@deep-foundation/deeplinks/imports/client_types';
import { getToken, Messaging, onMessage } from 'firebase/messaging';
import { insertDeviceRegistrationToken } from './insert-device-registration-token';
import { PACKAGE_NAME } from './package-name';

export async function registerDevice({
  deep,
  deviceLinkId,
  platform,
  firebaseMessaging,
  callback,
}: {
  deep: DeepClient;
  deviceLinkId: number;
  platform: DeviceInfo['platform'];
  firebaseMessaging: Messaging;
  callback: ({
    deviceRegistrationTokenLinkId,
    deviceRegistrationToken,
  }: {
    deviceRegistrationTokenLinkId: number;
    deviceRegistrationToken: string;
  }) => void;
}) {
  const onDeviceRegistration = async ({
    value: deviceRegistrationToken,
  }: {
    value: string;
  }) => {
    const { deviceRegistrationTokenLinkId } =
      await insertDeviceRegistrationToken({
        deep,
        deviceRegistrationToken,
        deviceLinkId,
      });
    callback({ deviceRegistrationTokenLinkId, deviceRegistrationToken });
  };

  if (platform === 'web') {
    const serviceWorkerRegistration = await navigator.serviceWorker.register(
      './firebase-messaging-sw.js',
      { scope: 'firebase-cloud-messaging-push-scope' }
    );

    const webPushCertificateLink = await getPushCertificateLink({ deep });
    const webPushCertificate = webPushCertificateLink.value.value;

    const deviceRegistrationToken = await getToken(firebaseMessaging, {
      serviceWorkerRegistration,
      vapidKey: webPushCertificate,
    });

    onDeviceRegistration({ value: deviceRegistrationToken });

    onMessage(firebaseMessaging, async (payload) => {
      console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
      );

      // Let's check if the browser supports notifications
      if (!('Notification' in window)) {
        throw new Error('This browser does not support desktop notification');
      }

      // Let's check whether notification permissions have already been granted
      else if (Notification.permission === 'granted') {
        // If it's okay, let's create a notification
        new Notification(payload.notification.title, payload.notification);
      }

      // Otherwise, we need to ask the user for permission
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
          // If the user accepts, let's create a notification
          if (permission === 'granted') {
            new Notification(payload.notification.title, payload.notification);
          }
        });
      }
    });
  } else {
    await PushNotifications.removeAllListeners();
    await PushNotifications.addListener('registration', onDeviceRegistration);
    await PushNotifications.register();
  }
}

async function getPushCertificateLink({ deep }: { deep: DeepClient }) {
  const webPushCertificateTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'WebPushCertificate'
  );
  const usesWebPushCertificateTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'UsesWebPushCertificate'
  );
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const selectData: BoolExpLink = {
    _or: [
      {
        type_id: webPushCertificateTypeLinkId,
        in: {
          type_id: containTypeLinkId,
          from_id: deep.linkId,
        },
      },
      {
        type_id: usesWebPushCertificateTypeLinkId,
        from_id: deep.linkId,
      },
    ],
  };
  const { data } = await deep.select(selectData);
  let webPushCertificateLink;
  if (data.length === 0) {
    throw new Error(
      `Select with data ${JSON.stringify(selectData)} returned empty result`
    );
  }
  const usesWebPushCertificateLinks = data.filter(
    (link) => link.type_id === usesWebPushCertificateTypeLinkId
  );
  if (usesWebPushCertificateLinks.length > 1) {
    throw new Error(
      `Select with data ${JSON.stringify(
        selectData
      )} returned more than one link of type ##${usesWebPushCertificateTypeLinkId}: ${usesWebPushCertificateLinks
        .map((link) => `##${link.id}`)
        .join(',')}`
    );
  } else if (usesWebPushCertificateLinks.length === 1) {
    const usesWebPushCertificateLink = usesWebPushCertificateLinks[0];
    webPushCertificateLink = data.find(
      (link) => link.id === usesWebPushCertificateLink.to_id
    );
  } else {
    const webPushCertificateLinks = data.filter(
      (link) => link.type_id === webPushCertificateTypeLinkId
    );
    if (webPushCertificateLinks.length > 1) {
      throw new Error(
        `Select with data ${JSON.stringify(
          selectData
        )} returned more than one link of type ##${webPushCertificateTypeLinkId}: ${webPushCertificateLinks
          .map((link) => `##${link.id}`)
          .join(',')}`
      );
    }
    webPushCertificateLink = webPushCertificateLinks[0];
  }
  if (!webPushCertificateLink) {
    throw new Error(
      // `A link with type ##${usesWebPushCertificateTypeLinkId}, from ##${deep.linkId} to ##${webPushCertificateTypeLinkId} is not found`
      `${JSON.stringify(selectData)} query has found 0 links`
    );
  }
  if (!webPushCertificateLink.value?.value) {
    throw new Error(`##${webPushCertificateLink.id} must have a value`);
  }
  return webPushCertificateLink;
}
