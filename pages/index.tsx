import React, { useEffect, useState } from 'react';
import { LocalStoreProvider, useLocalStore } from '@deep-foundation/store/local';
import {

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
  Input,
  Button,
} from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import {

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
import { initDeviceIfNotInitedAndSaveData } from '../imports/device/init-device-if-not-inited-and-save-data';
import { useIsPackageInstalled } from '../imports/use-is-package-installed';
import { WithInitDeviceIfNotInitedAndSaveData } from '../components/device/withInitDeviceIfNotInitedAndSaveData';
import { NavBar } from '../components/navbar';
import { useTokenController } from '@deep-foundation/deeplinks/imports/react-token';
import { QueryStoreProvider } from '@deep-foundation/store/query';
import { ChakraProvider } from '@chakra-ui/react';
import { DeepProvider } from '@deep-foundation/deeplinks/imports/client';
import { TokenProvider } from '@deep-foundation/deeplinks/imports/react-token';
import { ApolloClientTokenizedProvider } from '@deep-foundation/react-hasura/apollo-client-tokenized-provider';
import { Page } from '../components/page';

function Content() {
  useEffect(() => {
    defineCustomElements(window);
  }, []);

  const deep = useDeep();

  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    CapacitorStoreKeys[CapacitorStoreKeys.DeviceLinkId],
    undefined
  );

  const { isPackageInstalled: isMemoPackageInstalled } = useIsPackageInstalled({ packageName: DEEP_MEMO_PACKAGE_NAME, shouldIgnoreResultWhenLoading: true, onError: ({ error }) => { console.error(error.message) } });

  useEffect(() => {
    new Promise(async () => {
      if (deep.linkId !== 0) {
        return;
      }
      await deep.guest();
    })
  }, [deep])

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
      <NavBar />
      <Heading as={'h1'}>DeepMemo</Heading>
      {generalInfoCard}
      {
        isMemoPackageInstalled ? (
          <>
            <WithInitDeviceIfNotInitedAndSaveData deep={deep} deviceLinkId={deviceLinkId} setDeviceLinkId={setDeviceLinkId} />
            {
              Boolean(deviceLinkId) ? (
                <>
                  <WithSubscriptions deep={deep} />
                  <Pages />
                </>
              ) : (
                <Text>Initializing the device...</Text>
              )
            }
          </>
        ) : (
          <MemoPackageIsNotInstalledAlert />
        )
      }
    </Stack>
  );
}

export default function IndexPage() {
  return <Page>
    <Content />
  </Page>
}

function MemoPackageIsNotInstalledAlert() {
  // return <Text>Package is not installed</Text>
  return <Alert status="error">
    <AlertIcon />
    <AlertTitle>Install {DEEP_MEMO_PACKAGE_NAME.toString()} to proceed!</AlertTitle>
    <AlertDescription>
      {DEEP_MEMO_PACKAGE_NAME.toString()} package contains all the packages required to
      use this application. You can install it by using npm-packager-ui
      located in deepcase or any other posibble way.
    </AlertDescription>
  </Alert>
}

function Pages() {
  return <Stack>

    <Link as={NextLink} href="/settings">
      Settings
    </Link>


    <Link as={NextLink} href="/device">
      Device
    </Link>


    <Link as={NextLink} href="/call-history">
      Call History
    </Link>


    <Link as={NextLink} href="/contacts">
      Contacts
    </Link>


    <Link as={NextLink} href="/telegram">
      Telegarm
    </Link>


    <Link as={NextLink} href="/action-sheet">
      Action Sheet
    </Link>


    <Link as={NextLink} href="/dialog">
      Dialog
    </Link>


    <Link as={NextLink} href="/screen-reader">
      Screen Reader
    </Link>


    <Link as={NextLink} href="/openai-completion">
      OpenAI Completion
    </Link>


    <Link as={NextLink} replace href="/browser-extension">
      Browser Extension
    </Link>


    <Link as={NextLink} href="/network">
      Network
    </Link>


    <Link as={NextLink} href="/camera">
      Camera
    </Link>



    <Link as={NextLink} href="/audiorecord">
      Audiorecord
    </Link>


    <Link as={NextLink} href="/haptics">
      Haptics
    </Link>


    <Link as={NextLink} href="/firebase-push-notification">
      Firebase Push Notification
    </Link>

  </Stack>
}

