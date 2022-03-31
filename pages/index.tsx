import React, { useMemo, useState } from 'react';
import { ApolloClientTokenizedProvider } from '@deep-foundation/react-hasura/apollo-client-tokenized-provider';
import { TokenProvider, useTokenController } from '@deep-foundation/deeplinks/imports/react-token';
import { useQuery, useSubscription, gql } from '@apollo/client';
import { LocalStoreProvider, useLocalStore } from '@deep-foundation/store/local';
import { MinilinksLink, MinilinksResult, useMinilinksConstruct } from '@deep-foundation/deeplinks/imports/minilinks';

export default function Index() {
  return (<>
    <h1>Deep.Foundation nextjs examples</h1>
    <div><a href="/all">all subscribe</a></div>
    <div><a href="/messanger">messanger</a></div>
  </>);
}