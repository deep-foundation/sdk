import React, { useEffect, useState } from 'react';
import {
  useLocalStore,
} from '@deep-foundation/store/local';
import { ChakraProvider, Text, Link, Stack, Card, CardBody, Heading, CardHeader, Alert, AlertDescription, AlertIcon, AlertTitle, Switch, FormControl, FormLabel } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import {
  DeepProvider,
  useDeep,
  useDeepSubscription
} from '@deep-foundation/deeplinks/imports/client';
import NextLink from 'next/link';

import { useRouter } from 'next/router'


import DevicePage from './device';
import CallHistoryPage from './call-history';
import ContactsPage from './contacts';
import TelegramPage from './telegram';
import ActionSheetPage from './action-sheet';
import DialogPage from './dialog';
import ScreenReaderPage from './screen-reader';
import OpenaiCompletionPage from './openai-completion';
import BrowserExtensionPage from './browser-extension';
import NetworkPage from './network';
import CameraPage from './camera';
import HapticsPage from './haptics';
import AudioRecordPage from './audiorecord';
import { DEEP_MEMO_PACKAGE_NAME as DEEP_MEMO_PACKAGE_NAME } from '../imports/deep-memo/package-name';
import { saveDeviceData } from '../imports/device/save-device-data';
import { Device } from '@capacitor/device';
import { DEVICE_PACKAGE_NAME } from '../imports/device/package-name';
import { useActionSheetSubscription } from '../imports/action-sheet/use-action-sheet-subscription';
import { useDialogSubscription } from '../imports/dialog/use-dialog-subscription';
import { useScreenReaderSubscription } from '../imports/screen-reader/use-screen-reader-subscription';
import { useHapticVibrateSubscription } from '../imports/haptics/use-haptics-vibrate-subscription';

