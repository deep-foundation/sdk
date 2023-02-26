import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function getLanguageOption({deep, linkId}: {deep: DeepClient, linkId: number}): Promise<string> {
  const languageTypeLinkId = await deep.id(PACKAGE_NAME, "Language");
  const {data: [linkWithString]} = await deep.select({
    in: {
      type_id: languageTypeLinkId,
      from_id: linkId
    }
  })
  if(!linkWithString) {
    throw new Error(`A link with type ##${languageTypeLinkId} associated with ${linkId} is not found`)
  }
  if(!linkWithString.value?.value) {
    throw new Error(`${linkWithString.id} must have a value`)
  }  

  return linkWithString.value.value;
}