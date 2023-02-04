import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { BoolExpLink, ComparasionType } from "@deep-foundation/deeplinks/imports/client_types";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";
import { useEffect, useRef } from "react";
import { PACKAGE_NAME } from "./package-name";
import { useSubscriptionToNotNotifiedLinks } from "./use-subscription-to-not-notified-links";

export async function useNotNotifiedLinksHandling({
  deep,
  query,
  deviceLinkId,
  callback
}: {
  deep: DeepClient;
  query: BoolExpLink;
  deviceLinkId: number;
  callback: ({notNotifiedLinks} : {notNotifiedLinks: Link<number>[]}) => Promise<void>;
}) {
  const { notNotifiedLinks } = useSubscriptionToNotNotifiedLinks({
    deviceLinkId,
    query
  })

  const linksBeingProcessed = useRef<Set<Link<number>>>(new Set());

  useEffect(() => {
   new Promise(async () => {
    if(notNotifiedLinks.length === 0) {
      return
    }
    const linksAreNotBeingProcessed = notNotifiedLinks.filter(link => !linksBeingProcessed.current.has(link));
    linksBeingProcessed.current = new Set([...linksBeingProcessed.current, ...linksAreNotBeingProcessed]);
    await callback({notNotifiedLinks:  linksAreNotBeingProcessed})
    const processedLinks = linksAreNotBeingProcessed;
    linksBeingProcessed.current = new Set([...linksBeingProcessed.current].filter(link => processedLinks.includes(link)));
  })
  }, [notNotifiedLinks])
}