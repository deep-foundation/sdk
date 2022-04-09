import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ApolloClientTokenizedProvider } from '@deep-foundation/react-hasura/apollo-client-tokenized-provider';
import { TokenProvider, useTokenController } from '@deep-foundation/deeplinks/imports/react-token';
import { useQuery, useSubscription, gql } from '@apollo/client';
import { LocalStoreProvider, useLocalStore } from '@deep-foundation/store/local';
import { MinilinksLink, MinilinksResult, useMinilinksConstruct } from '@deep-foundation/deeplinks/imports/minilinks';
import { useDeep } from '@deep-foundation/deeplinks/imports/client';

import { Button, ChakraProvider, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Box, Text } from "@chakra-ui/react";

const messagesString = `subscription MESSAGES($where: links_bool_exp) { links(where: $where) { id type_id from_id to_id value } }`;
const MESSAGES = gql`${messagesString}`;

function usePreloaded() {
  const pr = useLocalStore('preloaded', null);
  const [preloaded, setPreloaded] = pr;
  const deep = useDeep();
  const p = useRef();
  p.current = preloaded;
  useEffect(() => { (async () => {
    if (!p.current) setPreloaded({
      User: await deep.id('@deep-foundation/core', 'User'),
      Reply: await deep.id('@deep-foundation/messaging', 'Reply'),
      Message: await deep.id('@deep-foundation/messaging', 'Message'),
      messagingTree: await deep.id('@deep-foundation/core', 'system', 'admin', 'messagingTree'),
      setPreloaded,
    });
  })(); }, []);
  return pr;
}

function Item({
  ml, link,
}: {
  ml, link,
}) {
  const deep = useDeep();
  const [preloaded] = usePreloaded();
  const [message, setMessage] = useState('');
  const onReply = () => {
    deep.insert({
      type_id: preloaded.Message,
      string: { data: { value: message } },
      out: { data: {
        type_id: preloaded.Reply,
        to_id: link.id,
      } },
    });
  };
  const reply = (
    <InputGroup size='xs'>
      <Input placeholder='Reply message' value={message} onChange={e => setMessage(e.target.value)}/>
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={onReply}>Send</Button>
      </InputRightElement>
    </InputGroup>
  );
  return <>
    {link.type_id === preloaded.User && <>
      <Box maxW='sm' boxShadow='md' p='3' rounded='md' bg='white'>
        user {link.id}
        {reply}
      </Box>
      <div>{link.inByType?.[preloaded.Reply]?.map(link => {
        return <Item ml={ml} link={link}/>;
      })}</div>
    </>}
    {link.type_id === preloaded.Reply && <div style={{ paddingLeft: 16 }}>
      <div style={{ fontSize: 12 }}>reply {link.id} to {link.to_id} with {link.from_id}</div>
      <div>{link.inByType?.[preloaded.Reply]?.map(link => {
        return <Item ml={ml} link={link}/>;
      })}</div>
      {!!link.from && <div>
        <Item ml={ml} link={link.from}/>
      </div>}
    </div>}
    {link.type_id === preloaded.Message && <div style={{ paddingLeft: 16 }}>
      <Box maxW='sm' boxShadow='md' p='3' rounded='md' bg='white'>
        <Text fontSize='xs'>message {link.id}</Text>
        {deep.stringify(link?.value?.value)}
        {reply}
      </Box>
      <div>{link.inByType?.[preloaded.Reply]?.map(link => {
        return <Item ml={ml} link={link}/>;
      })}</div>
    </div>}
  </>;
}

function Messages({
  repliesTo,
}: {
  repliesTo: number[];
}) {
  const [preloaded] = usePreloaded();
  const q = useSubscription(MESSAGES, { variables: { where: { _by_item: {
    group_id: { _eq: preloaded.messagingTree }, path_item_id: { _in: repliesTo },
  } } } });
  const minilinks: any = useMinilinksConstruct();
  const ml = useMemo(() => {
    if (q?.data?.links) minilinks.ml.apply(q.data.links);
    return minilinks.ml;
  }, [q.data]);
  return <>
    {repliesTo.map(id => {
      const link = ml.byId[id] || null;
      return !!link && <Item ml={ml} link={link}/>;
    })}
  </>
}

function Messager({
  repliesTo,
}: {
  repliesTo: number[];
}) {
  const [preloaded] = usePreloaded();
  return <>
    {!!preloaded && <Messages repliesTo={repliesTo}/>}
  </>;
}

function Content() {
  const [gqlUrlInput, setGqlUrlInput] = useGqlUrlInput();
  const [tokenInput, setTokenInput] = useTokenInput();
  const [linkInput, setLinkInput] = useLinkInput();
  const [gqlUrl, setGqlUrl] = useGqlUrl();
  const [token, setToken] = useTokenController();
  const [preloaded, setPreloaded] = usePreloaded();
  const deep = useDeep();
  return <>
    <hr/>
    <div>
      <Button onClick={(e) => {
        setPreloaded();
        setGqlUrl(gqlUrlInput);
        deep.login({ 
          token: tokenInput,
        });
      }}>reconnect</Button>
    </div>
    <div>connected to: {gqlUrl}</div>
    <div>token to: {token}</div>
    <hr/>
    <div>
      link for loading messages from it:
      <InputGroup size='xs' width='xs'>
        <Input value={linkInput} type="number" onChange={e => setLinkInput(e.target.value)}/>
      </InputGroup>
    </div>
    <hr/>
    {!!linkInput && <Messager repliesTo={[+linkInput]}/>}
  </>;
}

function useGqlUrlInput() { return useLocalStore('gqlUrlInput', ''); }
function useTokenInput() { return useLocalStore('tokenInput', ''); }
function useLinkInput() { return useLocalStore('linkInput', ''); }
function useGqlUrl() { return useLocalStore('gqlUrl', ''); }

function Page() {
  const [gqlUrlInput, setGqlUrlInput] = useGqlUrlInput();
  const [tokenInput, setTokenInput] = useTokenInput();
  const [gqlUrl, setGqlUrl] = useGqlUrl();
  const [token, setToken] = useTokenController();
  return <div>
    <div><a href="/">back</a></div>
    <h1>Deep.Foundation nextjs example - messager</h1>
    <div>
      path to gql <b>without protocol</b>:
      <Input size="xs" value={gqlUrlInput} onChange={e => setGqlUrlInput(e.target.value)} placeholder="3006-deepfoundation-dev-XXXXXXXXXXX.XX-XXXX.gitpod.io/gql"/>
    </div>
    <div>
      token of user link (copy from Deep.Case):
      <Input size="xs" value={tokenInput} onChange={e => setTokenInput(e.target.value)}/>
    </div>
    <ApolloClientTokenizedProvider options={{ client: '@deep-foundation/nextjs', path: gqlUrl, ssl: true, token: token, ws: !!process?.browser }}>
      {[<Content key={token+gqlUrl}/>]}
    </ApolloClientTokenizedProvider>
  </div>;
};

export default function Index() {
  return (
    <ChakraProvider>
      <LocalStoreProvider>
        <TokenProvider>
          <Page/>
        </TokenProvider>
      </LocalStoreProvider>
    </ChakraProvider>
  );
}