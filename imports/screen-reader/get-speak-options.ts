import { SpeakOptions } from "@capacitor/screen-reader";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { getLanguageOption } from "./get-language-option";
import { getValueOption } from "./get-value-option";
import { PACKAGE_NAME } from "./package-name";

export async function getSpeakOptions({deep, linkId}: {deep: DeepClient, linkId: number}): Promise<SpeakOptions> {
  return {
    value: await getValueOption({
      deep,
      linkId
    }),
    language: await getLanguageOption({
      deep,
      linkId
    })
  }
}