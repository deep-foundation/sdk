import { Dialog } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";
import { getAlertOptionsFromDeep } from "./get-alert-options-from-deep";
import { getConfirmOptionsFromDeep } from "./get-confirm-options-from-deep";
import { getPromptOptionsFromDeep } from "./get-prompt-options-from-deep";
import { insertConfirmResultToDeep } from "./insert-confirm-result-to-deep";
import { insertPromptResultToDeep } from "./insert-prompt-result-to-deep";
import { PACKAGE_NAME } from "./package-name";

export async function notifyDialog({ deep, deviceLinkId, dialogLink }: { deep: DeepClient, deviceLinkId: number, dialogLink: Link<number> }) {

  const alertTypeLinkId = await deep.id(PACKAGE_NAME, "Alert");
  const promptTypeLinkId = await deep.id(PACKAGE_NAME, "Prompt");
  const confirmTypeLinkId = await deep.id(PACKAGE_NAME, "Confirm");

  if (dialogLink.type_id === alertTypeLinkId) {
    const alertOptions = await getAlertOptionsFromDeep({
      deep,
      alertLinkId: dialogLink.id,
    });
    await Dialog.alert(alertOptions);
  } else if (dialogLink.type_id === promptTypeLinkId) {
    const promptOptions = await getPromptOptionsFromDeep({
      deep,
      promptLinkId: dialogLink.id,
    });
    const promptResult = await Dialog.prompt(promptOptions);
    await insertPromptResultToDeep({deep, deviceLinkId, promptLinkId: dialogLink.id,promptResult})
  } else if (dialogLink.type_id === confirmTypeLinkId) {
    const confirmOptions = await getConfirmOptionsFromDeep({
      deep,
      confirmLinkId: dialogLink.id
    })
    const confirmResult = await Dialog.confirm(confirmOptions);
    await insertConfirmResultToDeep({deep, deviceLinkId, confirmLinkId: dialogLink.id, confirmResult})
  }
}

