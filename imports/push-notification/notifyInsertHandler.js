async ({ require, deep, data: { newLink: notifyLink, triggeredByLinkId } }) => {
  const firebaseAdmin = require("firebase-admin");

  const notificationLinkId = notifyLink.from_id;
  const deviceLinkId = notifyLink.to_id;

  const getDeviceRegistrationToken = async () => {
    const { data: deviceRegistrationTokenLinks } = await deep.select({
      type_id: {
        _id: ["@deep-foundation/push-notifications", "DeviceRegistrationToken"]
      },
      in: {
        type_id: {
          _id: ["@deep-foundation/core", "Contain"]
        },
        from_id: deviceLinkId
      }
    });
    if (deviceRegistrationTokenLinks.length === 0) {
      throw new Error("Device must have contained DeviceRegistrationToken to be nofified")
    }
    const deviceRegistrationTokenLink = deviceRegistrationTokenLinks[0];
    if (!deviceRegistrationTokenLink.value?.value) {
      throw new Error("DeviceRegistrationToken must have value")
    }
    return deviceRegistrationTokenLink.value.value;
  }
  const deviceRegistrationToken = await getDeviceRegistrationToken();

  const getWebPushCertificateLink = async () => {
    const { data: [webPushCertificateLink] } = await deep.select({
      type_id: {
        _id: ["@deep-foundation/push-notifications", "WebPushCertificate"]
      },
      in: {
        type_id: {
          _id: ["@deep-foundation/core", "Contain"]
        },
        from_id: triggeredByLinkId
      }
    });
    if (!webPushCertificateLink) {
      throw new Error("##deep.linkId must have contained WebPushCertificate to be able to notify")
    }
    if (!webPushCertificateLink.value?.value) {
      throw new Error("##webPushCertificateLink must have value")
    }
    return webPushCertificateLink;
  }
  const webPushCertificateLink = await getWebPushCertificateLink();

  const { data: [serviceAccountLink] } = await deep.select({
    type_id: {
      _id: ["@deep-foundation/push-notifications", "ServiceAccount"]
    },
    in: {
      type_id: {
        _id: ["@deep-foundation/core", "Contain"]
      },
      from_id: triggeredByLinkId
    }
  });
  if (!serviceAccountLink) {
    // throw new Error("##triggeredByLinkId must have contained a link with type //{await deep.id("@deep-foundation/push-notifications", "ServiceAccount")}")
  }
  if (!serviceAccountLink.value?.value) {
    // throw new Error("##serviceAccountLink.id must have value")
  }

  const firebaseApplication = firebaseAdmin.apps.length === 0 ? firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccountLink.value.value)
  }) : firebaseAdmin.app()

  const getPushNotificationData = async () => {
    const getPushNotificationTitle = async () => {
      const notificationTitleTypeLinkId = await deep.id("@deep-foundation/push-notifications", "Title")
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
        throw new Error("To notify ##deviceLinkId by ##notificationLinkId a link with type ##notificationTitleTypeLinkId must exist")
      }
      if (!linkWithPushNotificationTitleString.value?.value) {
        throw new Error("##linkWithPushNotificationTitleString must have value")
      }
      return linkWithPushNotificationTitleString.value.value;
    };

    const getPushNotificationBody = async () => {
      const notificationBodyTypeLinkId = await deep.id("@deep-foundation/push-notifications", "Body")
      const { data: [linkWithPushNotificationBodyString] } = await deep.select({
        in: {
          type_id: {
            _id: ["@deep-foundation/push-notifications", "Body"]
          },
          from_id: notificationLinkId
        }
      });
      if (!linkWithPushNotificationBodyString) {
        throw new Error("To notify ##deviceLinkId by ##notificationLinkId a link with type ##notificationBodyTypeLinkId must exist")
      }
      if (!linkWithPushNotificationBodyString.value?.value) {
        throw new Error("##linkWithPushNotificationBodyString must have value")
      }
      return linkWithPushNotificationBodyString.value.value;
    };


    const getPushNotificationIconUrl = async () => {
      const notificationIconUrlTypeLinkId = await deep.id("@deep-foundation/push-notifications", "Body")
      const { data: [linkWithPushNotificationIconUrlString] } = await deep.select({
        type_id: {
          _id: ["@deep-foundation/push-notifications", "PushNotificationIconUrl"]
        },
        in: {
          type_id: {
            _id: ["@deep-foundation/core", "Contain"]
          },
          from_id: notificationLinkId
        }
      });
      console.log({ linkWithPushNotificationIconUrlString })
      if (!linkWithPushNotificationIconUrlString) {
        return undefined;
      }
      if (!linkWithPushNotificationIconUrlString.value?.value) {
        throw new Error("##linkWithPushNotificationIconUrlString must have value")
      }
      return linkWithPushNotificationIconUrlString.value.value;
    };


    const getPushNotificationImageUrl = async () => {
      const notificationImageUrlTypeLinkId = await deep.id("@deep-foundation/push-notifications", "Body")
      const { data: [linkWithPushNotificationImageUrlString] } = await deep.select({
        type_id: {
          _id: ["@deep-foundation/push-notifications", "PushNotificationImageUrl"]
        },
        in: {
          type_id: {
            _id: ["@deep-foundation/core", "Contain"]
          },
          from_id: notificationLinkId
        }
      });
      if (!linkWithPushNotificationImageUrlString) {
        return undefined;
      }
      if (!linkWithPushNotificationImageUrlString.value?.value) {
        throw new Error("##linkWithPushNotificationImageUrlString must have value")
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
    const iconUrl = await getPushNotificationIconUrl();
    if (iconUrl) {
      pushNotificationData.iconUrl = iconUrl;
    }
    const imageUrl = await getPushNotificationImageUrl();
    if (imageUrl) {
      pushNotificationData.imageUrl = imageUrl;
    }
    return pushNotificationData;
  };
  const pushNotificationData = await getPushNotificationData();
  return await firebaseAdmin.messaging(firebaseApplication).send(pushNotificationData);
}

