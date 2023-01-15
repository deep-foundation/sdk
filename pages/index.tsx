import { useEffect, useState } from "react";
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep, } from "@deep-foundation/deeplinks/imports/client";
import { Provider } from "../imports/provider";
import Tab from "./tab";

export const delay = (time) => new Promise(res => setTimeout(() => res(null), time));

export function Extension() {
  const deep = useDeep();
  const [auth, setAuth] = useState(false);
  const [tabsUpdate, setTabsUpdate] = useState(false);
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    const authUser = async () => {
      await deep.guest();
      const { linkId, token, error } = await deep.login({
        linkId: await deep.id("deep", 'admin')
      })
      token ? setAuth(true) : setAuth(false)
    };
    authUser();
  })

  useEffect(() => {
    let update = true;
    const updateTabs = async () => {
      for (; typeof (window) === "object" && tabsUpdate && update; ) {
        const newTabs = await chrome.tabs.query({});
        setTabs(newTabs);
        await delay(5000);
      }
    }
    if (tabsUpdate) updateTabs();
    return () => { update = false };
  }, [tabsUpdate])

  return (
    <>
      <Stack>
        <Button style={{ background: auth ? "green" : "red" }}>ADMIN</Button>
        <Button onClick={() => setTabsUpdate(true)}>SUBSCRIBE TO TABS</Button>
        <Button onClick={() => setTabsUpdate(false)}>UNSUBSCRIBE</Button>
      </Stack>
      {tabs?.map((tab) => (<Tab key={tab.id} id={tab.id} favIconUrl={tab.favIconUrl} title={tab.title} url={tab.url} />))}
    </>
  )
}

export default function Index() {
  return (
    <>
      <ChakraProvider>
        <Provider>
          <DeepProvider>
            <Extension />
          </DeepProvider>
        </Provider>
      </ChakraProvider>
    </>
  );
}