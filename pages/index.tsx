import React, { useEffect, useMemo, useState } from 'react';
import { ApolloClientTokenizedProvider } from '@deep-foundation/react-hasura/apollo-client-tokenized-provider';
import {
  TokenProvider,
  useTokenController,
} from '@deep-foundation/deeplinks/imports/react-token';
import { useQuery, useSubscription, gql } from '@apollo/client';
import {
  LocalStoreProvider,
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  MinilinksLink,
  MinilinksResult,
  useMinilinksConstruct,
} from '@deep-foundation/deeplinks/imports/minilinks';
import { ChakraProvider, Text, Link, Stack, Card, CardBody, Heading, CardHeader } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import {
  DeepProvider,
  useDeep,
  useDeepSubscription
} from '@deep-foundation/deeplinks/imports/client';
import NextLink from 'next/link';
import { PACKAGE_NAME as DEVICE_PACKAGE_NAME } from '../imports/device/package-name';

import { createAllContacts } from "../imports/contact/contact";
import { getIsPackageInstalled } from '../imports/get-is-package-installed';
import { useRouter } from 'next/router'

import { useHapticVibrate } from "../imports/haptics/haptics";
import { createAllCallHistory } from "../imports/callhistory/callhistory";
import { copyClipboardToDeep } from "../imports/clipboard/clipboard";
import {Haptics} from '@capacitor/haptics';

import {
  createTelegramPackage,
} from "../imports/telegram/telegram";
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
import { PACKAGE_NAME as MEMO_PACKAGE_NAME } from '../imports/memo/package-name';

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
        value: "@deep-foundation/memo"
      }
    })
    useEffect(() => {
      if(error) {
        console.error(error.message)
      }
      if(loading) {
        return
      }
      setIsMemoPackageInstalled(data.length !== 0);
    }, [data, loading, error])
  }


  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
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
    if (
      deep.linkId == 0 || 
      !isMemoPackageInstalled
      ) {
      return;
    }
    new Promise(async () => {
      const adminLinkId = await deep.id('deep', 'admin');
      if (deep.linkId != adminLinkId) {
        return;
      }

      if (!deviceLinkId) {
        const initializeDeviceLink = async () => {
          const deviceTypeLinkId = await deep.id("@freephoenix888/device", 'Device');
          const containTypeLinkId = await deep.id(
            '@deep-foundation/core',
            'Contain'
          );
          const {
            data: [{ id: newDeviceLinkId }],
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
          });
          setDeviceLinkId(newDeviceLinkId);
        };
        initializeDeviceLink();
      } else {
        const { data: [deviceLink] } = await deep.select(deviceLinkId);
        if (!deviceLink) {
          setDeviceLinkId(undefined);
        }
      }
    });
  }, [deep, deviceLinkId, isMemoPackageInstalled]);

  const isDeepReady = adminLinkId !== undefined && deep.linkId === adminLinkId && deviceLinkId !== undefined;

  return (
    <Stack alignItems={"center"}>
      <h1>Deep</h1>
      <Card>
        <CardHeader>
          <Heading>
          {`${MEMO_PACKAGE_NAME} installation status`}
          </Heading>
          </CardHeader>
        <CardBody>
        <Text>
        {`${MEMO_PACKAGE_NAME} is ${!isMemoPackageInstalled && 'not'} installed`}
        </Text>
        </CardBody>
      </Card>
      <Text suppressHydrationWarning>Authentication Link Id: {deep.linkId ?? " "}</Text>
      <Text suppressHydrationWarning>Device Link Id: {deviceLinkId ?? " "}</Text>
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
