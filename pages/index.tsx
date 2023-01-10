import { useEffect, useState } from "react";
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { useLocalStore } from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
} from "@deep-foundation/deeplinks/imports/client";
import { Provider } from "../imports/provider";
// import TabCard from "./tab";


export function Extension() {
  const deep = useDeep();
  const [auth, setAuth] = useState(false);
  const [tabsUpdate, setTabsUpdate] = useState(false);
  const [tabs, setTabs] = useLocalStore("Tabs", []);

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
    if (typeof (window) === "object" && tabsUpdate) {
      const interval = setInterval(() => {
        chrome.tabs.query({}, newTabs => {
          setTabs([...tabs, newTabs]);
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [tabsUpdate])


  useEffect(() => {
    console.log({ tabs });
  }, [tabs])

  return (
    <Stack>
      <Button style={{ background: auth ? "green" : "red" }}>ADMIN</Button>
      <Button onClick={() => setTabsUpdate(true)}>SUBSCRIBE TO TABS</Button>
      <Button onClick={() => setTabsUpdate(false)}>UNSUBSCRIBE</Button>
      {/* {tabs.length > 0 ? <TabCard id={tabs[0].id} stringA={tabs[0].url} stringB={tabs[0].id} /> : null} */}
    </Stack>
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