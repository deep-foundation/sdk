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
  Box,
  RadioGroup,
  Radio,
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
import { insertDeviceRegistrationToken } from '../imports/push-notification/insert-device-registration-token';
import { PACKAGE_NAME } from '../imports/push-notification/package-name';
import { requestPermissions } from '../imports/push-notification/request-permissions';
import { insertWebPushCertificate } from '../imports/push-notification/insert-web-push-certificate';
import { insertServiceAccount } from '../imports/push-notification/insert-service-account';
import { insertPushNotification } from '../imports/push-notification/insert-push-notification';
import { registerDevice } from '../imports/push-notification/register-device';
import { FilePicker } from '@capawesome/capacitor-file-picker';

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
    useState<FirebaseApp | undefined>(undefined);
  const [firebaseMessaging, setFirebaseMessaging] =
    useState<Messaging | undefined>(undefined);

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

  enum ServiceAccountObtainingWay {
    File,
    Text
  }

  const [serviceAccountObtainingWay, setServiceAccountObtainingWay] = useState<ServiceAccountObtainingWay>(ServiceAccountObtainingWay.File);
  const [serviceAccount, setServiceAccount] = useState<string>("");

  const layoutsByObtainintWays: Record<ServiceAccountObtainingWay, JSX.Element> = {
    [ServiceAccountObtainingWay.File]: <Button onClick={async () => {
      const pickFilesResult = await FilePicker.pickFiles({
        types: ['application/json']
      });
      console.log({ pickFilesResult });
      await insertServiceAccount({
        deep,
        serviceAccount: JSON.parse(await pickFilesResult.files[0].blob.text())
      })
    }}>
      Insert Service Account
    </Button>,
    [ServiceAccountObtainingWay.Text]: <>
    <Textarea placeholder='Service Account' value={serviceAccount} onChange={(event) => {
    setServiceAccount(event.target.value);
  }}>
  </Textarea>
  <Button
    onClick={async () => {
      await insertServiceAccount({
        deep,
        serviceAccount: JSON.parse(JSON.stringify(serviceAccount))
      })
    }}
  >
    Insert Default Service Account
  </Button>
  </>
  }


  const serviceAccountPageContent = <>
    <RadioGroup onChange={(value) => {
      setServiceAccountObtainingWay(ServiceAccountObtainingWay[value])
    }} value={ServiceAccountObtainingWay[serviceAccountObtainingWay]}>
      <Stack direction='row'>
        <Radio value={ServiceAccountObtainingWay[ServiceAccountObtainingWay.File]}>File</Radio>
        <Radio value={ServiceAccountObtainingWay[ServiceAccountObtainingWay.Text]}>Text</Radio>
      </Stack>
    </RadioGroup>
       {
         layoutsByObtainintWays[serviceAccountObtainingWay]
       }
  </>;

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
            const isPermissionsGranted = await requestPermissions({ platform });
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
          await insertWebPushCertificate({
            deep,
            webPushCertificate: "Insert Web Push Certificate here. Get in on https://console.firebase.google.com/project/PROJECT_ID/settings/cloudmessaging"
          })
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
      {
        serviceAccountPageContent
      }
      <Button
        onClick={async () => {
          await insertPushNotification({
            deep,
            pushNotification: {
              body: "Body",
              title: "Title"
            }
          })
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
          await registerDevice({
            deep,
            deviceLinkId,
            firebaseMessaging,
            platform,
            callback: ({ deviceRegistrationTokenLinkId }) => {
              setDeviceRegistrationTokenLinkId(deviceRegistrationTokenLinkId);
            },
          })
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
