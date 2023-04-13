import { DeepClient, useDeepSubscription } from "@deep-foundation/deeplinks/imports/client";
import { useEffect, useState } from "react";
import { PACKAGE_NAME } from "./dialog/package-name";

export function useSubscriptionToPackageContainedInUser({deep}: {deep: DeepClient}): {isPackageInstalled: boolean} {
  const [isPackageInstalled, setIsPackageInstalled] = useState<boolean | undefined>(undefined);

  const {
    data,
    loading,
  } = useDeepSubscription({
    type_id: {
      _id: ['@deep-foundation/core', 'Contain'],
    },
    from_id: deep.linkId,
    to: {
      type_id: {
        _id: ['@deep-foundation/core', 'Package'],
      },
      string: {
        value: PACKAGE_NAME,
      },
    },
  });


  useEffect(() => {
    console.log({data, loading});
    if (loading) {
      return;
    }
    const isPackageInstalled = data.length > 0;
    setIsPackageInstalled(isPackageInstalled);
  }, [data]);

  return {isPackageInstalled};
}