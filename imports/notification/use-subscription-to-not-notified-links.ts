import { useDeepSubscription } from '@deep-foundation/deeplinks/imports/client';
import { PACKAGE_NAME } from './package-name';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';
import { useEffect, useState } from 'react';
import { BoolExpLink, ComparasionType } from '@deep-foundation/deeplinks/imports/client_types';

export function useSubscriptionToNotNotifiedLinks({
  query,
  deviceLinkId,
}: {
  query: BoolExpLink;
  deviceLinkId: number;
}): { notNotifiedLinks: Link<number>[] } {
  const [notNotifiedLinks, setNotNotifiedLinks] = useState<Link<number>[]>([]);
   
  const { data, loading } = useDeepSubscription({
    ...query,
    out: {
      type_id: {
        _id: [PACKAGE_NAME, 'Notify'],
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
    }
  });

  useEffect(() => {
    if (loading) {
      return;
    }
    setNotNotifiedLinks(data);
  }, [data, loading]);

  return { notNotifiedLinks };
}
