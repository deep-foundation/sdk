import { useDeepSubscription } from '@deep-foundation/deeplinks/imports/client';
import { useState, useEffect } from 'react';

export function useIsPackageInstalled({packageName, shouldIgnoreResultWhenLoading, onError} : {packageName: string, shouldIgnoreResultWhenLoading: boolean, onError: ({error}:{error: {message: string}}) => void}) {
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
    if(shouldIgnoreResultWhenLoading && loading) {
      return;
    }
    if(error) {
      onError({error})
    }
    setIsPackageInstalled(data.length > 0);
  }, [data, loading, error]);

  return {isPackageInstalled , loading, error}
}
