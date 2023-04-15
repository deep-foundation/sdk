import { DeepClient, useDeepSubscription } from "@deep-foundation/deeplinks/imports/client";
import { useRef, useEffect } from "react";
import { notifyActionSheet } from "./notify-action-sheet";
import { PACKAGE_NAME } from "./package-name";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";

export function useActionSheetSubscription({deep, deviceLinkId}: {deep: DeepClient,deviceLinkId: number}) {
  const notifyLinksBeingProcessed = useRef<Link<number>[]>([]);

  const {
    data: notifyLinks,
    loading,
    error,
  } = useDeepSubscription({
    type_id: {
      _id: [PACKAGE_NAME, 'Notify'],
    },
    _not: {
      out: {
        type_id: {
          _id: [PACKAGE_NAME, 'Notified'],
        },
        to_id: deviceLinkId,
      },
    },
    from: {
      type_id: {
        _id: [PACKAGE_NAME, 'ActionSheet'],
      },
    },
    to_id: deviceLinkId,
  });

  useEffect(() => {
    if(error) {
      console.error(error.message)
    }
    if(loading) {
      return
    }
    new Promise(async () => {
      const notProcessedNotifyLinks = notifyLinks.filter(link => !notifyLinksBeingProcessed.current.find(linkBeingProcessed => linkBeingProcessed.id === link.id));
      if(notProcessedNotifyLinks.length === 0) {
        return
      }
      notifyLinksBeingProcessed.current = [...notifyLinksBeingProcessed.current, ...notProcessedNotifyLinks];
      for (const notifyLink of notProcessedNotifyLinks) {
        await notifyActionSheet({
          deep,
          deviceLinkId,
          notifyLink
        })
      }
      const processedNotifyAlertLinks = notProcessedNotifyLinks;
      notifyLinksBeingProcessed.current = notifyLinksBeingProcessed.current.filter(link => !processedNotifyAlertLinks.find(processedNotifyLink => processedNotifyLink.id === link.id))
    });
  }, [notifyLinks, loading, error]);
}