function Page() {
  const deep = useDeep();
  const router = useRouter();

  const [isMemoPackageInstalled, setIsMemoPackageInstalled] = useState<boolean|undefined>(undefined)
  {
    const {data, loading, error} = useDeepSubscription({
      type_id: {
        _id: ["@deep-foundation/core", "Package"]
      },
      string: {
        value: DEEP_MEMO_PACKAGE_NAME
      }
    })
    useEffect(() => {
      if(error) {
        console.error(error.message)
      }
      if(loading) {
        return
      }
      console.log({data})
      setIsMemoPackageInstalled(data.length !== 0);
    }, [data, loading, error])
  }


  const [deviceLink, setDeviceLink] = useLocalStore(
    'deviceLink',
    undefined
  );
  const [adminLinkId, setAdminLinkId] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (deep.linkId === 0) {
      deep.guest();
    }
  }, []);

  useEffect(() => {
    new Promise(async () => {
      if (deep.linkId != 0) {
        const adminLinkId = await deep.id('deep', 'admin');
        setAdminLinkId(adminLinkId)
        if (deep.linkId != adminLinkId) {

          await deep.login({
            linkId: adminLinkId,
          });
        }
      }
    });
  }, [deep]);

  useEffect(() => {
    if (!adminLinkId) {
      return;
    }
    new Promise(async () => {
      if (!deviceLink) {
        const initializeDeviceLink = async () => {
          const deviceTypeLinkId = await deep.id(DEVICE_PACKAGE_NAME, 'Device');
          const containTypeLinkId = await deep.id(
            '@deep-foundation/core',
            'Contain'
          );
          const {
            data: [deviceLink],
          } = await deep.insert({
            type_id: deviceTypeLinkId,
            in: {
              data: [
                {
                  type_id: containTypeLinkId,
                  from_id: deep.linkId,
                },
              ],
            },
          }, {returning: deep.selectReturning});
          setDeviceLink(deviceLink);
        };
        initializeDeviceLink();
      } else {
        const { data: deviceLinks } = await deep.select(deviceLink.id);
        if (deviceLinks.length === 0) {
          setDeviceLink(undefined);
        } else {
          await saveDeviceData({deep, deviceLink, data: {
            ...(await Device.getInfo()),
            ...(await Device.getBatteryInfo()),
            ...(await Device.getId()),
            ...(await Device.getLanguageCode()),
            ...(await Device.getLanguageTag())
          }})
        }
      }
    });
  }, [deep, deviceLink, isMemoPackageInstalled]);

  const isDeepReady = adminLinkId !== undefined && deep.linkId === adminLinkId && isMemoPackageInstalled && deviceLink !== undefined;

  const [isActionSheetSubscriptionEnabled, setIsActionSheetSubscriptionEnabled] = useLocalStore('isActionSheetSubscriptionEnabled', false);
  useActionSheetSubscription({deep, deviceLinkId: deviceLink.id, isEnabled: isActionSheetSubscriptionEnabled});

  const [isDialogSubscriptionEnabled, setIsDialogSubscriptionEnabled] = useLocalStore('isDialogSubscriptionEnabled', false);
  useDialogSubscription({deep, deviceLinkId: deviceLink.id, isEnabled: isDialogSubscriptionEnabled});

  const [isScreenReaderSubscriptionEnabled, setIsScreenReaderSubscriptionEnabled] = useLocalStore('isScreenReaderSubscriptionEnabled', false);
  useScreenReaderSubscription({deep, deviceLinkId: deviceLink.id, isEnabled: isScreenReaderSubscriptionEnabled});

  const [isHapticVibrateSubscriptionEnabled, setIsHapticVibrateSubscriptionEnabled] = useLocalStore('isHapticVibrateSubscriptionEnabled', false);
  useHapticVibrateSubscription({deep, deviceLinkId: deviceLink.id, isEnabled: isHapticVibrateSubscriptionEnabled});

  const tumblersCard = (
    <Card>
      <CardBody>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="action-sheet-subscription-switch" mb="0">
            Enable email alerts?
          </FormLabel>
          <Switch id="action-sheet-subscription-switch" />
        </FormControl>
      </CardBody>
    </Card>
  );

  return (
    <Stack alignItems={"center"}>
      <Heading as={'h1'}>DeepMemo</Heading>
      <Card>
      <CardHeader>
        <Heading as={'h2'}>General Info</Heading>
      </CardHeader>
      <CardBody>
      <Text suppressHydrationWarning>Authentication Link Id: {deep.linkId ?? " "}</Text>
      <Text suppressHydrationWarning>Device Link Id: {deviceLink?.id ?? " "}</Text>
      </CardBody>
    </Card>
      
      {
        !isMemoPackageInstalled ?
        <Alert status='error'>
  <AlertIcon />
  <AlertTitle>Install {DEEP_MEMO_PACKAGE_NAME} to proceed!</AlertTitle>
  <AlertDescription>{DEEP_MEMO_PACKAGE_NAME} package contains all the packages required to use this application. You can install it by using npm-packager-ui located in deepcase or any other posibble way.</AlertDescription>
</Alert> :
        <>
        {tumblersCard}
        <Card>
      <CardHeader>
        <Heading>Device</Heading>
      </CardHeader>
      <CardBody>
        <DevicePage />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <Heading>Call History</Heading>
      </CardHeader>
      <CardBody>
        <CallHistoryPage />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <Heading>Contacts</Heading>
      </CardHeader>
      <CardBody>
        <ContactsPage />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <Heading>Telegram</Heading>
      </CardHeader>
      <CardBody>
        <TelegramPage />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <Heading>Action Sheet</Heading>
      </CardHeader>
      <CardBody>
        <ActionSheetPage />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <Heading>Dialog</Heading>
      </CardHeader>
      <CardBody>
        <DialogPage />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <Heading>Screen Reader</Heading>
      </CardHeader>
      <CardBody>
        <ScreenReaderPage />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <Heading>OpenAI Completion</Heading>
      </CardHeader>
      <CardBody>
        <OpenaiCompletionPage />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <Heading>Browser Extension</Heading>
      </CardHeader>
      <CardBody>
        <BrowserExtensionPage />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <Heading>Network</Heading>
      </CardHeader>
      <CardBody>
        <NetworkPage />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <Heading>Camera</Heading>
      </CardHeader>
      <CardBody>
        <CameraPage />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <Heading>Audio Record</Heading>
      </CardHeader>
      <CardBody>
        <AudioRecordPage />
      </CardBody>
    </Card>
    <Card>
      <CardHeader>
        <Heading>Haptics</Heading>
      </CardHeader>
      <CardBody>
        <HapticsPage />
      </CardBody>
    </Card>
      {/* <CallHistoryPage/>
      <ContactsPage/>
      <TelegramPage/>
      <ActionSheetPage/>
      <DialogPage/>
      <ScreenReaderPage/>
      <OpenaiCompletionPage/>
      <BrowserExtensionPage/>
      <NetworkPage/>
      <CameraPage/>
      <AudioRecordPage/>
      <HapticsPage/> */}
      <div>
        <Link as={NextLink} href='/device'>
          Device
        </Link>
      </div>
      <div>
        <Link as={NextLink} href='/call-history'>
          Call History
        </Link>
      </div>
      <div>
        <Link as={NextLink} href='/contacts'>
          Contacts
        </Link>
      </div>
      <div>
        <Link as={NextLink} href='/telegram'>
          Telegarm
        </Link>
      </div>
      <div>
        <Link as={NextLink} href='/action-sheet'>
          Action Sheet
        </Link>
      </div>
      <div>
        <Link as={NextLink} href='/dialog'>
          Dialog
        </Link>
      </div>
      <div>
        <Link as={NextLink} href="/screen-reader">
          Screen Reader
        </Link>
      </div> 
      <div>
        <Link as={NextLink} href="/openai-completion">
          OpenAI Completion
        </Link>
      </div> 
      <div>
        <Link as={NextLink} replace href="/browser-extension">Browser Extension</Link>
      </div>
      <div>
        <Link as={NextLink} href="/network">
          Network
        </Link>
      </div> 
      <div>
        <Link as={NextLink} href="/camera">
          Camera
        </Link>
      </div> 

      <div>
        <Link as={NextLink} href="/audiorecord">
          Audiorecord
        </Link>
      </div> 
      <div>
        <Link as={NextLink} href="/haptics">
          Haptics
        </Link>
      </div> 
      <div>
      </div>
      </>
      }
    </Stack>
  );
}

export default function Index() {
  return (
    <>
      <ChakraProvider>
        <Provider>
          <DeepProvider>
            <Page />
          </DeepProvider>
        </Provider>
      </ChakraProvider>
    </>
  );
}
