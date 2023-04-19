import { DeepClient, useDeepSubscription } from "@deep-foundation/deeplinks/imports/client";
import { useRef, useEffect } from "react";
import { DIALOG_PACKAGE_NAME } from "./package-name";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";
import { notifyDialog } from "./notify-dialog";

export function useDialogSubscription({deep, deviceLinkId}: {deep: DeepClient,deviceLinkId: number}) {
  if(!deviceLinkId) {
    throw new Error("deviceLinkId is required")
  }

  const notifyLinksBeingProcessed = useRef<Link<number>[]>([]);

  const { data: notifyLinks, loading, error } = useDeepSubscription({
    type_id: {
      _id: [DIALOG_PACKAGE_NAME, "Notify"]
    },
    _not: {
      out: {
        type_id: {
          _id: [DIALOG_PACKAGE_NAME, "Notified"]
        }
      }
    },
    from: {
      _or: [
        {
          type_id: {
            _id: [DIALOG_PACKAGE_NAME, "Alert"]
          },
        },
        {
          type_id: {
            _id: [DIALOG_PACKAGE_NAME, "Prompt"]
          },
        },
        {
          type_id: {
            _id: [DIALOG_PACKAGE_NAME, "Confirm"]
          },
        }
      ]
    },
    to_id: deviceLinkId
  }, 
  {
    returning: `${deep.selectReturning}
    from {
      ${deep.selectReturning}
    }
    `
  })


  useEffect(() => {
    if(error){
      console.error(error.message)
    }
    if (loading) {
      return
    }
    new Promise(async () => {
      const notProcessedNotifyLinks = notifyLinks.filter(link => !notifyLinksBeingProcessed.current.find(linkBeingProcessed => linkBeingProcessed.id === link.id));
      notifyLinksBeingProcessed.current = [...notifyLinksBeingProcessed.current, ...notProcessedNotifyLinks];
      for (const notifyLink of notProcessedNotifyLinks) {
        await notifyDialog({
          deep,
          deviceLinkId,
          notifyLink
        });
      };
      const processedNotifyAlertLinks = notProcessedNotifyLinks;
      notifyLinksBeingProcessed.current = notifyLinksBeingProcessed.current.filter(link => !processedNotifyAlertLinks.find(processedNotifyLink => processedNotifyLink.id === link.id))
    })
  }, [notifyLinks, loading, error])
}