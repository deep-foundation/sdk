import { ConfirmResult, Dialog, PromptResult } from '@capacitor/dialog';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';
import { getAlertOptionsFromDeep } from './get-alert-options-from-deep';
import { getPromptOptionsFromDeep } from './get-prompt-options-from-deep';
import { getConfirmOptionsFromDeep } from './get-confirm-options-from-deep';
import { insertConfirmResultsToDeep } from './insert-confirm-results-to-deep';
import { insertPromptResultsToDeep } from './insert-prompt-results-to-deep';

export async function confirm({
  deep,
  alertLinks,
}: {
  deep: DeepClient;
  alertLinks: Link<number>[];
}): Promise<{ confirmResults: ConfirmResult[] }> {
  const confirmResults: ConfirmResult[] = [];
  for (const alertLink of alertLinks) {
    const confirmOptions = await getConfirmOptionsFromDeep({
      deep,
      confirmLinkId: alertLink.id,
    });
    const confirmResult = await Dialog.confirm(confirmOptions);
    confirmResults.push(confirmResult);
  }
  return { confirmResults };
}
