import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { ComparasionType } from "@deep-foundation/deeplinks/imports/client_types";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";
import { useEffect } from "react";
import { PACKAGE_NAME } from "./package-name";
import { useSubscriptionToNotNotifiedLinks } from "./use-subscription-to-not-notified-links";

export async function useNotNotifiedLinksHandling({
  deep,
  type_id,
  deviceLinkId,
  callback
}: {
  deep: DeepClient;
  type_id: ComparasionType<number>;
  deviceLinkId: number;
  callback: ({notNotifiedLinks} : {notNotifiedLinks: Link<number>[]}) => Promise<void>;
}) {
  const { notNotifiedLinks } = useSubscriptionToNotNotifiedLinks({
    deviceLinkId,
    type_id: {
      _id: [PACKAGE_NAME, 'Alert'],
    }
  })

  useEffect(() => {
    callback({notNotifiedLinks})

  }, [notNotifiedLinks])
}