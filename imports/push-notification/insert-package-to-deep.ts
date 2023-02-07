import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";
import { PACKAGE_NAME as DEVICE_PACKAGE_NAME } from "../device/package-name";


export async function insertPackageToDeep({deep}:{deep: DeepClient}) {
  const typeTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Type'
  );
  const containTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Contain'
  );
  const packageTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Package'
  );
  const joinTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Join'
  );
  const valueTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Value'
  );
  const stringTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'String'
  );
  const numberTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Number'
  );
  const objectTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Object'
  );
  const anyTypeLinkId = await deep.id(
    "@deep-foundation/core",
    "Any"
  )
  const deviceTypeLinkId = await deep.id(
    DEVICE_PACKAGE_NAME,
    'Device'
  );

  const {
    data: [{ id: packageLinkId }],
  } = await deep.insert({
    type_id: packageTypeLinkId,
    string: { data: { value: PACKAGE_NAME } },
    in: {
      data: [
        {
          type_id: containTypeLinkId,
          from_id: deep.linkId,
        },
      ],
    },
    out: {
      data: [
        {
          type_id: joinTypeLinkId,
          to_id: await deep.id('deep', 'users', 'packages'),
        },
        {
          type_id: joinTypeLinkId,
          to_id: await deep.id('deep', 'admin'),
        },
      ],
    },
  });

  const {
    data: [{ id: notificationTypeLinkId }],
  } = await deep.insert([{
    type_id: typeTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: 'Notification' } },
      },
    },
    out: {
      data: [
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'Title' } },
            },
          },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'Body' } },
            },
          },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'IconUrl' } },
            },
          },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'ImageUrl' } },
            },
          },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'Subtitle' } },
            },
          },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'Id' } },
            },
          },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'Badge' } },
            },
          },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'Payload' } },
            },
          },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'ClickAction' } },
            },
          },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'DeepLink' } },
            },
          },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'Group' } },
            },
          },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'IsGroupSummary' } },
            },
          },
        },
        
      ]
    }
  },
  {
    type_id: typeTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: 'WebPushCertificate' } },
      },
    },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId,
      },
    },
  },
  {
    type_id: typeTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: 'DeviceRegistrationToken' } },
      },
    },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId,
      },
    },
  },
  {
    type_id: typeTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: 'ServiceAccount' } },
      },
    },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId,
      },
    },
  }
]);

  const {data: [{id: notifyTypeLinkId}]} = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: await deep.id(PACKAGE_NAME, "Notification"),
    to_id: deviceTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: 'Notify' } },
      },
    },
  })

  const fileTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'SyncTextFile'
  );
  const fileWithCodeOfHandlerName = 'FileWithCodeOfHandlerName';
  const supportsJsLinkId = await deep.id(
    '@deep-foundation/core',
    'dockerSupportsJs' /* | "plv8SupportsJs" */
  );
  const handlerTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Handler'
  );
  const handlerName = 'HandlerName';
  const handleOperationLinkId = await deep.id(
    '@deep-foundation/core',
    'HandleInsert' /* | HandleUpdate | HandleDelete */
  );
  const handleName = 'HandleName';
  const code = `

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
      credential: firebaseAdmin.credential.cert(JSON.parse(serviceAccountLink.value.value))
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
        const { data: linkWithPushNotificationIconUrlString } = await deep.select({
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
         console.log({linkWithPushNotificationIconUrlString})
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
        const { data: linkWithPushNotificationImageUrlString } = await deep.select({
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
      const iconUrl = getPushNotificationIconUrl();
      if (iconUrl) {
        pushNotificationData.iconUrl = iconUrl;
      }
      const imageUrl = getPushNotificationImageUrl();
      if (imageUrl) {
        pushNotificationData.imageUrl = imageUrl;
      }
      return pushNotificationData;
    };
    const pushNotificationData = await getPushNotificationData();
    return await firebaseAdmin.messaging(firebaseApplication).send(pushNotificationData);
  }
  
  `;

  // await deep.insert({
  //   type_id: fileTypeLinkId,
  //   in: {
  //     data: [
  //       {
  //         type_id: containTypeLinkId,
  //         from_id: packageLinkId, // before created package
  //         string: { data: { value: fileWithCodeOfHandlerName } },
  //       },
  //       {
  //         from_id: supportsJsLinkId,
  //         type_id: handlerTypeLinkId,
  //         in: {
  //           data: [
  //             {
  //               type_id: containTypeLinkId,
  //               from_id: packageLinkId, // before created package
  //               string: { data: { value: handlerName } },
  //             },
  //             {
  //               type_id: handleOperationLinkId,
  //               // The type of link which operation will trigger handler. Example: insert handle will be triggered if you insert a link with this type_id
  //               from_id: notifyTypeLinkId,
  //               in: {
  //                 data: [
  //                   {
  //                     type_id: containTypeLinkId,
  //                     from_id: packageLinkId, // before created package
  //                     string: { data: { value: handleName } },
  //                   },
  //                 ],
  //               },
  //             },
  //           ],
  //         },
  //       },
  //     ],
  //   },
  //   string: {
  //     data: {
  //       value: code,
  //     },
  //   },
  // });
};