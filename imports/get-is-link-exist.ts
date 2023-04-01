import { DeepClient } from "@deep-foundation/deeplinks/imports/client";

export async function getIsLinkExist({ deep, packageName, linkName }: { deep: DeepClient, packageName: string, linkName: string }): Promise<boolean> {

  const { data: linkSelectResponse } = await deep.select({
    type_id: {
      _id: [packageName, linkName],
    },
  });

  const isLinkExist = linkSelectResponse.length > 0;
  return isLinkExist;
}


