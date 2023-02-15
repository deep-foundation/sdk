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

export const delay = (time) => new Promise(res => setTimeout(() => res(null), time));

export function Extension() {
  const deep = useDeep();
  const [auth, setAuth] = useState(false);
  const [tabsSubscription, setTabsSubscription] = useState(false);
  const [tabs, setTabs] = useLocalStore("Tabs", []);
  const [history, setHistory] = useLocalStore("History", []);
  const router = useRouter();

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
    const uploadHistory = async (history) => {
      await deep.guest();
      await deep.login({linkId: await deep.id("deep", 'admin')});
      const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
      const browserHistoryTypeLinkId = await deep.id(deep.linkId, "BrowserHistory");
      const pageTypeLinkId = await deep.id(PACKAGE_NAME, "Page");
      const urlTypeLinkId = await deep.id(PACKAGE_NAME, "Url");
      const titleTypeLinkId = await deep.id(PACKAGE_NAME, "Title");
      const typedCountTypeLinkId = await deep.id(PACKAGE_NAME, "TypedCount");
      const visitCountTypeLinkId = await deep.id(PACKAGE_NAME, "VisitCount");
      const lastVisitTimeTypeLinkId = await deep.id(PACKAGE_NAME, "LastVisitTime");
      await deep.insert(history.map((page) => ({
        type_id: pageTypeLinkId,
        string: { data: { value: `ID:${page.id}` } },
        in: {
          data: [{
            type_id: containTypeLinkId,
            from_id: browserHistoryTypeLinkId,
          }]
        },
        out: {
          data: [
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: urlTypeLinkId,
                  string: { data: { value: page.url } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: titleTypeLinkId,
                  string: { data: { value: page.title } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: typedCountTypeLinkId,
                  string: { data: { value: page.typedCount.toString() } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: visitCountTypeLinkId,
                  string: { data: { value: page.visitCount.toString() } },
                }
              }
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: lastVisitTimeTypeLinkId,
                  string: { data: { value: page.lastVisitTime.toString() } },
                }
              }
            }]
        }
      })))
      setHistory([]);
    }
    if (history.length > 0) uploadHistory(history);
  }, [history])

  const createBrowserHistoryLink = async (deep) => {
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const { data: [{ id: browserHistoryLinkId }] } = await deep.insert({
      type_id: await deep.id(PACKAGE_NAME, "BrowserHistory"),
      in: {
        data: [{
          type_id: containTypeLinkId,
          from_id: await deep.id('deep', 'admin'),
          string: { data: { value: "BrowserHistory" } },
        }]
      }
    })
  }

  return (
    <>
      <Stack>
        <Button style={{ background: auth ? "green" : "red" }} onClick={async () => await authUser(deep)}>ADMIN</Button>
        <Button onClick={async () => await initializePackage(deep)} >INITIALIZE PACKAGE</Button>
        <Button onClick={async () => await createBrowserHistoryLink(deep)} >CREATE NEW BROWSERHISTORY LINK</Button>
        <Button onClick={() => setTabsSubscription(true)}>SUBSCRIBE TO TABS</Button>
        <Button onClick={() => setTabsSubscription(false)}>UNSUBSCRIBE</Button>
        <Button onClick={async () => await getHistory()} >UPLOAD HISTORY</Button>
        <Button onClick={() => router.push('/test')}>TEST PAGE</Button>
      </Stack>
      {tabs?.map((tab) => (<Tab type="tab" key={tab.id} id={tab.id} favIconUrl={tab.favIconUrl} title={tab.title} url={tab.url} />))}
      {history?.map((page) => (<Tab type="page" key={page.id} id={page.id} favIconUrl={page.favIconUrl} title={page.title} url={page.url} />))}
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