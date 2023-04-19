import { useDeepSubscription } from '@deep-foundation/deeplinks/imports/client';
import { useState, useEffect } from 'react';

export function useIsPackageInstalled({packageName} : {packageName: string}) {
  const [isPackageInstalled, setIsPackageInstalled] = useState<boolean | undefined>(undefined);

  const { data, loading, error } = useDeepSubscription({
    type_id: {
      _id: ['@deep-foundation/core', 'Package'],
    },
    string: {
      value: packageName,
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error.message);
    }
    if (loading) {
      return;
    }
    console.log({ data });
    setIsPackageInstalled(data.length > 0);
  }, [data, loading, error]);

  return {isPackageInstalled , loading, error}
}
