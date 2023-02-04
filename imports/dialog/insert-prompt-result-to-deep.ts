import { PromptResult } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertPromptResultToDeep({ deep, deviceLinkId, promptLinkId, promptResult }: { deep: DeepClient, deviceLinkId: number, promptLinkId: number, promptResult: PromptResult }) {
  const promptValueTypeLinkdId = await deep.id(PACKAGE_NAME, "PromptResultValue");
  const syncTextFileTypeLinkdId = await deep.id("@deep-foundation/core", "SyncTextFile");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  await deep.insert([
    {
      type_id: promptValueTypeLinkdId,
      from_id: promptLinkId,
      to: {
        data: {
          type_id: syncTextFileTypeLinkdId,
          string: {
            data: {
              value: promptResult.value
            }
          },
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }
          }
        }
      },
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: deep.linkId
        }
      }
    },
    {
      type_id: promptResult.cancelled ? await deep.id(PACKAGE_NAME, "PromptResultIsCancelled") : await deep.id(PACKAGE_NAME, "PromptIsNotCancelled"),
      from_id: deviceLinkId,
      to_id: promptLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: deep.linkId
        }
      }
    }
  ])
}