import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { BoolExpLink, ComparasionType } from "@deep-foundation/deeplinks/imports/client_types";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";
import { useEffect } from "react";
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

  useEffect(() => {
    callback({notNotifiedLinks})
  }, [notNotifiedLinks])
}