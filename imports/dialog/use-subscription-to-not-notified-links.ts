import { useDeepSubscription } from '@deep-foundation/deeplinks/imports/client';
import { PACKAGE_NAME } from './package-name';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';
import { useEffect, useState } from 'react';
import { ComparasionType } from '@deep-foundation/deeplinks/imports/client_types';

export function useSubscriptionToNotNotifiedLinks({
  type_id,
  deviceLinkId,
}: {
  type_id: ComparasionType<number>;
  deviceLinkId: number;
}): { notNotifiedLinks: Link<number>[] } {
  const [notNotifiedLinks, setNotNotifiedLinks] = useState<Link<number>[]>([]);

  const { data, loading } = useDeepSubscription({
    type_id: {
      _id: [PACKAGE_NAME, 'Notify'],
    },
    from: {
      type_id: type_id,
    },
    to_id: deviceLinkId,
    _not: {
      out: {
        type_id: {
          _id: [PACKAGE_NAME, 'Notified'],
        },
        to_id: deviceLinkId,
      },
    },
  });

  useEffect(() => {
    if (loading) {
      return;
    }
    setNotNotifiedLinks(data);
  }, [data]);

  return { notNotifiedLinks };
}
