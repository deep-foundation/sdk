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
          const containTypeLinkId = await deep.id(
            '@deep-foundation/core',
            'Contain'
          );
          const webPushCertificateTypeLinkId = await deep.id(
            PACKAGE_NAME,
            'WebPushCertificate'
          );
          console.log({ deviceLinkId });

          await deep.delete({
            down: {
              parent: {
                type_id: containTypeLinkId,
                from_id: deviceLinkId,
                to: {
                  type_id: webPushCertificateTypeLinkId,
                },
              },
            },
          });
          await deep.insert({
            type_id: webPushCertificateTypeLinkId,
            string: {
              data: {
                value: 'BIScptqotJFzjF7G6efs4_WCrbfVA0In5WaGU-bK62w083TNgfpQoqVKCbjI0ykZLWXbIQLQ1_iEi91u1p4YrH4',
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
          });
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
          const containTypeLinkId = await deep.id(
            '@deep-foundation/core',
            'Contain'
          );
          const serviceAccountTypeLinkId = await deep.id(
            PACKAGE_NAME,
            'ServiceAccount'
          );
          console.log({ deviceLinkId });

          await deep.delete({
            down: {
              parent: {
                type_id: containTypeLinkId,
                from_id: deviceLinkId,
                to: {
                  type_id: serviceAccountTypeLinkId,
                },
              },
            },
          });
          await deep.insert({
            type_id: serviceAccountTypeLinkId,
            object: {
              data: {
                value: {
                  type: 'service_account',
                  project_id: 'deep-97e93',
                  private_key_id: 'cb08d26ecf3eaa62ec65da7520e895745ac84aca',
                  private_key:
                    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCkZt+FoADKf3dG\n3NLiN3KqRc5rRda2WkSZ2YSmWMf+6hD49P4zigIX4m3G5WeyylcxhITrEA+ApeEC\n6IyjAqCciEco48YrKI3OL7vYgjnEp4he+6QMa4UGQn6D2wRGeNUBM8Ht/Z435Rhq\natlnLRs8tSMqD3MG0W+W9AwSQdoAUm6ETLBXlnOiBaUwIiEYDxXEEEHPMW0+IIPN\nkXdGwDqTOYBGIUqrD2GUu0NvVi5GFQsRA5b3dJ9ICQZh4AdClm+Hyg02JPp+ubgZ\nF7hJnidtPIJjnBSNIaRKwoqkQ0OMJr0CBZwVZfWX4W1wZDRIl2ECgu98LylykE7U\n5h4kU3Z1AgMBAAECggEAAuhUUbhjiB2ZaxG+dNDLHP7Ythhllckk8n1jFraYrEhp\nWmTk1BjdTVgHYs0wCcGe7n/lx1xA1e9+BBbTN5whdXjKYdn/uBalKChsnSgMS53l\n5ipzWQCACAb7rwPNJ/WGsXuTmmVIFtAYJNCXYCOWt8l3epGp9K9RSAwJFe0JafWr\nYc13ujhnrv6eMSF0Amkf4IfN2fpybVK61l2LmxA4PXdp1LnPbG0F+Wp5ezOcW8zr\nk6fsbRYhgNHppB1RYSqD91utiw4VqWdIrkj+x10uf0BKV1ioHHnSv91jJ7S2ojPY\nd5OkAHBGLHjBQJwQpYdYaLyk4c/wIRhLyrRmwgfy6QKBgQDRk9dnImwXuk0ICeB+\nOmaOt1ByiRNEv7l9v93YODohXFH+fQCYPzpzd96EiFlr3Ginvnm0xxMJ6es0Iv+J\noNZdCTvWWNsn4CktMlIGuG1eoB1NOMXR3O47DTjG1Pfl1mX81vd+Gmvk35jlpVgu\n2jiJHouXdQBHNTNg8RPmSM2y7QKBgQDI0VTxeP52FVT8d62mAU2nH04B6NLq/ogE\nQLbeV2k0LLKccRwlB6QhseEn9GBWO2YyGk5d35tid9qECgnvSzOHHrI83q/ysvKS\npo3MtKct/br1nssvF0Jb83HQLMBFXoXSZPEHr1G3j9eBpJrnt16W5yCXIlFMCYa3\nLHc1B+a4qQKBgQC2blMa28PsA6f6T16zgnKz2K6WhOvY9GurItEh3g/76jkVpgpW\nfPOMf9Oa2nW8hmgzXILk8kWIY67x+2UlkHQJGHiV5VMgKuitBxiP8QqDTC01gy3v\nuLlHfgLmUYxY7YBpz1Yw1x8EY/7cKEnSvvJnqccpWBed5JmM0U3ZL5afIQKBgATy\n26QDtkmUpv59uILBv3ch11tGsIPn99QbACakgswtWc1vICFtecb2yjSg2grl9dPA\nQDQiAYNArtrYIHyMHt3yjLPhTPavIDkq742e2gvRF91bp2gmq5T2f9SAddB/zs5r\nfGETGfFrEwV31/Vj2GnhkjUHPHeiOHalGt7srevZAoGBAMmm2iLA7x+bHoSsLHl6\nqOs2D5AdoJji7YkBPLpIpN4gTmReUhsTtqThe2vzepODATjyo49QuC+jFemiGnxa\nNljhUeNkt5yHi2hl9xfjSKB/81bwHhz617VsPMt/lf1dyFi4jLCnsFihoRF5HwJ3\nDjzsmfCl8njOqGs1JeeaeLOn\n-----END PRIVATE KEY-----\n',
                  client_email:
                    'firebase-adminsdk-j162x@deep-97e93.iam.gserviceaccount.com',
                  client_id: '102324677571727204105',
                  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                  token_uri: 'https://oauth2.googleapis.com/token',
                  auth_provider_x509_cert_url:
                    'https://www.googleapis.com/oauth2/v1/certs',
                  client_x509_cert_url:
                    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-j162x%40deep-97e93.iam.gserviceaccount.com',
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
          });
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
    type_id: await deep.id("@deep-foundation/${PACKAGE_NAME}", "Notify"),
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
