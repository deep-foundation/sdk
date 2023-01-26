import React, { useCallback, useEffect, useState } from 'react';
import { TokenProvider } from '@deep-foundation/deeplinks/imports/react-token';
import {
  LocalStoreProvider,
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
  useDeepSubscription,
} from '@deep-foundation/deeplinks/imports/client';

import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { saveGeneralInfo } from '../imports/device/save-general-info';
import { initializePackage } from '../imports/device/initialize-package';
import { PACKAGE_NAME as DEVICE_PACKAGE_NAME } from '../imports/device/package-name';
import { getBatteryInfo as saveBatteryInfo } from '../imports/device/save-battery-info';
import { getLanguageId as saveLanguageId } from '../imports/device/save-language-id';
import { getLanguageTag as saveLanguageTag } from '../imports/device/save-language-tag';
import { Provider } from '../imports/provider';
import { PushNotifications } from '@capacitor/push-notifications';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { Device } from '@capacitor/device';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { onBackgroundMessage } from "firebase/messaging/sw";
import { insertPushNotificationToDeep } from '../imports/push-notifications/insertPushNotificationToDeep';

const firebaseConfig = {
  apiKey: 'AIzaSyAdW-DEUZuYcN-1snWNcL7QvtkNdibT_vY',
  authDomain: 'deep-97e93.firebaseapp.com',
  projectId: 'deep-97e93',
  storageBucket: 'deep-97e93.appspot.com',
  messagingSenderId: '430972811028',
  appId: '1:430972811028:web:7c43130f8166c437c03401',
  measurementId: 'G-NJ1R8HDWLK',
};

const PACKAGE_NAME = '@deep-foundation/push-notifications';

