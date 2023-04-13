import { Dialog } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";
import { getAlertOptionsFromDeep } from "./get-alert-options-from-deep";
import { getConfirmOptionsFromDeep } from "./get-confirm-options-from-deep";
import { getPromptOptionsFromDeep } from "./get-prompt-options-from-deep";
import { insertConfirmResultToDeep } from "./insert-confirm-result-to-deep";
import { insertPromptResultToDeep } from "./insert-prompt-result-to-deep";
import { PACKAGE_NAME } from "./package-name";

export async function notifyDialog({ deep, deviceLinkId, notifyLink }: { deep: DeepClient, deviceLinkId: number, notifyLink: Link<number> }) {

  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const alertTypeLinkId = await deep.id(PACKAGE_NAME, "Alert");
  const promptTypeLinkId = await deep.id(PACKAGE_NAME, "Prompt");
  const confirmTypeLinkId = await deep.id(PACKAGE_NAME, "Confirm");

  if(!notifyLink.from) {
    throw new Error(`##${notifyLink.id} passed to notifyDialog must have from. Use returning in your select or subscription query to have it.`)
  }

  const dialogLink = notifyLink.from;

  if (dialogLink.type_id === alertTypeLinkId) {
    const alertOptions = await getAlertOptionsFromDeep({ deep, alertLinkId: notifyLink.from_id });
    await Dialog.alert(alertOptions);
  } else if (dialogLink.type_id === promptTypeLinkId) {
    console.log("Before prompt options") 
    const promptOptions = await getPromptOptionsFromDeep({ deep, promptLinkId: notifyLink.from_id });
    console.log({promptOptions})
    const promptResult = await Dialog.prompt(promptOptions);
    await insertPromptResultToDeep({
      deep,
      deviceLinkId,
      notifyLinkId: notifyLink.id,
      promptResult
    })
  } else if (dialogLink.type_id === confirmTypeLinkId) {
    const confirmOptions = await getConfirmOptionsFromDeep({ deep, confirmLinkId: notifyLink.from_id });
    const confirmResult = await Dialog.confirm(confirmOptions);
    await insertConfirmResultToDeep({
      deep,
      deviceLinkId,
      notifyLinkId: notifyLink.id,
      confirmResult
    })
  }
  
  await deep.insert({
    type_id: await deep.id(PACKAGE_NAME, "Notified"),
    from_id: notifyLink.id,
    to_id: deviceLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: deep.linkId
      }
    }
  });
}

