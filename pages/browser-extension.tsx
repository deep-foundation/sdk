import { useEffect, useState } from "react";
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep, } from "@deep-foundation/deeplinks/imports/client";
import { Provider } from "../imports/provider";

import initializePackage from "../imports/browser-extension/initialize-package";
import { PACKAGE_NAME } from "../imports/browser-extension/initialize-package";
import Tab from "./tab";
import Link from "next/link";
import { useRouter } from 'next/router'
import uploadHistory from "../imports/browser-extension/upload-history";
import uploadTabs from "../imports/browser-extension/upload-tabs";

export const delay = (time) => new Promise(res => setTimeout(() => res(null), time));

export function Extension() {
  const deep = useDeep();
  const [auth, setAuth] = useState(false);
  const [tabsSubscription, setTabsSubscription] = useState(false);
  const [tabs, setTabs] = useLocalStore("Tabs", []);
  const [history, setHistory] = useLocalStore("History", []);
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  const authUser = async (deep) => {
    await deep.guest();
    const { linkId, token, error } = await deep.login({
      linkId: await deep.id("deep", 'admin')
    })
    token ? setAuth(true) : setAuth(false)
  };

  useEffect(() => {
    let update = true;
    const updateTabs = async (tabsSubscription) => {
      for (; typeof (window) === "object" && tabsSubscription && update;) {
        const newTabs = await chrome.tabs.query({});
        setTabs(newTabs);
        await delay(1000);
      }
    }
    if (tabsSubscription) updateTabs(tabsSubscription);
    return () => { update = false };
  }, [tabsSubscription])

  const getHistory = async () => {
    if (typeof (window) === "object") {
      const newHistory = await chrome.history.search({ text: '', maxResults: 10 });
      setHistory(newHistory);
    }
  }

  useEffect(() => {
    const upload = async (tabs) => {
      await uploadTabs(deep, deviceLinkId, tabs);
      setHistory([]);
    }
    if (tabs.length > 0) upload(tabs);
  }, [tabs])

  useEffect(() => {
    const upload = async (history) => {
      await uploadHistory(deep, deviceLinkId, history);
      setHistory([]);
    }
    if (history.length > 0) upload(history);
  }, [history])

  const createBrowserHistoryLink = async (deep) => {
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const { data: [{ id: browserHistoryLinkId }] } = await deep.insert({
      type_id: await deep.id(PACKAGE_NAME, "BrowserHistory"),
      in: {
        data: [{
          type_id: containTypeLinkId,
          from_id: deviceLinkId,
          string: { data: { value: "BrowserHistory" } },
        }]
      }
    })
  }

  return (
    <>
      <Stack>
        <Button style={{ background: auth ? "green" : "red" }} onClick={async () => await authUser(deep)}>ADMIN</Button>
        <Button onClick={async () => await initializePackage(deep, deviceLinkId)} >INITIALIZE PACKAGE</Button>
        <Button onClick={async () => await createBrowserHistoryLink(deep)} >CREATE NEW BROWSERHISTORY LINK</Button>
        <Button onClick={async () => await getHistory()} >UPLOAD HISTORY</Button>
        <Button onClick={() => setTabsSubscription(true)}>UPLOAD TABS</Button>
        <Button onClick={() => {setTabsSubscription(false); setTabs([])}}>UNSUBSCRIBE</Button>
      </Stack>
      {tabs?.map((tab) => (<Tab type="tab" key={tab.id} id={tab.id} favIconUrl={tab.favIconUrl} title={tab.title} url={tab.url} />))}
    </>
  )
}

export default function ExtensionPage() {
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