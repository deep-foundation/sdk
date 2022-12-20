import React, { useMemo, useState } from 'react';
import { ApolloClientTokenizedProvider } from '@deep-foundation/react-hasura/apollo-client-tokenized-provider';
import { TokenProvider, useTokenController } from '@deep-foundation/deeplinks/imports/react-token';
import { useQuery, useSubscription, gql } from '@apollo/client';
import { LocalStoreProvider, useLocalStore } from '@deep-foundation/store/local';
import { MinilinksLink, MinilinksResult, useMinilinksConstruct } from '@deep-foundation/deeplinks/imports/minilinks';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import { DeepProvider } from '@deep-foundation/deeplinks/imports/client';
import Link from 'next/link';

export default function Index() {
  return (<>
        <ChakraProvider>
        <Provider>
          <DeepProvider>
            <h1>Deep.Foundation nextjs examples</h1>
            <div><Link href="/all">all subscribe</Link></div>
            <div><Link href="/messanger">messanger</Link></div>
            <div><Link href="/device">device</Link></div>
          </DeepProvider>
        </Provider>
      </ChakraProvider>
  </>);
}