import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TokenProvider } from '@deep-foundation/deeplinks/imports/react-token';
import {
  LocalStoreProvider,
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  DeepClient,
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
  Box,
  RadioGroup,
  Radio,
  Card,
  CardHeader,
  Heading,
  CardBody,
  CardFooter,
  Checkbox,
  StackDivider,
  NumberInputField,
  NumberInput,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { DEVICE_PACKAGE_NAME as DEVICE_PACKAGE_NAME } from '../imports/device/package-name';
import { Provider } from '../imports/provider';
import { PushNotifications } from '@capacitor/push-notifications';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Device as CapacitorDevice } from '@capacitor/device';
import {
  getMessaging,
  getToken,
  Messaging,
  onMessage,
} from 'firebase/messaging';
import { insertDeviceRegistrationToken } from '../imports/firebase-push-notification/insert-device-registration-token';
import { PACKAGE_NAME } from '../imports/firebase-push-notification/package-name';
import { requestPermissions } from '../imports/firebase-push-notification/request-permissions';
import { insertWebPushCertificate } from '../imports/firebase-push-notification/insert-web-push-certificate';
import { insertServiceAccount } from '../imports/firebase-push-notification/insert-service-account';
import { insertPushNotification } from '../imports/firebase-push-notification/insert-push-notification';
import { registerDevice } from '../imports/firebase-push-notification/register-device';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { PushNotification as PushNotificationComponent } from '../components/push-notification';
import { getPushNotification } from '../imports/firebase-push-notification/get-push-notification';
import { getDevice } from '../imports/device/get-device';
import { Device as DeviceComponent } from '../components/device/device';
import { CapacitorStoreKeys } from '../imports/capacitor-store-keys';
import {
  BatteryInfo,
  Device,
  DeviceInfo,
  GetLanguageCodeResult,
  LanguageTag,
} from '@capacitor/device';
const schema: RJSFSchema = require('../imports/firebase-push-notification/schema.json');
import Form from '@rjsf/chakra-ui';
import validator from '@rjsf/validator-ajv8';
import { RJSFSchema } from '@rjsf/utils';
import { insertActionSheet } from '../imports/action-sheet/insert-action-sheet';
import { PushNotification } from '../imports/firebase-push-notification/push-notification';
import { CapacitorPlatform } from '@capacitor/core/types/platforms';

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

