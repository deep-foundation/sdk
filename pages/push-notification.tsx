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
import { Button, ChakraProvider, Input, Link, Stack, Text, Divider, Textarea } from '@chakra-ui/react';
import { PACKAGE_NAME as DEVICE_PACKAGE_NAME } from '../imports/device/package-name';
import { Provider } from '../imports/provider';
import { PushNotifications } from '@capacitor/push-notifications';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Device } from '@capacitor/device';
import { getMessaging, getToken, Messaging, onMessage } from 'firebase/messaging';

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

  const [firebaseApplication, setFirebaseApplication] = useState<FirebaseApp>(undefined);
  const [firebaseMessaging, setFirebaseMessaging] = useState<Messaging>(undefined);

  useEffect(() => {
    const firebaseApplication = initializeApp(firebaseConfig);
    window["firebaseApplication"] = firebaseApplication;
    setFirebaseApplication(firebaseApplication);

    const firebaseMessaging = getMessaging(firebaseApplication);
    window["firebaseMessaging"] = firebaseMessaging;
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

  const [webPushCertificate, setWebPushCertificate] = useState<string>("BIScptqotJFzjF7G6efs4_WCrbfVA0In5WaGU-bK62w083TNgfpQoqVKCbjI0ykZLWXbIQLQ1_iEi91u1p4YrH4");
  // const [serviceAccount, setServiceAccount] = useState<string>(`{
  //   "type": "service_account",
  //   "project_id": "deep-97e93",
  //   "private_key_id": "cb08d26ecf3eaa62ec65da7520e895745ac84aca",
  //   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCkZt+FoADKf3dG\n3NLiN3KqRc5rRda2WkSZ2YSmWMf+6hD49P4zigIX4m3G5WeyylcxhITrEA+ApeEC\n6IyjAqCciEco48YrKI3OL7vYgjnEp4he+6QMa4UGQn6D2wRGeNUBM8Ht/Z435Rhq\natlnLRs8tSMqD3MG0W+W9AwSQdoAUm6ETLBXlnOiBaUwIiEYDxXEEEHPMW0+IIPN\nkXdGwDqTOYBGIUqrD2GUu0NvVi5GFQsRA5b3dJ9ICQZh4AdClm+Hyg02JPp+ubgZ\nF7hJnidtPIJjnBSNIaRKwoqkQ0OMJr0CBZwVZfWX4W1wZDRIl2ECgu98LylykE7U\n5h4kU3Z1AgMBAAECggEAAuhUUbhjiB2ZaxG+dNDLHP7Ythhllckk8n1jFraYrEhp\nWmTk1BjdTVgHYs0wCcGe7n/lx1xA1e9+BBbTN5whdXjKYdn/uBalKChsnSgMS53l\n5ipzWQCACAb7rwPNJ/WGsXuTmmVIFtAYJNCXYCOWt8l3epGp9K9RSAwJFe0JafWr\nYc13ujhnrv6eMSF0Amkf4IfN2fpybVK61l2LmxA4PXdp1LnPbG0F+Wp5ezOcW8zr\nk6fsbRYhgNHppB1RYSqD91utiw4VqWdIrkj+x10uf0BKV1ioHHnSv91jJ7S2ojPY\nd5OkAHBGLHjBQJwQpYdYaLyk4c/wIRhLyrRmwgfy6QKBgQDRk9dnImwXuk0ICeB+\nOmaOt1ByiRNEv7l9v93YODohXFH+fQCYPzpzd96EiFlr3Ginvnm0xxMJ6es0Iv+J\noNZdCTvWWNsn4CktMlIGuG1eoB1NOMXR3O47DTjG1Pfl1mX81vd+Gmvk35jlpVgu\n2jiJHouXdQBHNTNg8RPmSM2y7QKBgQDI0VTxeP52FVT8d62mAU2nH04B6NLq/ogE\nQLbeV2k0LLKccRwlB6QhseEn9GBWO2YyGk5d35tid9qECgnvSzOHHrI83q/ysvKS\npo3MtKct/br1nssvF0Jb83HQLMBFXoXSZPEHr1G3j9eBpJrnt16W5yCXIlFMCYa3\nLHc1B+a4qQKBgQC2blMa28PsA6f6T16zgnKz2K6WhOvY9GurItEh3g/76jkVpgpW\nfPOMf9Oa2nW8hmgzXILk8kWIY67x+2UlkHQJGHiV5VMgKuitBxiP8QqDTC01gy3v\nuLlHfgLmUYxY7YBpz1Yw1x8EY/7cKEnSvvJnqccpWBed5JmM0U3ZL5afIQKBgATy\n26QDtkmUpv59uILBv3ch11tGsIPn99QbACakgswtWc1vICFtecb2yjSg2grl9dPA\nQDQiAYNArtrYIHyMHt3yjLPhTPavIDkq742e2gvRF91bp2gmq5T2f9SAddB/zs5r\nfGETGfFrEwV31/Vj2GnhkjUHPHeiOHalGt7srevZAoGBAMmm2iLA7x+bHoSsLHl6\nqOs2D5AdoJji7YkBPLpIpN4gTmReUhsTtqThe2vzepODATjyo49QuC+jFemiGnxa\nNljhUeNkt5yHi2hl9xfjSKB/81bwHhz617VsPMt/lf1dyFi4jLCnsFihoRF5HwJ3\nDjzsmfCl8njOqGs1JeeaeLOn\n-----END PRIVATE KEY-----\n",
  //   "client_email": "firebase-adminsdk-j162x@deep-97e93.iam.gserviceaccount.com",
  //   "client_id": "102324677571727204105",
  //   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  //   "token_uri": "https://oauth2.googleapis.com/token",
  //   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  //   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-j162x%40deep-97e93.iam.gserviceaccount.com"
  // }
  // `.replace(/\s+/g,""));

  return (
    <Stack>
      <Text suppressHydrationWarning>Device link id{deviceLinkId ?? ' '}</Text>
      <Text suppressHydrationWarning>
        Device registration token link id {deviceRegistrationTokenLinkId ?? ' '}
      </Text>
      <Text suppressHydrationWarning>Platform: {platform ?? ' '}</Text>
      <Text suppressHydrationWarning>
        Permissions are {!isPermissionsGranted && 'not'} granted
      </Text>
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

          const insertDeviceRegistrationTokenToDeep = async ({
            deviceRegistrationToken,
          }: {
            deviceRegistrationToken: string;
          }) => {
            const deviceRegistrationTokenTypeLinkId = await deep.id(
              PACKAGE_NAME,
              'DeviceRegistrationToken'
            );
            const containTypeLinkId = await deep.id(
              '@deep-foundation/core',
              'Contain'
            );
            console.log({ deviceLinkId });

            await deep.delete({
              down: {
                parent: {
                  type_id: containTypeLinkId,
                  from_id: deviceLinkId,
                  to: {
                    type_id: deviceRegistrationTokenTypeLinkId,
                  },
                },
              },
            });

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
            console.log({ deviceRegistrationTokenLinkId });
            setDeviceRegistrationTokenLinkId(deviceRegistrationTokenLinkId);
          };

          if (platform === 'web') {
            console.log(firebaseApplication);
            console.log(firebaseMessaging);

            const serviceWorkerRegistration = await navigator.serviceWorker.register('./firebase-messaging-sw.js', { scope: 'firebase-cloud-messaging-push-scope' });
            const deviceRegistrationToken = await getToken(firebaseMessaging, {
              serviceWorkerRegistration,
              vapidKey:
                'BIScptqotJFzjF7G6efs4_WCrbfVA0In5WaGU-bK62w083TNgfpQoqVKCbjI0ykZLWXbIQLQ1_iEi91u1p4YrH4',

            });

            await insertDeviceRegistrationTokenToDeep({
              deviceRegistrationToken,
            });
          } else {
            await PushNotifications.addListener(
              'registration',
              async ({ value: deviceRegistrationToken }) => {
                await insertDeviceRegistrationTokenToDeep({ deviceRegistrationToken })
              }
            );
            await PushNotifications.register();
          }
        }}
      >
        Register
      </Button>
      <Text>WebPushCertificate can be found on <Link href={"https://console.firebase.google.com/project/PROJECT_ID/settings/cloudmessaging"}>https://console.firebase.google.com/project/PROJECT_ID/settings/cloudmessaging</Link>. Do not forget to change PROJECT_ID in URL to your project id</Text>
      <Input placeholder={"WebPushCertificate"} value={webPushCertificate} onChange={(event) => {
        setWebPushCertificate(event.target.value);
      }}></Input>
      <Button isDisabled={!webPushCertificate} onClick={async () => {
        const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
        const webPushCertificateTypeLinkId = await deep.id(PACKAGE_NAME, "WebPushCertificate");
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
              value: webPushCertificate
            }
          },
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }]
          }
        })
      }}>Insert WebPushCertificate</Button>
      <Text>Service Account can be found on <Link href={"https://console.firebase.google.com/u/0/project/PROJECT_ID/settings/serviceaccounts/adminsdk"}>https://console.firebase.google.com/u/0/project/PROJECT_ID/settings/serviceaccounts/adminsdk</Link>. Do not forget to change PROJECT_ID in URL to your project id</Text>
      {/* <Textarea value={serviceAccount} placeholder={"Service Account"} onChange={(event) => {
        setServiceAccount(event.target.value.replace(/\s+/g,""));
      }}></Textarea> */}
      {/* <Button isDisabled={!serviceAccount} onClick={async () => {
        const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
        const serviceAccountTypeLinkId = await deep.id(PACKAGE_NAME, "ServiceAccount");
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
              value: JSON.parse(serviceAccount)
            }
          },
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }]
          }
        })
      }}>Insert Service Account</Button> */}
      <Button onClick={async () => {
        const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
        const serviceAccountTypeLinkId = await deep.id(PACKAGE_NAME, "ServiceAccount");
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
                "type": "service_account",
                "project_id": "deep-97e93",
                "private_key_id": "cb08d26ecf3eaa62ec65da7520e895745ac84aca",
                "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCkZt+FoADKf3dG\n3NLiN3KqRc5rRda2WkSZ2YSmWMf+6hD49P4zigIX4m3G5WeyylcxhITrEA+ApeEC\n6IyjAqCciEco48YrKI3OL7vYgjnEp4he+6QMa4UGQn6D2wRGeNUBM8Ht/Z435Rhq\natlnLRs8tSMqD3MG0W+W9AwSQdoAUm6ETLBXlnOiBaUwIiEYDxXEEEHPMW0+IIPN\nkXdGwDqTOYBGIUqrD2GUu0NvVi5GFQsRA5b3dJ9ICQZh4AdClm+Hyg02JPp+ubgZ\nF7hJnidtPIJjnBSNIaRKwoqkQ0OMJr0CBZwVZfWX4W1wZDRIl2ECgu98LylykE7U\n5h4kU3Z1AgMBAAECggEAAuhUUbhjiB2ZaxG+dNDLHP7Ythhllckk8n1jFraYrEhp\nWmTk1BjdTVgHYs0wCcGe7n/lx1xA1e9+BBbTN5whdXjKYdn/uBalKChsnSgMS53l\n5ipzWQCACAb7rwPNJ/WGsXuTmmVIFtAYJNCXYCOWt8l3epGp9K9RSAwJFe0JafWr\nYc13ujhnrv6eMSF0Amkf4IfN2fpybVK61l2LmxA4PXdp1LnPbG0F+Wp5ezOcW8zr\nk6fsbRYhgNHppB1RYSqD91utiw4VqWdIrkj+x10uf0BKV1ioHHnSv91jJ7S2ojPY\nd5OkAHBGLHjBQJwQpYdYaLyk4c/wIRhLyrRmwgfy6QKBgQDRk9dnImwXuk0ICeB+\nOmaOt1ByiRNEv7l9v93YODohXFH+fQCYPzpzd96EiFlr3Ginvnm0xxMJ6es0Iv+J\noNZdCTvWWNsn4CktMlIGuG1eoB1NOMXR3O47DTjG1Pfl1mX81vd+Gmvk35jlpVgu\n2jiJHouXdQBHNTNg8RPmSM2y7QKBgQDI0VTxeP52FVT8d62mAU2nH04B6NLq/ogE\nQLbeV2k0LLKccRwlB6QhseEn9GBWO2YyGk5d35tid9qECgnvSzOHHrI83q/ysvKS\npo3MtKct/br1nssvF0Jb83HQLMBFXoXSZPEHr1G3j9eBpJrnt16W5yCXIlFMCYa3\nLHc1B+a4qQKBgQC2blMa28PsA6f6T16zgnKz2K6WhOvY9GurItEh3g/76jkVpgpW\nfPOMf9Oa2nW8hmgzXILk8kWIY67x+2UlkHQJGHiV5VMgKuitBxiP8QqDTC01gy3v\nuLlHfgLmUYxY7YBpz1Yw1x8EY/7cKEnSvvJnqccpWBed5JmM0U3ZL5afIQKBgATy\n26QDtkmUpv59uILBv3ch11tGsIPn99QbACakgswtWc1vICFtecb2yjSg2grl9dPA\nQDQiAYNArtrYIHyMHt3yjLPhTPavIDkq742e2gvRF91bp2gmq5T2f9SAddB/zs5r\nfGETGfFrEwV31/Vj2GnhkjUHPHeiOHalGt7srevZAoGBAMmm2iLA7x+bHoSsLHl6\nqOs2D5AdoJji7YkBPLpIpN4gTmReUhsTtqThe2vzepODATjyo49QuC+jFemiGnxa\nNljhUeNkt5yHi2hl9xfjSKB/81bwHhz617VsPMt/lf1dyFi4jLCnsFihoRF5HwJ3\nDjzsmfCl8njOqGs1JeeaeLOn\n-----END PRIVATE KEY-----\n",
                "client_email": "firebase-adminsdk-j162x@deep-97e93.iam.gserviceaccount.com",
                "client_id": "102324677571727204105",
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-j162x%40deep-97e93.iam.gserviceaccount.com"
              }
              
            }
          },
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }]
          }
        })
      }}>Insert Default Service Account</Button>
      <Button onClick={async () => {
        const pushNotificationTypeLinkId = await deep.id(PACKAGE_NAME, "PushNotification");
        const titleTypeLinkId = await deep.id(PACKAGE_NAME, "Title");
        const bodyTypeLinkId = await deep.id(PACKAGE_NAME, "Body");
        const syncTextFileTypeLinkId = await deep.id("@deep-foundation/core", "SyncTextFile");
        const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
        await deep.insert({
          type_id: pushNotificationTypeLinkId,
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }]
          },
          out: {
            data: [
              {
                type_id: titleTypeLinkId,
                to: {
                  data: {
                    type_id: syncTextFileTypeLinkId,
                    in: {
                      data: [{
                        type_id: containTypeLinkId,
                        from_id: deep.linkId
                      }]
                    },
                    string: {
                      data: {
                        value: "Title"
                      }
                    }
                  }
                },
                in: {
                  data: [{
                    type_id: containTypeLinkId,
                    from_id: deep.linkId
                  }]
                }
              },
              {
                type_id: bodyTypeLinkId,
                to: {
                  data: {
                    type_id: syncTextFileTypeLinkId,
                    in: {
                      data: [{
                        type_id: containTypeLinkId,
                        from_id: deep.linkId
                      }]
                    },
                    string: {
                      data: {
                        value: "Body"
                      }
                    }
                  }
                },
                in: {
                  data: [{
                    type_id: containTypeLinkId,
                    from_id: deep.linkId
                  }]
                }
              }
            ]
          }
        })
      }}>Insert Default Notification</Button>
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
            console.log({ platform });

            // if (platform === 'web') {
            onMessage(firebaseMessaging, async (payload) => {
              console.log({ payload });

              // await insertPushNotificationToDeep({
              //   deep,
              //   deviceLinkId,
              //   payload,
              // });
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
