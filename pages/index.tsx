import React, { useEffect, useState } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import {
  ChakraProvider,
  Text,
  Link,
  Stack,
  Card,
  CardBody,
  Heading,
  CardHeader,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import {
  DeepProvider,
  useDeep,
  useDeepSubscription,
} from '@deep-foundation/deeplinks/imports/client';
import NextLink from 'next/link';

import { useRouter } from 'next/router';

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
import { useHapticsSubscription } from '../imports/haptics/use-haptics-vibrate-subscription';
import { WithActionSheetSubscription } from '../components/action-sheet/with-action-sheet-subscription';
import { WithDialogSubscription } from '../components/dialog/with-dialog-subscription';
import { WithScreenReaderSubscription } from '../components/screen-reader/with-screen-reader-subscription';
import { WithHapticsSubscription } from '../components/haptics/with-haptics-vibrate-subscription';
import { insertDevice } from '../imports/device/insert-device';
import { saveAllContacts } from '../imports/contact/contact';
import { saveAllCallHistory } from '../imports/callhistory/callhistory';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { CapacitorStoreKeys } from '../imports/capacitor-store-keys';
import { WithSubscriptions } from '../components/deep-memo/with-subscriptions';

function Page() {
  useEffect(() => {
    defineCustomElements(window);
  }, []);

  const deep = useDeep();
  const router = useRouter();

  const [adminLinkId, setAdminLinkId] = useState<number | undefined>(undefined);

  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    CapacitorStoreKeys[CapacitorStoreKeys.DeviceLinkId],
    undefined
  );

  const [isMemoPackageInstalled, setIsMemoPackageInstalled] = useState<boolean | undefined>(undefined);
  {
    const { data, loading, error } = useDeepSubscription({
      type_id: {
        _id: ['@deep-foundation/core', 'Package'],
      },
      string: {
        value: DEEP_MEMO_PACKAGE_NAME,
      },
    });
    useEffect(() => {
      if (error) {
        console.error(error.message);
      }
      if (loading) {
        return;
      }
      console.log({ data });
      setIsMemoPackageInstalled(data.length !== 0);
    }, [data, loading, error]);
  }

  useEffect(() => {
    if (deep.linkId === 0) {
      deep.guest();
    }
  }, []);

  useEffect(() => {
    new Promise(async () => {
      if (deep.linkId != 0) {
        const adminLinkId = await deep.id('deep', 'admin');
        setAdminLinkId(adminLinkId);
        if (deep.linkId != adminLinkId) {
          await deep.login({
            linkId: adminLinkId,
          });
        }
      }
    });
  }, [deep]);

  const memoPackageIsNotInstalledAlert = (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>Install {DEEP_MEMO_PACKAGE_NAME} to proceed!</AlertTitle>
      <AlertDescription>
        {DEEP_MEMO_PACKAGE_NAME} package contains all the packages required to
        use this application. You can install it by using npm-packager-ui
        located in deepcase or any other posibble way.
      </AlertDescription>
    </Alert>
  );

  const linksOfPages = (
    <>
      <div>
        <Link as={NextLink} href="/settings">
          Settings
        </Link>
      </div>
      <div>
        <Link as={NextLink} href="/device">
          Device
        </Link>
      </div>
      <div>
        <Link as={NextLink} href="/call-history">
          Call History
        </Link>
      </div>
      <div>
        <Link as={NextLink} href="/contacts">
          Contacts
        </Link>
      </div>
      <div>
        <Link as={NextLink} href="/telegram">
          Telegarm
        </Link>
      </div>
      <div>
        <Link as={NextLink} href="/action-sheet">
          Action Sheet
        </Link>
      </div>
      <div>
        <Link as={NextLink} href="/dialog">
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
        <Link as={NextLink} replace href="/browser-extension">
          Browser Extension
        </Link>
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
    </>
  );

  const generalInfoCard = (
    <Card>
      <CardHeader>
        <Heading as={'h2'}>General Info</Heading>
      </CardHeader>
      <CardBody>
        <Text suppressHydrationWarning>
          Authentication Link Id: {deep.linkId ?? ' '}
        </Text>
        <Text suppressHydrationWarning>
          Device Link Id: {deviceLinkId ?? ' '}
        </Text>
      </CardBody>
    </Card>
  );

  return (
    <Stack alignItems={'center'}>
      <Heading as={'h1'}>DeepMemo</Heading>
      {generalInfoCard}
      {deep.linkId ? (
        isMemoPackageInstalled ? (
          Boolean(deviceLinkId) ? (
            <>
            <WithSubscriptions deep={deep} />
            {linksOfPages}
            </>
          ) : (
            <Text>Initializing the device...</Text>
          )
        ) : (
          memoPackageIsNotInstalledAlert
        )
      ) : (
        <Text>Logging in...</Text>
      )}
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
