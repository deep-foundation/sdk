async ({ require, deep, data: { newLink: notifyLink, triggeredByLinkId } }) => {
  const firebaseAdmin = require("firebase-admin");

  const notificationLinkId = notifyLink.from_id;
  const deviceLinkId = notifyLink.to_id;

  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");

  const getDeviceRegistrationToken = async () => {
    const deviceRegistrationTokenTypeLinkId = await deep.id(deep.linkId, "DeviceRegistrationToken");
    const { data: deviceRegistrationTokenLinks } = await deep.select({
      type_id: deviceRegistrationTokenTypeLinkId,
      in: {
        type_id: containTypeLinkId,
        from_id: deviceLinkId
      }
    });
    if (deviceRegistrationTokenLinks.length === 0) {
      throw new Error(`${deviceLinkId} must have contained a link of type ${deviceRegistrationTokenTypeLinkId}`)
    }
    const deviceRegistrationTokenLink = deviceRegistrationTokenLinks[0];
    if (!deviceRegistrationTokenLink.value?.value) {
      throw new Error(`${deviceRegistrationTokenLink.id} must have value`)
    }
    return deviceRegistrationTokenLink.value.value;
  }
  const deviceRegistrationToken = await getDeviceRegistrationToken();

  const getServiceAccount = async () => {
    const serviceAccountTypeLinkId = await deep.id(deep.linkId, "ServiceAccount");
    const usesServiceAccountTypeLinkId = await deep.id(deep.linkId, "UsesServiceAccount");
    const { data: [serviceAccountLink] } = await deep.select({
      type_id: serviceAccountTypeLinkId,
      in: {
        type_id: usesServiceAccountTypeLinkId,
        from_id: triggeredByLinkId
      }
    });
    if (!serviceAccountLink) {
      throw new Error(`A link of type ##${usesServiceAccountTypeLinkId} and from ${triggeredByLinkId} is not found`)
    }
    if (!serviceAccountLink.value?.value) {
      throw new Error(`##${serviceAccountLink.id} must have value`)
    }
    return serviceAccountLink.value.value;
  }
  const serviceAccount = await getServiceAccount();

  const firebaseApplication = firebaseAdmin.apps.length === 0 ? firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
  }) : firebaseAdmin.app()

  const getPushNotificationData = async () => {
    const getPushNotificationTitle = async () => {
      const notificationTitleTypeLinkId = await deep.id(deep.linkId, "PushNotificationTitle")
      const { data: [linkWithPushNotificationTitleString] } = await deep.select({
        in: {
          type_id: {
            _eq: notificationTitleTypeLinkId
          },
          from_id: {
            _eq: notificationLinkId
          }
        }

      });
      if (!linkWithPushNotificationTitleString) {
        throw new Error(`A link of type ${notificationTitleTypeLinkId} must exist`)
      }
      if (!linkWithPushNotificationTitleString.value?.value) {
        throw new Error(`##${linkWithPushNotificationTitleString.id} must have value`)
      }
      return linkWithPushNotificationTitleString.value.value;
    };

    const getPushNotificationBody = async () => {
      const notificationBodyTypeLinkId = await deep.id(deep.linkId, "PushNotificationBody")
      const { data: [linkWithPushNotificationBodyString] } = await deep.select({
        in: {
          type_id: notificationBodyTypeLinkId,
          from_id: notificationLinkId
        }
      });
      if (!linkWithPushNotificationBodyString) {
        throw new Error(`A link of type ${notificationBodyTypeLinkId} must exist`)
      }
      if (!linkWithPushNotificationBodyString.value?.value) {
        throw new Error(`##${linkWithPushNotificationBodyString.id} must have value`)
      }
      return linkWithPushNotificationBodyString.value.value;
    };

    const getPushNotificationImageUrl = async () => {
      const notificationImageUrlTypeLinkId = await deep.id(deep.linkId, "PushNotificationImageUrl")
      const { data: [linkWithPushNotificationImageUrlString] } = await deep.select({
        type_id: notificationImageUrlTypeLinkId,
        in: {
          type_id: containTypeLinkId,
          from_id: notificationLinkId
        }
      });
      if (!linkWithPushNotificationImageUrlString) {
        return undefined;
      }
      if (!linkWithPushNotificationImageUrlString.value?.value) {
        throw new Error(`##${linkWithPushNotificationImageUrlString.id} must have value`)
      }
      return linkWithPushNotificationImageUrlString.value.value;
    };

    const pushNotificationData = {
      token: deviceRegistrationToken,
      notification: {
        title: await getPushNotificationTitle(),
        body: await getPushNotificationBody(),
      }
    };
    const imageUrl = await getPushNotificationImageUrl();
    if (imageUrl) {
      pushNotificationData.imageUrl = imageUrl;
    }
    return pushNotificationData;
  };
  const pushNotificationData = await getPushNotificationData();
  await firebaseAdmin.messaging(firebaseApplication).send(pushNotificationData);

  await deep.insert({
    type_id: await deep.id(deep.linkId, "Notified"),
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: triggeredByLinkId
      }
    },
    from_id: notifyLink.id,
    to_id: deviceLinkId
  })
}

