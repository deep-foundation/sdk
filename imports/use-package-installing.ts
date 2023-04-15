import { DeepClient, useDeepSubscription } from "@deep-foundation/deeplinks/imports/client";
import { useEffect } from "react";
import { DIALOG_PACKAGE_NAME } from "./dialog/package-name";
import { useSubscriptionToPackageContainedInUser } from "./use-subscription-to-package";

export function usePackageInstalling({deep, installPackageCallback}: {deep: DeepClient, installPackageCallback: () => Promise<void>}) { 
  const {isPackageInstalled} = useSubscriptionToPackageContainedInUser({deep});

  useEffect(() => {
    new Promise(async () => {
      if (isPackageInstalled === false) {
        await installPackageCallback()
      } 
    })
  },[isPackageInstalled])
}