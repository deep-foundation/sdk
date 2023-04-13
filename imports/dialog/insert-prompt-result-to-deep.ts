import { PromptResult } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertPromptResultToDeep({ deep, deviceLinkId, notifyLinkId, promptResult }: { deep: DeepClient, deviceLinkId: number, notifyLinkId: number, promptResult: PromptResult }) {
  const promptValueTypeLinkdId = await deep.id(PACKAGE_NAME, "PromptValue");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  await deep.insert([
    {
      type_id: promptValueTypeLinkdId,
      from_id: deviceLinkId,
      to_id: notifyLinkId,
      string: {
        data: {
          value: promptResult.value
        }
      },
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: deep.linkId,
        }
      }
    },
    {
      type_id: promptResult.cancelled ? await deep.id(PACKAGE_NAME, "PromptIsCancelled") : await deep.id(PACKAGE_NAME, "PromptIsNotCancelled"),
      from_id: deviceLinkId,
      to_id: notifyLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: deep.linkId
        }
      }
    }
  ])
}