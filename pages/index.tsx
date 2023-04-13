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
import { ChakraProvider, Text, Link, Stack } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import {
  DeepProvider,
  useDeep,
} from '@deep-foundation/deeplinks/imports/client';
import NextLink from 'next/link';
import { PACKAGE_NAME as DEVICE_PACKAGE_NAME } from '../imports/device/package-name';

import { initPackageContact, createAllContacts } from "../imports/packages/contact/contact";
import { getIsPackageInstalled } from '../imports/get-is-package-installed';

import { createAllCallHistory } from "../imports/packages/callhistory/callhistory";
import { initPackageClipboard, copyClipboardToDeep } from "../imports/packages/clipboard/clipboard";

import {
  createTelegramPackage,
} from "../imports/packages/telegram/telegram";

function Page() {
  const deep = useDeep();

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
    if (deep.linkId == 0) {
      return;
    }
    new Promise(async () => {
      const adminLinkId = await deep.id('deep', 'admin');
      if (deep.linkId != adminLinkId) {
        return;
      }

      if (!deviceLinkId) {
        const initializeDeviceLink = async () => {
          const deviceTypeLinkId = await deep.id(DEVICE_PACKAGE_NAME, 'Device');
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
  }, [deep]);

  const isDeepReady = adminLinkId !== undefined && deep.linkId === adminLinkId && deviceLinkId !== undefined;

  return (
    <Stack alignItems={"center"}>
      <h1>Deep</h1>
      <Text suppressHydrationWarning>Authentication Link Id: {deep.linkId ?? " "}</Text>
      <Text suppressHydrationWarning>Device Link Id: {deviceLinkId ?? " "}</Text>
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
