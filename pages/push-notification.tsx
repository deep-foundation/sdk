import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import {
  Button,
  ChakraProvider,
  Input,
  Link,
  Stack,
  Text,
  Divider,
  Textarea,
  Code,
} from '@chakra-ui/react';
import { PACKAGE_NAME as DEVICE_PACKAGE_NAME } from '../imports/device/package-name';
import { Provider } from '../imports/provider';
import { PushNotifications } from '@capacitor/push-notifications';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Device } from '@capacitor/device';
import {
  getMessaging,
  getToken,
  Messaging,
  onMessage,
} from 'firebase/messaging';
import { insertOrUpdateDeviceRegistrationToken } from '../imports/push-notification/insert-or-update-device-registration-token';
import { PACKAGE_NAME } from '../imports/push-notification/package-name';
import { requestPermissions } from '../imports/push-notification/request-permissions';
import { insertWebPushCertificate } from '../imports/push-notification/insert-web-push-certificate';
import { insertServiceAccount } from '../imports/push-notification/insert-service-account';

const firebaseConfig = {
  apiKey: 'AIzaSyAdW-DEUZuYcN-1snWNcL7QvtkNdibT_vY',
  authDomain: 'deep-97e93.firebaseapp.com',
  projectId: 'deep-97e93',
  storageBucket: 'deep-97e93.appspot.com',
  messagingSenderId: '430972811028',
  appId: '1:430972811028:web:7c43130f8166c437c03401',
  measurementId: 'G-NJ1R8HDWLK',
};

