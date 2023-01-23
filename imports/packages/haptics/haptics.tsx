import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Haptics } from '@capacitor/haptics';
import {
  useDeep,
  useDeepSubscription,
} from "@deep-foundation/deeplinks/imports/client";
import { useState, useEffect } from 'react'

export function useHapticVibrate({ deviceLinkId }: { deviceLinkId: any }) {
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
  })

  const ml = new ManagerLinks(deep);

  const vibrateLinks = useDeepSubscription({ type_id: vibrateType, _not: { in: { type_id: { _eq: vibratedType } } } });
  for (const vibrateLink of vibrateLinks.data) {
    const vibrateLinkId = vibrateLink.id
    Haptics.vibrate();
    deep.insert({
      type_id: vibratedType,
      to_id: vibrateLinkId,
      in: {
        data: {
          type_id: 3,
          from_id: deviceLinkId,
          string: { data: { value: "Vibrated" } },
        },
      },
    })
  }
}

export async function createHapticPackage({ deep, deviceLinkId }: { deep: DeepClient, deviceLinkId: any }) {
  const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type");
  const packageTypeLinkId = await deep.id("@deep-foundation/core", "Package");

  const ml = new ManagerLinks(deep);

  const hapticPackage = await ml.createLink({
    value: "@deep-foundation/haptics",
    contain_from_id: deviceLinkId,
    type_id: packageTypeLinkId,
  });

  const Vibrate = await ml.createLink({
    containName: "Vibrate",
    contain_from_id: hapticPackage,
    type_id: typeTypeLinkId,
  });
  const Vibrated = await ml.createLink({
    containName: "Vibrated",
    contain_from_id: hapticPackage,
    type_id: typeTypeLinkId,
    to_id: 8
  });
}

class ManagerLinks {
  constructor(private deep: DeepClient) { }

  async createLink({
    containName,
    value,
    contain_from_id,
    type_id,
    to_id,
  }: {
    containName?: string;
    value?: string;
    contain_from_id: number;
    type_id: number;
    to_id?: number;
  }) {
    const {
      data: [{ id }],
    } = await this.deep.insert({
      type_id: type_id,
      ...(to_id && { to_id: to_id }),
      ...(value && { string: { data: { value: value } } }),
      in: {
        data: {
          type_id: 3,
          from_id: contain_from_id, // 362
          ...(containName && { string: { data: { value: containName } } }),
        },
      },
    });
    return id;
  }
}