function Page() {
  const deep = useDeep();
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  // TODO Do not let to use functionality if package is not initialized. Do not do this TODO until bug with twice rerender caused by useDeepSubsciption is fixed
  const [isPackageInitialized, setIsPackageInitialized] = useState(undefined);

  const [deviceRegistrationTokenLinkId, setDeviceRegistrationTokenLinkId] =
    useLocalStore('deviceRegistrationToken', undefined);

  const [isPermissionsGranted, setIsPermissionsGranted] = useState(undefined);

  const [platform, setPlatform] = useState(undefined);

  const [firebaseApplication, setFirebaseApplication] = useState(undefined);
  const [firebaseMessaging, setFirebaseMessaging] = useState(undefined);

  useEffect(() => {
    const firebaseApplication = initializeApp(firebaseConfig);
    setFirebaseApplication(firebaseApplication);

    const firebaseMessaging = getMessaging(firebaseApplication);
    setFirebaseMessaging(firebaseMessaging);
  }, []);

  useEffect(() => {
    new Promise(async () => {
      // TODO: Get platform from deep
      // const {data: [platformLink]} = await deep.select({
      //   type_id: {
      //     _id: ["@deep-foundation/core", "Contain"]
      //   },
      //   from_id: deviceLinkId,
      //   to: {
      //     type_id: {
      //       _id: ["@deep-foundation/device", "Platform"]
      //     }
      //   }
      // });
      // const platform = platformLink.value.value;
      // setPlatform(platform);

      const deviceInfo = await Device.getInfo();
      setPlatform(deviceInfo.platform);
    });
  }, []);

  useEffect(() => {
    new Promise(async () => {
      let isPermissionsGranted: boolean;
      if (!platform) {
        return;
      } else if (platform === 'web') {
        isPermissionsGranted = Notification.permission === 'granted';
      } else {
        let permissionsStatus = await PushNotifications.checkPermissions();
        isPermissionsGranted = permissionsStatus.receive === 'granted';
      }

      setIsPermissionsGranted(isPermissionsGranted);
    });
  }, [deviceLinkId, deviceRegistrationTokenLinkId, platform]);

  return (
    <Stack>
      <Text>Device link id{deviceLinkId}</Text>
      <Text>
        Device registration token link id {deviceRegistrationTokenLinkId}
      </Text>
      <Text>Platform: {platform}</Text>
      <Text>Permissions are {!isPermissionsGranted && 'not'} granted</Text>
      <Button
        onClick={() => {
          const initializePackage = async () => {
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
            } = await deep.insert({
              type_id: typeTypeLinkId,
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'Notification' } },
                },
              },
            });

            const {
              data: [{ id: deviceRegistrationTokenTypeLinkId }],
            } = await deep.insert({
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
            });

            const {
              data: [{ id: titleTypeLinkId }],
            } = await deep.insert({
              type_id: typeTypeLinkId,
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'Title' } },
                },
              },
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId,
                },
              },
            });

            const {
              data: [{ id: subtitleTypeLinkId }],
            } = await deep.insert({
              type_id: typeTypeLinkId,
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'Subtitle' } },
                },
              },
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId,
                },
              },
            });

            const {
              data: [{ id: bodyTypeLinkId }],
            } = await deep.insert({
              type_id: typeTypeLinkId,
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'Body' } },
                },
              },
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId,
                },
              },
            });

            const {
              data: [{ id: idTypeLinkId }],
            } = await deep.insert({
              type_id: typeTypeLinkId,
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'Id' } },
                },
              },
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId,
                },
              },
            });

            const {
              data: [{ id: badgeTypeLinkId }],
            } = await deep.insert({
              type_id: typeTypeLinkId,
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'Badge' } },
                },
              },
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: numberTypeLinkId,
                },
              },
            });

            const {
              data: [{ id: payloadTypeLinkId }],
            } = await deep.insert({
              type_id: typeTypeLinkId,
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'Payload' } },
                },
              },
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: objectTypeLinkId,
                },
              },
            });

            const {
              data: [{ id: clickActionTypeLinkId }],
            } = await deep.insert({
              type_id: typeTypeLinkId,
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'ClickAction' } },
                },
              },
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId,
                },
              },
            });

            const {
              data: [{ id: deepLinkTypeLinkId }],
            } = await deep.insert({
              type_id: typeTypeLinkId,
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'DeepLink' } },
                },
              },
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId,
                },
              },
            });

            const {
              data: [{ id: groupTypeLinkId }],
            } = await deep.insert({
              type_id: typeTypeLinkId,
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'Group' } },
                },
              },
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId,
                },
              },
            });

            const {
              data: [{ id: isGroupSummaryTypeLinkId }],
            } = await deep.insert({
              type_id: typeTypeLinkId,
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'IsGroupSummary' } },
                },
              },
            });

            const fileTypeLinkId = await deep.id("@deep-foundation/core", "SyncTextFile")
            const fileWithCodeOfHandlerName = "FileWithCodeOfHandlerName";
            const supportsJsLinkId = await deep.id("@deep-foundation/core", "dockerSupportsJs" /* | "plv8SupportsJs" */)
            const handlerTypeLinkId = await deep.id("@deep-foundation/core", "Handler")
            const handlerName = "HandlerName";
            const handleOperationLinkId = await deep.id("@deep-foundation/core", "HandleInsert" /* | HandleUpdate | HandleDelete */);
            const handleName = "HandleName";
            const code = /*javascript*/`
const axios = require('axios');
async ({ deep, data: { newLink: notifyLink, triggeredByLinkId } }) => {
  const notificationLinkId = notifyLink.from_id;
  const deviceLinkId = notifyLink.to_id;

  const getIsPushNotificationNotified = async () => {
    const { data: isNotifiedLinks } = await deep.select({
      type_id: {
        _id: ["@deep-foundation/push-notifications", "IsNotified"]
      },
      to_id: notificationLinkId
    })
    return isNotifiedLinks.length > 0;
  }
  const isPushNotificationNotified = getIsPushNotificationNotified();
  if (isPushNotificationNotified) {
    return;
  }

  const getDeviceRegistrationToken = async () => {
    const { deviceRegistrationTokenLinks } = await deep.select({
      type_id: {
        _id: ["@deep-foundation/push-notifications", "DeviceRegistrationToken"]
      },
      in: {
        data: [{
          type_id: {
            _id: ["@deep-foundation/core", "Contain"]
          },
          from_id: deviceLinkId
        }]
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
  const deviceRegistrationToken = getDeviceRegistrationToken();

  const getWebPushCertificateLink = async () => {
    const { webPushCertificateLinks } = await deep.select({
      type_id: {
        _id: ["@deep-foundation/push-notifications", "WebPushCertificate"]
      },
      in: {
        data: [{
          type_id: {
            _id: ["@deep-foundation/core", "Contain"]
          },
          from_id: triggeredByLinkId
        }]
      }
    });
    if (webPushCertificateLinks.length === 0) {
      throw new Error("User must have contained WebPushCertificate to be able to notify")
    }
    const webPushCertificateLink = webPushCertificateLinks[0];
    if (!webPushCertificateLink.value?.value) {
      throw new Error("WebPushCertificate must have value")
    }
    return webPushCertificateLink;
  }
  const webPushCertificateLink = getWebPushCertificateLink();

  const getPushNotificationData = async () => {
    const getPushNotificationTitle = async () => {
      const { pushNotificationTitleLinks } = await deep.select({
        type_id: {
          _id: ["@deep-foundation/push-notifications", "PushNotificationTitle"]
        },
        in: {
          data: [{
            type_id: {
              _id: ["@deep-foundation/core", "Contain"]
            },
            from_id: notificationLinkId
          }]
        }
      });
      if (pushNotificationTitleLinks.length === 0) {
        throw new Error("Notification must have contained PushNotificationTitle")
      }
      const pushNotificationTitleLink = pushNotificationTitleLinks[0];
      if (!pushNotificationTitleLink.value?.value) {
        throw new Error("PushNotificationTitle must have value")
      }
      return pushNotificationTitleLink.value.value;
    };

    const getPushNotificationBody = async () => {
      const { pushNotificationBodyLinks } = await deep.select({
        type_id: {
          _id: ["@deep-foundation/push-notifications", "PushNotificationBody"]
        },
        in: {
          data: [{
            type_id: {
              _id: ["@deep-foundation/core", "Contain"]
            },
            from_id: notificationLinkId
          }]
        }
      });
      if (pushNotificationBodyLinks.length === 0) {
        throw new Error("Notification must have contained PushNotificationBody")
      }
      const pushNotificationBodyLink = pushNotificationBodyLinks[0];
      if (!pushNotificationBodyLink.value?.value) {
        throw new Error("PushNotificationBody must have value")
      }
      return pushNotificationBodyLink.value.value;
    };

    const getPushNotificationBody = async () => {
      const { pushNotificationBodyLinks } = await deep.select({
        type_id: {
          _id: ["@deep-foundation/push-notifications", "PushNotificationBody"]
        },
        in: {
          data: [{
            type_id: {
              _id: ["@deep-foundation/core", "Contain"]
            },
            from_id: notificationLinkId
          }]
        }
      });
      if (pushNotificationBodyLinks.length === 0) {
        throw new Error("Notification must have contained PushNotificationBody")
      }
      const pushNotificationBodyLink = pushNotificationBodyLinks[0];
      if (!pushNotificationBodyLink.value?.value) {
        throw new Error("PushNotificationBody must have value")
      }
      return pushNotificationBodyLink.value.value;
    };


    const getPushNotificationIconUrl = async () => {
      const { pushNotificationIconUrlLinks } = await deep.select({
        type_id: {
          _id: ["@deep-foundation/push-notifications", "PushNotificationIconUrl"]
        },
        in: {
          data: [{
            type_id: {
              _id: ["@deep-foundation/core", "Contain"]
            },
            from_id: notificationLinkId
          }]
        }
      });
      if (pushNotificationIconUrlLinks.length === 0) {
        return undefined;
      }
      const pushNotificationIconUrlLink = pushNotificationIconUrlLinks[0];
      if (!pushNotificationIconUrlLink.value?.value) {
        throw new Error("PushNotificationIconUrl must have value")
      }
      return pushNotificationIconUrlLink.value.value;
    };


    const getPushNotificationImageUrl = async () => {
      const { pushNotificationImageUrlLinks } = await deep.select({
        type_id: {
          _id: ["@deep-foundation/push-notifications", "PushNotificationImageUrl"]
        },
        in: {
          data: [{
            type_id: {
              _id: ["@deep-foundation/core", "Contain"]
            },
            from_id: notificationLinkId
          }]
        }
      });
      if (pushNotificationImageUrlLinks.length === 0) {
        return undefined;
      }
      const pushNotificationImageUrlLink = pushNotificationImageUrlLinks[0];
      if (!pushNotificationImageUrlLink.value?.value) {
        throw new Error("PushNotificationImageUrl must have value")
      }
      return pushNotificationImageUrlLink.value.value;
    };

    const pushNotificationData = {
      token: deviceRegistrationToken,
      notification: {
        title: getPushNotificationTitle(),
        body: getPushNotificationBodu(),
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
  const pushNotificationData = getPushNotificationData();

  axios({
    method: 'get',
    url: 'https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + webPushCertificateLink.value.value
    },
    data: pushNotificationData
  })
}
              `.trim();

            await deep.insert({
              type_id: fileTypeLinkId,
              in: {
                data: [
                  {
                    type_id: containTypeLinkId,
                    from_id: packageLinkId, // before created package
                    string: { data: { value: fileWithCodeOfHandlerName } },
                  },
                  {
                    from_id: supportsJsLinkId,
                    type_id: handlerTypeLinkId,
                    in: {
                      data: [
                        {
                          type_id: containTypeLinkId,
                          from_id: packageLinkId, // before created package
                          string: { data: { value: handlerName } },
                        },
                        {
                          type_id: handleOperationLinkId,
                          // The type of link which operation will trigger handler. Example: insert handle will be triggered if you insert a link with this type_id
                          from_id: notificationTypeLinkId,
                          in: {
                            data: [
                              {
                                type_id: containTypeLinkId,
                                from_id: packageLinkId, // before created package
                                string: { data: { value: handleName } },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
              },
              string: {
                data: {
                  value: code,
                },
              },
            });
          };
          initializePackage();
        }}
      >
        Initialize package
      </Button>
      <Button
        disabled={!platform}
        onClick={() => {
          new Promise(async () => {
            let isPermissionsGranted: boolean;
            if (!platform) {
              return;
            } else if (platform === 'web') {
              const permissionsStatus = await Notification.requestPermission();
              isPermissionsGranted = permissionsStatus === 'granted';
            } else {
              const permissionsStatus =
                await PushNotifications.requestPermissions();
              isPermissionsGranted = permissionsStatus.receive === 'granted';
            }
            setIsPermissionsGranted(isPermissionsGranted);
          });
        }}
      >
        Request permissions
      </Button>

      <Button
        disabled={
          !isPermissionsGranted ||
          !platform ||
          !firebaseApplication ||
          !firebaseMessaging
        }
        onClick={async () => {
          console.log({ platform });

          const insertDeviceRegistrationTokenToDeep = async (
            deviceRegistrationToken
          ) => {
            const deviceRegistrationTokenTypeLinkId = await deep.id(
              PACKAGE_NAME,
              'DeviceRegistrationToken'
            );
            const containTypeLinkId = await deep.id(
              '@deep-foundation/core',
              'Contain'
            );
            const {
              data: [{ id: deviceRegistrationTokenLinkId }],
            } = await deep.insert({
              type_id: deviceRegistrationTokenTypeLinkId,
              string: {
                data: {
                  value: deviceRegistrationToken,
                },
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: deviceLinkId,
                },
              },
            });

            setDeviceRegistrationTokenLinkId(deviceRegistrationTokenLinkId);
          };

          if (platform === 'web') {
            console.log(firebaseApplication);
            console.log(firebaseMessaging);

            const deviceRegistrationToken = await getToken(firebaseMessaging, {
              vapidKey:
                'BIScptqotJFzjF7G6efs4_WCrbfVA0In5WaGU-bK62w083TNgfpQoqVKCbjI0ykZLWXbIQLQ1_iEi91u1p4YrH4',
            });

            await insertDeviceRegistrationTokenToDeep(deviceRegistrationToken);
          } else {
            await PushNotifications.addListener(
              'registration',
              insertDeviceRegistrationTokenToDeep
            );
            PushNotifications.register();
          }
        }}
      >
        Register
      </Button>
      <Button
        disabled={
          !isPermissionsGranted ||
          !platform ||
          !deviceRegistrationTokenLinkId ||
          !firebaseApplication ||
          !firebaseMessaging
        }
        onClick={async () => {
          const listenPushNotifications = async () => {
            console.log({platform});
            
            // if (platform === 'web') {
              onMessage(firebaseMessaging, async (payload) => {
                await insertPushNotificationToDeep({deep, deviceLinkId, payload});
              });
            // } else {
            //   await PushNotifications.addListener(
            //     'pushNotificationReceived',
            //     async (notification) => {
            //       const notificationTypeLinkId = await deep.id(
            //         PACKAGE_NAME,
            //         'Notification'
            //       );
            //       const containTypeLinkId = await deep.id(
            //         '@deep-foundation/core',
            //         'Contain'
            //       );
            //       const {
            //         data: [{ id: notificationLinkId }],
            //       } = await deep.insert({
            //         type_id: notificationTypeLinkId,
            //         in: {
            //           data: {
            //             type_id: containTypeLinkId,
            //             from_id: deviceLinkId,
            //           },
            //         },
            //       });

            //       const titleTypeLinkId = await deep.id(PACKAGE_NAME, 'Title');
            //       await deep.insert({
            //         type_id: titleTypeLinkId,
            //         string: {
            //           data: {
            //             value: notification.title,
            //           },
            //         },
            //         in: {
            //           data: {
            //             type_id: containTypeLinkId,
            //             from_id: notificationLinkId,
            //           },
            //         },
            //       });

            //       const subtitleTypeLinkId = await deep.id(
            //         PACKAGE_NAME,
            //         'Subtitle'
            //       );
            //       await deep.insert({
            //         type_id: subtitleTypeLinkId,
            //         string: {
            //           data: {
            //             value: notification.subtitle,
            //           },
            //         },
            //         in: {
            //           data: {
            //             type_id: containTypeLinkId,
            //             from_id: notificationLinkId,
            //           },
            //         },
            //       });

            //       const bodyTypeLinkId = await deep.id(PACKAGE_NAME, 'Body');
            //       await deep.insert({
            //         type_id: bodyTypeLinkId,
            //         string: {
            //           data: {
            //             value: notification.body,
            //           },
            //         },
            //         in: {
            //           data: {
            //             type_id: containTypeLinkId,
            //             from_id: notificationLinkId,
            //           },
            //         },
            //       });

            //       const idTypeLinkId = await deep.id(PACKAGE_NAME, 'Id');
            //       await deep.insert({
            //         type_id: idTypeLinkId,
            //         string: {
            //           data: {
            //             value: notification.id,
            //           },
            //         },
            //         in: {
            //           data: {
            //             type_id: containTypeLinkId,
            //             from_id: notificationLinkId,
            //           },
            //         },
            //       });

            //       const tagTypeLinkId = await deep.id(PACKAGE_NAME, 'Tag');
            //       await deep.insert({
            //         type_id: tagTypeLinkId,
            //         string: {
            //           data: {
            //             value: notification.tag,
            //           },
            //         },
            //         in: {
            //           data: {
            //             type_id: containTypeLinkId,
            //             from_id: notificationLinkId,
            //           },
            //         },
            //       });

            //       const badgeTypeLinkId = await deep.id(PACKAGE_NAME, 'Badge');
            //       await deep.insert({
            //         type_id: badgeTypeLinkId,
            //         number: {
            //           data: {
            //             value: notification.badge,
            //           },
            //         },
            //         in: {
            //           data: {
            //             type_id: containTypeLinkId,
            //             from_id: notificationLinkId,
            //           },
            //         },
            //       });

            //       const payloadTypeLinkId = await deep.id(
            //         PACKAGE_NAME,
            //         'Payload'
            //       );
            //       await deep.insert({
            //         type_id: payloadTypeLinkId,
            //         object: {
            //           data: {
            //             value: notification.data,
            //           },
            //         },
            //         in: {
            //           data: {
            //             type_id: containTypeLinkId,
            //             from_id: notificationLinkId,
            //           },
            //         },
            //       });

            //       const clickActionTypeLinkId = await deep.id(
            //         PACKAGE_NAME,
            //         'ClickAction'
            //       );
            //       await deep.insert({
            //         type_id: clickActionTypeLinkId,
            //         string: {
            //           data: {
            //             value: notification.click_action,
            //           },
            //         },
            //         in: {
            //           data: {
            //             type_id: containTypeLinkId,
            //             from_id: notificationLinkId,
            //           },
            //         },
            //       });

            //       const deepLinkTypeLinkId = await deep.id(
            //         PACKAGE_NAME,
            //         'DeepLink'
            //       );
            //       await deep.insert({
            //         type_id: deepLinkTypeLinkId,
            //         string: {
            //           data: {
            //             value: notification.link,
            //           },
            //         },
            //         in: {
            //           data: {
            //             type_id: containTypeLinkId,
            //             from_id: notificationLinkId,
            //           },
            //         },
            //       });

            //       const groupTypeLinkId = await deep.id(PACKAGE_NAME, 'Group');
            //       await deep.insert({
            //         type_id: groupTypeLinkId,
            //         string: {
            //           data: {
            //             value: notification.group,
            //           },
            //         },
            //         in: {
            //           data: {
            //             type_id: containTypeLinkId,
            //             from_id: notificationLinkId,
            //           },
            //         },
            //       });

            //       if (notification.groupSummary) {
            //         const isGroupSummaryTypeLinkId = await deep.id(
            //           PACKAGE_NAME,
            //           'IsGroupSummary'
            //         );
            //         await deep.insert({
            //           type_id: isGroupSummaryTypeLinkId,
            //           in: {
            //             data: {
            //               type_id: containTypeLinkId,
            //               from_id: notificationLinkId,
            //             },
            //           },
            //         });
            //       }
            //     }
            //   );
            // }
          };

          listenPushNotifications();
        }}
      >
        Listen push notifications
      </Button>
    </Stack>
  );
}

export default function PushNotificationsPage() {
  return (
    <ChakraProvider>
      <Provider>
        <DeepProvider>
          <Page />
        </DeepProvider>
      </Provider>
    </ChakraProvider>
  );
}
