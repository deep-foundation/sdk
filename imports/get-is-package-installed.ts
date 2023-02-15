import { DeepClient } from "@deep-foundation/deeplinks/imports/client";

export async function getIsPackageInstalled({deep, packageName} : {deep: DeepClient, packageName: string}): Promise<boolean> {
  const packageSelectResponse = await deep.select({
    type_id: {
      _id: ['@deep-foundation/core', 'Contain'],
    },
    from_id: deep.linkId,
    to: {
      type_id: {
        _id: ['@deep-foundation/core', 'Package'],
      },
      string: {
        value: packageName,
      },
    },
  });
  const isPackageInstalled =
    packageSelectResponse.data.length > 0;

    return isPackageInstalled;
}