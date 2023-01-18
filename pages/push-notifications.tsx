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
        onClick={() => {
          const listenPushNotifications = async () => {
            console.log({platform});
            
            if (platform === 'web') {
              onMessage(firebaseMessaging, (payload) => {
                const insertPushNotificationToDeep = async () => {
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
                insertPushNotificationToDeep()
              });
            } else {
              await PushNotifications.addListener(
                'pushNotificationReceived',
                async (notification) => {
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
                        value: notification.title,
                      },
                    },
                    in: {
                      data: {
                        type_id: containTypeLinkId,
                        from_id: notificationLinkId,
                      },
                    },
                  });

                  const subtitleTypeLinkId = await deep.id(
                    PACKAGE_NAME,
                    'Subtitle'
                  );
                  await deep.insert({
                    type_id: subtitleTypeLinkId,
                    string: {
                      data: {
                        value: notification.subtitle,
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
                        value: notification.body,
                      },
                    },
                    in: {
                      data: {
                        type_id: containTypeLinkId,
                        from_id: notificationLinkId,
                      },
                    },
                  });

                  const idTypeLinkId = await deep.id(PACKAGE_NAME, 'Id');
                  await deep.insert({
                    type_id: idTypeLinkId,
                    string: {
                      data: {
                        value: notification.id,
                      },
                    },
                    in: {
                      data: {
                        type_id: containTypeLinkId,
                        from_id: notificationLinkId,
                      },
                    },
                  });

                  const tagTypeLinkId = await deep.id(PACKAGE_NAME, 'Tag');
                  await deep.insert({
                    type_id: tagTypeLinkId,
                    string: {
                      data: {
                        value: notification.tag,
                      },
                    },
                    in: {
                      data: {
                        type_id: containTypeLinkId,
                        from_id: notificationLinkId,
                      },
                    },
                  });

                  const badgeTypeLinkId = await deep.id(PACKAGE_NAME, 'Badge');
                  await deep.insert({
                    type_id: badgeTypeLinkId,
                    number: {
                      data: {
                        value: notification.badge,
                      },
                    },
                    in: {
                      data: {
                        type_id: containTypeLinkId,
                        from_id: notificationLinkId,
                      },
                    },
                  });

                  const payloadTypeLinkId = await deep.id(
                    PACKAGE_NAME,
                    'Payload'
                  );
                  await deep.insert({
                    type_id: payloadTypeLinkId,
                    object: {
                      data: {
                        value: notification.data,
                      },
                    },
                    in: {
                      data: {
                        type_id: containTypeLinkId,
                        from_id: notificationLinkId,
                      },
                    },
                  });

                  const clickActionTypeLinkId = await deep.id(
                    PACKAGE_NAME,
                    'ClickAction'
                  );
                  await deep.insert({
                    type_id: clickActionTypeLinkId,
                    string: {
                      data: {
                        value: notification.click_action,
                      },
                    },
                    in: {
                      data: {
                        type_id: containTypeLinkId,
                        from_id: notificationLinkId,
                      },
                    },
                  });

                  const deepLinkTypeLinkId = await deep.id(
                    PACKAGE_NAME,
                    'DeepLink'
                  );
                  await deep.insert({
                    type_id: deepLinkTypeLinkId,
                    string: {
                      data: {
                        value: notification.link,
                      },
                    },
                    in: {
                      data: {
                        type_id: containTypeLinkId,
                        from_id: notificationLinkId,
                      },
                    },
                  });

                  const groupTypeLinkId = await deep.id(PACKAGE_NAME, 'Group');
                  await deep.insert({
                    type_id: groupTypeLinkId,
                    string: {
                      data: {
                        value: notification.group,
                      },
                    },
                    in: {
                      data: {
                        type_id: containTypeLinkId,
                        from_id: notificationLinkId,
                      },
                    },
                  });

                  if (notification.groupSummary) {
                    const isGroupSummaryTypeLinkId = await deep.id(
                      PACKAGE_NAME,
                      'IsGroupSummary'
                    );
                    await deep.insert({
                      type_id: isGroupSummaryTypeLinkId,
                      in: {
                        data: {
                          type_id: containTypeLinkId,
                          from_id: notificationLinkId,
                        },
                      },
                    });
                  }
                }
              );
            }
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
