import React, { useMemo, useState } from 'react';
import { ApolloClientTokenizedProvider } from '@deep-foundation/react-hasura/apollo-client-tokenized-provider';
import { TokenProvider, useTokenController } from '@deep-foundation/deeplinks/imports/react-token';
import { useQuery, useSubscription, gql } from '@apollo/client';
import { LocalStoreProvider, useLocalStore } from '@deep-foundation/store/local';
import { MinilinksLink, MinilinksResult, useMinilinksConstruct } from '@deep-foundation/deeplinks/imports/minilinks';

const allString = `subscription ALL { links { id type_id from_id to_id value } }`;
const ALL = gql`${allString}`;

function SubscribeAllItem({
  ml, link,
}: {
  ml: MinilinksResult<number>;
  link: any;
}) {
  const [mode, setMode] = useState('');
  return <>
    <div>
      {link.id}
      <button disabled={mode == 'in'} onClick={() => setMode('in')}>in ({link?.in?.length})</button>
      <button disabled={mode == 'out'} onClick={() => setMode('out')}>out ({link?.out?.length})</button>
      <button disabled={mode == 'to'} onClick={() => setMode('to')}>to ({link?.to ? 1 : 0})</button>
      <button disabled={mode == 'from'} onClick={() => setMode('from')}>from ({link?.from ? 1 : 0})</button>
      <button disabled={mode == 'type'} onClick={() => setMode('type')}>type ({link?.type ? 1 : 0})</button>
      <button disabled={mode == 'typed'} onClick={() => setMode('typed')}>typed ({link?.typed?.length})</button>
      <button disabled={mode == 'value'} onClick={() => setMode('value')}>value</button>
      <button disabled={mode == ''} onClick={() => setMode('')}>x</button>
    </div>
    <div style={{ paddingLeft: 16 }}>
      {!!mode && (
        mode === 'in'
        ? link.in
        : mode === 'out'
        ? link.out
        : mode === 'to'
        ? [link.to]
        : mode === 'from'
        ? [link.from]
        : mode === 'type'
        ? [link.type]
        : mode === 'typed'
        ? link.typed
        : []
      ).map(l => <SubscribeAllItem ml={ml} link={link}/>)}
      {mode === 'value' && link?.value && <pre><code>{JSON.stringify(link?.value || '', null, 2)}</code></pre>}
    </div>
  </>;
}

function SubscribeAll() {
  const q = useSubscription(ALL);
  const minilinks: any = useMinilinksConstruct();
  const ml = useMemo(() => {
    const ml = minilinks.ml;
    if (q?.data?.links) ml.apply(q.data.links);
    return ml;
  }, [q.data]);
  return <>
    {ml.links.map(link => <SubscribeAllItem ml={ml} link={link}/>)}
  </>;
}

function Content() {
  return <>
    <SubscribeAll/>
  </>;
}

function Page() {
  const [gqlUrlInput, setGqlUrlInput] = useLocalStore('gqlUrlInput', '');
  const [tokenInput, setTokenInput] = useLocalStore('tokenInput', '');
  const [gqlUrl, setGqlUrl] = useLocalStore('gqlUrl', '');
  const [token, setToken] = useTokenController();
  return <div>
    <h1>Deep.Foundation nextjs example</h1>
    <div>
      path to gql <b>without protocol</b>:
      <input value={gqlUrlInput} onChange={e => setGqlUrlInput(e.target.value)}/>
    </div>
    <div>
      token of user link (copy from Deep.Case):
      <input value={tokenInput} onChange={e => setTokenInput(e.target.value)}/>
    </div>
    <hr/>
    <div>
      <button onClick={(e) => {
        setGqlUrl(gqlUrlInput);
        setToken(tokenInput);
      }}>reconnect</button>
    </div>
    <div>connected to: {gqlUrl}</div>
    <div>token to: {token}</div>
    <hr/>
    <ApolloClientTokenizedProvider options={{ client: '@deep-foundation/nextjs', path: gqlUrl, ssl: true, token: token, ws: !!process?.browser }}>
      {[<Content key={token+gqlUrl}/>]}
    </ApolloClientTokenizedProvider>
  </div>;
};

export function Providers({ children }: { children: any }) {
  return <LocalStoreProvider>
    <TokenProvider>
      {children}
    </TokenProvider>
  </LocalStoreProvider>;
}

export default function Index() {
  return <Providers>
    <Page/>
  </Providers>
}