function Page() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );


  const [deviceRegistrationTokenLinkId, setDeviceRegistrationTokenLinkId] =
    useLocalStore('deviceRegistrationToken', undefined);

  const [isPermissionsGranted, setIsPermissionsGranted] = useState(undefined);

  const [platform, setPlatform] = useState(undefined);

  const [firebaseApplication, setFirebaseApplication] =
    useState<FirebaseApp>(undefined);
  const [firebaseMessaging, setFirebaseMessaging] =
    useState<Messaging>(undefined);

  useEffect(() => {
    if (platform === 'web') {
      const firebaseApplication = initializeApp(firebaseConfig);
      self['firebaseApplication'] = firebaseApplication;
      setFirebaseApplication(firebaseApplication);

      const firebaseMessaging = getMessaging(firebaseApplication);
      self['firebaseMessaging'] = firebaseMessaging;
      setFirebaseMessaging(firebaseMessaging);
    }
  }, [platform]);

  useEffect(() => {
    new Promise(async () => {
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
      <Text suppressHydrationWarning>Deep link id: {deep.linkId ?? ' '}</Text>
      <Text suppressHydrationWarning>Device link id: {deviceLinkId ?? ' '}</Text>
      <Text suppressHydrationWarning>
        Device registration token link id: {deviceRegistrationTokenLinkId ?? ' '}
      </Text>
      <Text suppressHydrationWarning>Platform: {platform ?? ' '}</Text>
      <Text suppressHydrationWarning>
        Permissions are {!isPermissionsGranted && 'not'} granted
      </Text>
      <Code display={"block"} whiteSpace={"pre"}>
        {
`
package_name="push-notification" 
npx ts-node "./imports/\${package_name}/install-package.ts"
`
        }
      </Code>
      <Button
        isDisabled={!platform}
        onClick={() => {
          new Promise(async () => {
            if (!platform) {
              return;
            }
            const isPermissionsGranted = await requestPermissions({platform});
            setIsPermissionsGranted(isPermissionsGranted);
          });
        }}
      >
        Request permissions
      </Button>
      <Text>
        WebPushCertificate can be found on{' '}
        <Link
          href={
            'https://console.firebase.google.com/project/PROJECT_ID/settings/cloudmessaging'
          }
        >
          https://console.firebase.google.com/project/PROJECT_ID/settings/cloudmessaging
        </Link>
        . Do not forget to change PROJECT_ID in URL to your project id
      </Text>
      <Button
        onClick={async () => {
          await insertWebPushCertificate({deep,webPushCertificate})
        }}
      >
        Insert Default  WebPushCertificate
      </Button>
      <Text>
        Service Account can be found on{' '}
        <Link
          href={
            'https://console.firebase.google.com/u/0/project/PROJECT_ID/settings/serviceaccounts/adminsdk'
          }
        >
          https://console.firebase.google.com/u/0/project/PROJECT_ID/settings/serviceaccounts/adminsdk
        </Link>
        . Do not forget to change PROJECT_ID in URL to your project id
      </Text>
      <Button
        onClick={async () => {
          await insertServiceAccount({
            deep,
            serviceAccount
          })
        }}
      >
        Insert Default Service Account
      </Button>
      <Button
        onClick={async () => {
          const pushNotificationTypeLinkId = await deep.id(
            PACKAGE_NAME,
            'PushNotification'
          );
          const titleTypeLinkId = await deep.id(PACKAGE_NAME, 'Title');
          const bodyTypeLinkId = await deep.id(PACKAGE_NAME, 'Body');
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
                  from_id: deep.linkId,
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
                            from_id: deep.linkId,
                          },
                        ],
                      },
                      string: {
                        data: {
                          value: 'Title',
                        },
                      },
                    },
                  },
                  in: {
                    data: [
                      {
                        type_id: containTypeLinkId,
                        from_id: deep.linkId,
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
                            from_id: deep.linkId,
                          },
                        ],
                      },
                      string: {
                        data: {
                          value: 'Body',
                        },
                      },
                    },
                  },
                  in: {
                    data: [
                      {
                        type_id: containTypeLinkId,
                        from_id: deep.linkId,
                      },
                    ],
                  },
                },
              ],
            },
          });
        }}
      >
        Insert Default Notification
      </Button>
      <Button
        isDisabled={
          !isPermissionsGranted ||
          !platform ||
          (platform === "web" && !firebaseApplication) ||
          (platform === "web" && !firebaseMessaging)
        }
        onClick={async () => {
          console.log({ platform });
          const onDeviceRegistration = async ({ value: deviceRegistrationToken }: {value: string}) => {
            console.log(`onDeviceRegistration deviceRegistrationToken: ${deviceRegistrationToken}`);
            
            const {deviceRegistrationTokenLinkId} = await insertOrUpdateDeviceRegistrationToken({
              deep,
              deviceRegistrationToken,
              deviceLinkId,
            });
            setDeviceRegistrationTokenLinkId(deviceRegistrationTokenLinkId);
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
            const {
              data: [webPushCertificateLink],
            } = await deep.select({
              type_id: webPushCertificateTypeLinkId,
              in: {
                type_id: containTypeLinkId,
                from_id: deep.linkId,
              },
            });
            if (!webPushCertificateLink) {
              throw new Error(
                `A link with type ${webPushCertificateTypeLinkId} is not found`
              );
            }
            if (!webPushCertificateLink.value?.value) {
              throw new Error(`${webPushCertificateLink} must have a value`);
            }
            const webPushCertificate = webPushCertificateLink.value.value;
            console.log({webPushCertificateLink})
            console.log({webPushCertificate})
            const deviceRegistrationToken = await getToken(firebaseMessaging, {
              serviceWorkerRegistration,
              vapidKey: webPushCertificate,
            });

            onDeviceRegistration({value: deviceRegistrationToken})
          } else {
            await PushNotifications.removeAllListeners();
            await PushNotifications.addListener(
              'registration',
              onDeviceRegistration
            );
            await PushNotifications.register();
          }
        }}
      >
        Register
      </Button>
      <Text>After using these buttons insert a link with type Notify from PushNotification to device. You should get a notification after that.</Text>
      <Code display={"block"} whiteSpace={"pre"}>
{
  `
await deep.insert({
    type_id: await deep.id("${PACKAGE_NAME}", "Notify"),
    from_id: pushNotificationLinkId, 
    to_id: deviceLinkId, 
    in: {data: {type_id: await deep.id("@deep-foundation/core", "Contain"), from_id: deep.linkId}}
})
  `
}
      </Code>
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
