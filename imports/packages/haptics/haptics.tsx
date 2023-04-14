import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Haptics } from '@capacitor/haptics';
import {
  useDeep,
  useDeepSubscription,
} from "@deep-foundation/deeplinks/imports/client";
import { useState, useEffect, useRef } from 'react'
import { PACKAGE_NAME } from "./package-name";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";

export function useHapticVibrate({ deep, deviceLinkId }: { deep: DeepClient, deviceLinkId: number }) {
  const linksBeingProcessed = useRef<Array<Link<number>>>();

  const { data: vibrateLinks, loading, error } = useDeepSubscription({ type_id: { _id: [PACKAGE_NAME, "Vibrate"] }, _not: { in: { type_id: { _id: [PACKAGE_NAME, 'Vibrated'] } } } });

  useEffect(() => {
    new Promise(async () => {
      if(error) {
        console.error(error.message)
      }
      if(loading) {
        return
      }
      const notProcessedLinks = vibrateLinks.filter(link => !linksBeingProcessed.current.find(linkBeingProcessed => linkBeingProcessed.id === link.id));
      if (notProcessedLinks.length === 0) {
        return
      }
      linksBeingProcessed.current = [...linksBeingProcessed.current, ...notProcessedLinks];
      const vibratedTypeLinkId = await deep.id(PACKAGE_NAME, "Vibrated");
      const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
      for (const vibrateLink of notProcessedLinks) {
        const vibrateLinkId = vibrateLink.id
        await Haptics.vibrate();
        await deep.insert({
          type_id: vibratedTypeLinkId,
          from_id: vibrateLinkId,
          to_id: vibrateLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deviceLinkId,
            },
          },
        })
      }
      const processedLinks = notProcessedLinks;
      linksBeingProcessed.current = linksBeingProcessed.current.filter(link => !processedLinks.find(processedNotifyLink => processedNotifyLink.id === link.id))
    })
  }, [vibrateLinks, loading, error])
}


