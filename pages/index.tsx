import React, { useEffect, useMemo, useState } from 'react';
import { ApolloClientTokenizedProvider } from '@deep-foundation/react-hasura/apollo-client-tokenized-provider';
import { TokenProvider, useTokenController } from '@deep-foundation/deeplinks/imports/react-token';
import { useQuery, useSubscription, gql } from '@apollo/client';
import { LocalStoreProvider, useLocalStore } from '@deep-foundation/store/local';
import { MinilinksLink, MinilinksResult, useMinilinksConstruct } from '@deep-foundation/deeplinks/imports/minilinks';
import { ChakraProvider, Text } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import Link from 'next/link';
import { initializePackage } from '../imports/device/initialize-package';
import { PACKAGE_NAME as DEVICE_PACKAGE_NAME } from '../imports/device/package-name';

export default function Index() {

  const deep = useDeep();
  const [deviceLinkId, setDeviceLinkId] = useLocalStore("deviceLinkId", undefined);


  useEffect(() => {
    async function loginAsAdminInDeep() {
      await deep.guest();
      await deep.login({
        linkId: await deep.id("deep", "admin")
      });
    }
    loginAsAdminInDeep();
  }, []);

  useEffect(() => {
    async function initializeDevice() {
      const isDevicePackageInstalled = await deep.select({
        type_id: {
          _id: ["@deep-foundation/core", "Contain"],
        },
        from_id: deep.linkId,
        to: {
          type_id: {
            _id: ["@deep-foundation/core", "Package"]
          },
          string: {
            value: DEVICE_PACKAGE_NAME
          }
        }
      });
      if(!isDevicePackageInstalled) {
        await initializePackage(deep);
      }
      if (!deviceLinkId) {
        const deviceTypeLinkId = await deep.id(DEVICE_PACKAGE_NAME, "Device");
        const { data: [{ id: newDeviceLinkId }] } = await deep.insert({
          type_id: deviceTypeLinkId
        })
        console.log({ newDeviceLinkId });
        setDeviceLinkId(newDeviceLinkId);
      }
    }

    initializeDevice();
  }, [])

  return (<>
    <ChakraProvider>
      <Provider>
        <DeepProvider>
          <h1>Deep.Foundation sdk examples</h1>
          <Text>Device Link Id: {deviceLinkId}</Text>
          <div><Link href="/all">all subscribe</Link></div>
          <div><Link href="/messanger">messanger</Link></div>
          <div><Link href="/device">device</Link></div>
        </DeepProvider>
      </Provider>
    </ChakraProvider>
  </>);
}