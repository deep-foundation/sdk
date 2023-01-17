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
import { ChakraProvider, Text } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import {
  DeepProvider,
  useDeep,
} from '@deep-foundation/deeplinks/imports/client';
import Link from 'next/link';
import { initializePackage } from '../imports/device/initialize-package';
import { PACKAGE_NAME as DEVICE_PACKAGE_NAME } from '../imports/device/package-name';

function Page() {
  const deep = useDeep();

  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  useEffect(() => {
    async function loginAsAdminInDeep() {
      if (!deep) {
        return;
      }

      await deep.guest();
      await deep.login({
        linkId: await deep.id('deep', 'admin'),
      });
    }
    loginAsAdminInDeep();
  }, []);

  useEffect(() => {
    if (!deep) {
      return;
    }
    async function initializeDevice() {
      const devicePackageSelectResponse = await deep.select({
        type_id: {
          _id: ['@deep-foundation/core', 'Contain'],
        },
        from_id: deep.linkId,
        to: {
          type_id: {
            _id: ['@deep-foundation/core', 'Package'],
          },
          string: {
            value: DEVICE_PACKAGE_NAME,
          },
        },
      });
      const isDevicePackageInstalled =
        devicePackageSelectResponse.data.length > 0;
      if (!isDevicePackageInstalled) {
        await initializePackage(deep);
      }
      if (!deviceLinkId) {
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
        console.log({ newDeviceLinkId });
        setDeviceLinkId(newDeviceLinkId);
      }
    }

    initializeDevice();
  }, []);

  return (
    <>
      <h1>Deep.Foundation sdk examples</h1>
      <Text>Device Link Id: {deviceLinkId}</Text>
      <div>
        <Link href="/all">all subscribe</Link>
      </div>
      <div>
        <Link href="/messanger">messanger</Link>
      </div>
      <div>
        <Link href="/device">device</Link>
      </div>
    </>
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
