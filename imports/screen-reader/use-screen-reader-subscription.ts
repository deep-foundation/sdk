import { ScreenReader } from "@capacitor/screen-reader";
import { DeepClient, useDeepSubscription } from "@deep-foundation/deeplinks/imports/client";
import { useRef, useEffect } from "react";
import { getSpeakOptions } from "./get-speak-options";
import { CAPACITOR_SCREEN_READER_PACKAGE_NAME } from "./package-name";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";

export async function useScreenReaderSubscription({deep, deviceLinkId}: {deep: DeepClient,deviceLinkId: number}) {
  if(!deviceLinkId) {
    throw new Error("deviceLinkId is required")
  }

  const notifyLinksBeingProcessed = useRef<Link<number>[]>([]);
  const {
    data: notifyLinks,
    loading,
    error,
  } = useDeepSubscription({
    type_id: {
      _id: [CAPACITOR_SCREEN_READER_PACKAGE_NAME, 'Notify'],
    },
    _not: {
      out: {
        type_id: {
          _id: [CAPACITOR_SCREEN_READER_PACKAGE_NAME, 'Notified'],
        },
      },
    },
    to_id: deviceLinkId,
  });

  useEffect(() => {
    if(error) {
      console.error(error.message)
    }
    if (loading) {
      return;
    }
    new Promise(async () => {
      const containTypeLinkId = await deep.id(
        '@deep-foundation/core',
        'Contain'
      );
      const notProcessedNotifyLinks = notifyLinks.filter(
        (link) => !notifyLinksBeingProcessed.current.includes(link)
      );
      notifyLinksBeingProcessed.current = [
        ...notifyLinksBeingProcessed.current,
        ...notProcessedNotifyLinks,
      ];
      for (const notifyLink of notifyLinks) {
        const options = await getSpeakOptions({
          deep,
          linkId: notifyLink.from_id,
        });
        await ScreenReader.speak(options);
        await deep.insert({
          type_id: await deep.id(CAPACITOR_SCREEN_READER_PACKAGE_NAME, "Notified"),
          from_id: notifyLink.id,
          to_id: deviceLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }
          }
        });
      }
      const processedNotifyLinks = notProcessedNotifyLinks;
      notifyLinksBeingProcessed.current =
        notifyLinksBeingProcessed.current.filter(
          (link) => !processedNotifyLinks.includes(link)
        );
    });
  }, [notifyLinks, loading, error]);
}