function Page() {
  const deep = useDeep();
  const [deviceLinkId] = useLocalStore('deviceLinkId', undefined);

  const [deviceRegistrationTokenLinkId, setDeviceRegistrationTokenLinkId] =
    useLocalStore(
      CapacitorStoreKeys[CapacitorStoreKeys.DeviceRegistrationToken],
      undefined
    );

  const [platform, setPlatform] = useState(undefined);

  const [firebaseApplication, setFirebaseApplication] = useState<
    FirebaseApp | undefined
  >(undefined);
  const [firebaseMessaging, setFirebaseMessaging] = useState<
    Messaging | undefined
  >(undefined);

  useEffect(() => {
    if (platform === 'web') {
      const firebaseApplication = initializeApp({
        apiKey: 'AIzaSyAdW-DEUZuYcN-1snWNcL7QvtkNdibT_vY',
        authDomain: 'deep-97e93.firebaseapp.com',
        projectId: 'deep-97e93',
        storageBucket: 'deep-97e93.appspot.com',
        messagingSenderId: '430972811028',
        appId: '1:430972811028:web:7c43130f8166c437c03401',
        measurementId: 'G-NJ1R8HDWLK',
      });
      self['firebaseApplication'] = firebaseApplication;
      setFirebaseApplication(firebaseApplication);

      const firebaseMessaging = getMessaging(firebaseApplication);
      self['firebaseMessaging'] = firebaseMessaging;
      setFirebaseMessaging(firebaseMessaging);
    }
  }, [platform]);

  useEffect(() => {
    new Promise(async () => {
      const deviceInfo = await CapacitorDevice.getInfo();
      setPlatform(deviceInfo.platform);
    });
  }, []);



  const {
    data: pushNotificationLinks,
    loading: isPushNotificationLinksSubscriptionLoading,
    error: pushNotificationLinksSubscriptionError,
  } = useDeepSubscription({
    type_id: {
      _id: [PACKAGE_NAME, 'PushNotification'],
    },
    in: {
      type_id: {
        _id: ['@deep-foundation/core', 'Contain'],
      },
      from_id: deep.linkId,
    },
  });

  const [pushNotifications, setPushNotifications] = useState<
    PushNotification[] | undefined
  >(undefined);
  useEffect(() => {
    if (isPushNotificationLinksSubscriptionLoading) {
      return;
    }
    new Promise(async () => {
      const pushNotifications = [];
      for (const pushNotificationLink of pushNotificationLinks) {
        const pushNotification = await getPushNotification({
          deep,
          pushNotificationLinkId: pushNotificationLink.id,
        });
        pushNotifications.push(pushNotification);
      }
      setPushNotifications(pushNotifications);
    });
  }, [
    pushNotificationLinks,
    isPushNotificationLinksSubscriptionLoading,
    pushNotificationLinksSubscriptionError,
  ]);

  const {
    data: deviceLinks,
    loading: isDeviceLinksSubscriptionLoading,
    error: deviceLinksSubscriptionError,
  } = useDeepSubscription({
    type_id: {
      _id: [DEVICE_PACKAGE_NAME, 'Device'],
    },
    in: {
      type_id: {
        _id: ['@deep-foundation/core', 'Contain'],
      },
      from_id: deep.linkId,
    },
  });
  const [devices, setDevices] = useState<DeviceInfo[] | undefined>(undefined);
  useEffect(() => {
    if (isDeviceLinksSubscriptionLoading) {
      return;
    }
    new Promise(async () => {
      const devices = [];
      for (const deviceLink of deviceLinks) {
        const device = await getDevice({
          deep,
          deviceLinkId: deviceLink.id,
        });
        devices.push(device);
      }
      setDevices(devices);
    });
  }, [
    deviceLinks,
    isDeviceLinksSubscriptionLoading,
    deviceLinksSubscriptionError,
  ]);

  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const [isNotifyInsertionModalOpened, setIsNotifyInsertionModalOpened] =
    useState<boolean>(false);
  const notifyInsertionModalOnClose = () => {
    setIsNotifyInsertionModalOpened(false);
  };
  const notifyInsertionCard = (
    <Card>
      <Button
        onClick={async () => {
          setIsNotifyInsertionModalOpened((oldState) => !oldState);
        }}
      >
        Insert Notify Links
      </Button>
      {isNotifyInsertionModalOpened && (
        <Modal
          isOpen={isNotifyInsertionModalOpened}
          onClose={notifyInsertionModalOnClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Insert</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <HStack>
                <Stack>
                  {pushNotifications.map((pushNotification, i) => (
                    <PushNotificationComponent
                      key={i}
                      pushNotification={pushNotification}
                    />
                  ))}
                </Stack>
                <Stack>
                  {devices.map((device, i) => (
                    <DeviceComponent key={i} device={device} />
                  ))}
                </Stack>
              </HStack>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={notifyInsertionModalOnClose}
              >
                Close
              </Button>
              <Button variant="ghost">Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Card>
  );

  // const [pushNotificationToNotifyLinkId, setPushNotificationToNotifyLinkId] = useState<number|undefined>(undefined)
  // const [deviceToNotifyLinkId, setDeviceToNotifyLinkId] = useState(0)
  // const notifyInsertionCard = <Card>
  //   <CardHeader>
  //     <Heading size='md'>Insert Notify</Heading>
  //   </CardHeader>
  //   <CardBody>

  //       <label htmlFor={"pushNotificationToNotifyLinkIdNumberInput"}>Push Notification Link Id To Notify</label>
  //     <NumberInput value={pushNotificationToNotifyLinkId} onChange={(value) => {
  //       console.log({value})
  //       setPushNotificationToNotifyLinkId(value !== '' ? parseInt(value) : undefined)
  //     }}>
  //       <NumberInputField id={"pushNotificationToNotifyLinkIdNumberInput"} placeholder='Device Link Id To Notify'/>
  //     </NumberInput>
  //     <label htmlFor={"pushNotificationToNotifyLinkIdNumberInput"}>Device Link Id To Notify Link Id</label>
  //     <NumberInput  value={deviceToNotifyLinkId} onChange={(value) => {
  //       setDeviceToNotifyLinkId(value !== '' ? parseInt(value) : undefined)
  //     }}>
  //       <NumberInputField placeholder='Device Link Id To Be Notified'/>
  //     </NumberInput>
  //     <Button
  //       onClick={async () => {
  //         const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  //         const notifyTypeLinkId = await deep.id(PACKAGE_NAME, "Notify");
  //         await deep.insert({
  //           type_id: notifyTypeLinkId,
  //           from_id: pushNotificationToNotifyLinkId,
  //           to_id: deviceToNotifyLinkId,
  //           in: {
  //             data: {
  //               type_id: containTypeLinkId,
  //               from_id: deep.linkId
  //             }
  //           }
  //         })
  //       }}
  //     >
  //       Register
  //     </Button>
  //   </CardBody>
  // </Card>;

  return (
    <Stack
      justifyContent={'center'}
      maxWidth={'768px'}
      margin={[0, 'auto']}
      spacing={4}
    >
      <GeneralInfoCard deep={deep} deviceLinkId={deviceLinkId} deviceRegistrationTokenLinkId={deviceRegistrationTokenLinkId} platform={platform} />
      <PermissionsCard platform={platform} />
      <DeviceRegistrationCard deep={deep} deviceLinkId={deviceLinkId} firebaseMessaging={firebaseMessaging} platform={platform} onDeviceRegistrationTokenLinkIdChange={setDeviceRegistrationTokenLinkId} />
      <ServiceAccountInsertionModal deep={deep} deviceLinkId={deviceLinkId} />
      <WebPushCertificateInsertionModal deep={deep} deviceLinkId={deviceLinkId} />
      <InsertPushNotificationModal deep={deep} deviceLinkId={deviceLinkId} />
      
      {notifyInsertionCard}
    </Stack>
  );
}

function InsertPushNotificationModal({
  deep,
  deviceLinkId,
}: {
  deep: DeepClient;
  deviceLinkId: number;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Insert Push Notification</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth={'fit-content'}>
          <ModalHeader>Insert Push Notification</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form
              schema={schema}
              validator={validator}
              onSubmit={async (arg) => {
                console.log('changed', arg);
                await insertPushNotification({
                  deep,
                  containerLinkId: deviceLinkId,
                  pushNotification: arg.formData,
                });
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function ServiceAccountInsertionModal({
  deep,
  deviceLinkId,
}: {
  deep: DeepClient;
  deviceLinkId: number;
}) {
  enum ServiceAccountObtainingWay {
    File,
    Text,
  }
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [serviceAccountObtainingWay, setServiceAccountObtainingWay] =
    useState<ServiceAccountObtainingWay>(ServiceAccountObtainingWay.File);
  const [serviceAccount, setServiceAccount] = useState<string>('');
  const [shouldMakeServiceAccountActive, setShouldMakeServiceAccountActive] =
    useState<boolean>(true);
  const layoutsByObtainintWays: Record<
    ServiceAccountObtainingWay,
    JSX.Element
  > = {
    [ServiceAccountObtainingWay.File]: (
      <Button
        onClick={async () => {
          const pickFilesResult = await FilePicker.pickFiles({
            types: ['application/json'],
          });
          console.log({ pickFilesResult });
          await insertServiceAccount({
            deep,
            serviceAccount: JSON.parse(
              await pickFilesResult.files[0].blob.text()
            ),
            makeActive: shouldMakeServiceAccountActive,
          });
        }}
      >
        Insert Service Account
      </Button>
    ),
    [ServiceAccountObtainingWay.Text]: (
      <>
        <Textarea
          placeholder="Service Account"
          value={serviceAccount}
          onChange={(event) => {
            setServiceAccount(event.target.value);
          }}
        ></Textarea>
        <Button
          onClick={async () => {
            await insertServiceAccount({
              deep,
              serviceAccount: JSON.parse(JSON.stringify(serviceAccount)),
              makeActive: shouldMakeServiceAccountActive,
            });
          }}
        >
          Insert Service Account
        </Button>
      </>
    ),
  };
  return (
    <>
      <Button onClick={onOpen}>Insert Service Account</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth={'fit-content'}>
          <ModalHeader>Insert Service Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <RadioGroup
                onChange={(value) => {
                  setServiceAccountObtainingWay(
                    ServiceAccountObtainingWay[value]
                  );
                }}
                value={ServiceAccountObtainingWay[serviceAccountObtainingWay]}
              >
                <Stack direction="row">
                  <Radio
                    value={
                      ServiceAccountObtainingWay[
                        ServiceAccountObtainingWay.File
                      ]
                    }
                  >
                    File
                  </Radio>
                  <Radio
                    value={
                      ServiceAccountObtainingWay[
                        ServiceAccountObtainingWay.Text
                      ]
                    }
                  >
                    Text
                  </Radio>
                </Stack>
              </RadioGroup>
              <Checkbox
                isChecked={shouldMakeServiceAccountActive}
                onChange={(event) =>
                  setShouldMakeServiceAccountActive(event.target.checked)
                }
              >
                Make Active
              </Checkbox>
              {layoutsByObtainintWays[serviceAccountObtainingWay]}
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
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function WebPushCertificateInsertionModal({
  deep,
  deviceLinkId,
}: {
  deep: DeepClient;
  deviceLinkId: number;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [webPushCertificate, setWebPushCertificate] = useState<string>('');
  const [
    shouldMakeWebPushCertificateActive,
    setShouldMakeWebPushCertificateActive,
  ] = useState<boolean>(true);
  return (
    <>
      <Button onClick={onOpen}>Insert Web Push Certificate</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth={'fit-content'}>
          <ModalHeader>Insert Web Push Certificate</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Stack>
          <Input
            placeholder="Web Push Certificate"
            value={webPushCertificate}
            onChange={(event) => {
              setWebPushCertificate(event.target.value);
            }}
          ></Input>
          <Checkbox
            isChecked={shouldMakeWebPushCertificateActive}
            onChange={(event) =>
              setShouldMakeWebPushCertificateActive(event.target.checked)
            }
          >
            Make Active
          </Checkbox>
          <Button
            onClick={async () => {
              await insertWebPushCertificate({
                deep,
                webPushCertificate,
                shouldMakeActive: shouldMakeWebPushCertificateActive,
              });
            }}
          >
            Insert Web Push Certificate
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
          <Text>Required to notificate web clients</Text>
        </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function DeviceRegistrationCard({
  deep,
  deviceLinkId,
  firebaseMessaging,
  platform,
  onDeviceRegistrationTokenLinkIdChange
}: {
  deep: DeepClient;
  deviceLinkId: number;
  firebaseMessaging: Messaging;
  platform: DeviceInfo['platform'];
  onDeviceRegistrationTokenLinkIdChange: (deviceRegistrationTokenLinkId: number) => void;
}) {
  return <Card>
  <CardHeader>
    <Heading size="md">Register Device</Heading>
  </CardHeader>
  <CardBody>
    <Button
      onClick={async () => {
        await registerDevice({
          deep,
          deviceLinkId,
          firebaseMessaging,
          platform,
          callback: ({ deviceRegistrationTokenLinkId }) => {
            onDeviceRegistrationTokenLinkIdChange(deviceRegistrationTokenLinkId);
          },
        });
      }}
    >
      Register
    </Button>
  </CardBody>
</Card>
}

function PermissionsCard({
  platform
}: {
  platform: DeviceInfo['platform'];
}) {
  const [isPermissionsGranted, setIsPermissionsGranted] = useState(undefined);

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
  }, [platform]);
  return <Card>
  <CardHeader>
    <Heading size="md">Permissions</Heading>
  </CardHeader>
  <CardBody>
    <Stack>
      <Text suppressHydrationWarning>
        Permissions are {!isPermissionsGranted && 'not'} granted
      </Text>
      <Button
        isDisabled={!platform}
        onClick={() => {
          new Promise(async () => {
            if (!platform) {
              return;
            }
            const isPermissionsGranted = await requestPermissions({
              platform,
            });
            setIsPermissionsGranted(isPermissionsGranted);
          });
        }}
      >
        Request permissions
      </Button>
    </Stack>
  </CardBody>
</Card>
}

function GeneralInfoCard(
  {
    deep,
    deviceLinkId,
    deviceRegistrationTokenLinkId,
    platform
  } :
  {
    deep: DeepClient;
    deviceLinkId: number;
    deviceRegistrationTokenLinkId: number;
    platform: DeviceInfo['platform'];
  }
) {
  return <Card>
  <CardHeader>
    <Heading size="md">General Info</Heading>
  </CardHeader>
  <CardBody>
    <Stack>
      <Text suppressHydrationWarning>
        Deep link id: {deep.linkId ?? ' '}
      </Text>
      <Text suppressHydrationWarning>
        Device link id: {deviceLinkId ?? ' '}
      </Text>
      <Text suppressHydrationWarning>
        Device registration token link id:{' '}
        {deviceRegistrationTokenLinkId ?? ' '}
      </Text>
      <Text suppressHydrationWarning>Platform: {platform ?? ' '}</Text>
    </Stack>
  </CardBody>
</Card>
}