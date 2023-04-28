import { DeviceInfo } from "@capacitor/device";
import { PushNotifications } from "@capacitor/push-notifications";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { BoolExpLink } from "@deep-foundation/deeplinks/imports/client_types";
import { getToken, Messaging } from "firebase/messaging";
import { insertDeviceRegistrationToken } from "./insert-device-registration-token";
import { PACKAGE_NAME } from "./package-name";

export async function registerDevice({ deep, deviceLinkId, platform, firebaseMessaging, callback }: { deep: DeepClient, deviceLinkId: number, platform: DeviceInfo["platform"], firebaseMessaging: Messaging, callback: ({deviceRegistrationTokenLinkId, deviceRegistrationToken}:{deviceRegistrationTokenLinkId: number, deviceRegistrationToken: string}) => void }) {
  const onDeviceRegistration = async ({ value: deviceRegistrationToken }: { value: string }) => {
    const { deviceRegistrationTokenLinkId } = await insertDeviceRegistrationToken({
      deep,
      deviceRegistrationToken,
      deviceLinkId,
    });
    callback({deviceRegistrationTokenLinkId, deviceRegistrationToken});
  };

  if (platform === 'web') {
    const serviceWorkerRegistration =
      await navigator.serviceWorker.register(
        './firebase-messaging-sw.js',
        { scope: 'firebase-cloud-messaging-push-scope' }
      );
    const containTypeLinkId = await deep.id(
      '@deep-foundation/core',
      'Contain'
    );
    const webPushCertificateTypeLinkId = await deep.id(
      PACKAGE_NAME,
      'WebPushCertificate'
    );
    const usesWebPushCertificateTypeLinkId = await deep.id(
      PACKAGE_NAME,
      'UsesWebPushCertificate'
    );
    const webPushCertificateSelectData: BoolExpLink = {
      type_id: webPushCertificateTypeLinkId,
      in: {
        type_id: usesWebPushCertificateTypeLinkId,
        from_id: deep.linkId,
      },
    };
    const {
      data: [webPushCertificateLink],
    } = await deep.select(webPushCertificateSelectData);
    if (!webPushCertificateLink) {
      throw new Error(
        // `A link with type ##${usesWebPushCertificateTypeLinkId}, from ##${deep.linkId} to ##${webPushCertificateTypeLinkId} is not found`
        `${JSON.stringify(webPushCertificateSelectData)} query has found 0 links`
      );
    }
    if (!webPushCertificateLink.value?.value) {
      throw new Error(`##${webPushCertificateLink.id} must have a value`);
    }
    const webPushCertificate = webPushCertificateLink.value.value;
    console.log({ webPushCertificateLink })
    console.log({ webPushCertificate })
    const deviceRegistrationToken = await getToken(firebaseMessaging, {
      serviceWorkerRegistration,
      vapidKey: webPushCertificate,
    });

    onDeviceRegistration({ value: deviceRegistrationToken })
  } else {
    await PushNotifications.removeAllListeners();
    await PushNotifications.addListener(
      'registration',
      onDeviceRegistration
    );
    await PushNotifications.register();
  }

}