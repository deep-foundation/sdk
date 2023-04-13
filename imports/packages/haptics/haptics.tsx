import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Haptics } from '@capacitor/haptics';
import {
  useDeep,
  useDeepSubscription,
} from "@deep-foundation/deeplinks/imports/client";
import { useState, useEffect } from 'react'

export function useHapticVibrate({ deviceLinkId }: { deviceLinkId: number }) {
  const [vibratedType, setVibratedType] = useState(0);
  const [vibrateType, setVibrateType] = useState(0);

  const deep = useDeep();

  useEffect(() => {
    deep.id("@deep-foundation/haptics", "Vibrate").then((vibrateType) => {
      setVibrateType(vibrateType)
    })
    deep.id("@deep-foundation/haptics", "Vibrated").then((vibratedType) => {
      setVibratedType(vibratedType)
    })
  }, [])


  const vibrateLinks = useDeepSubscription({ type_id: vibrateType, _not: { in: { type_id: { _eq: vibratedType } } } });
  for (const vibrateLink of vibrateLinks.data) {
    const vibrateLinkId = vibrateLink.id
    Haptics.vibrate();
    deep.insert({
      type_id: vibratedType,
      from_id: vibrateLinkId,
      to_id: vibrateLinkId,
      in: {
        data: {
          type_id: 3,
          from_id: deviceLinkId,
        },
      },
    })
  }
}
export async function initPackageHaptic({ deep }: { deep: DeepClient }) {
  const typeContainLinkId = await deep.id("@deep-foundation/core", "Contain");
  const typePackageQueryLinkId = await deep.id("@deep-foundation/core", "PackageQuery");
  const typeInstallLinkId = await deep.id("@deep-foundation/npm-packager", "Install");

  await deep.insert({
      type_id: typePackageQueryLinkId,
      string: { data: { value: "@deep-foundation/haptics" } },
      in: {
          data: [
              {
                  type_id: typeContainLinkId,
                  from_id: deep.linkId,
              },
              {
                  type_id: typeInstallLinkId,
                  from_id: deep.linkId,
              },
          ]
      },
  })

}
