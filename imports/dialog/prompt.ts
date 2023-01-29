import { Dialog, PromptResult } from '@capacitor/dialog';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';
import { getAlertOptionsFromDeep } from './get-alert-options-from-deep';
import { getPromptOptionsFromDeep } from './get-prompt-options-from-deep';
import { insertPromptResultsToDeep } from './insert-prompt-results-to-deep';

export async function prompt({
  deep,
  notNotifiedLinks,
}: {
  deep: DeepClient;
  notNotifiedLinks: Link<number>[];
}): Promise<{ promptResults: PromptResult[] }> {
  const promptResults: PromptResult[] = [];
  for (const notNotifiedNotifyPromptLink of notNotifiedLinks) {
    const promptOptions = await getPromptOptionsFromDeep({
      deep,
      promptLinkId: notNotifiedNotifyPromptLink.id,
    });
    const promptResult = await Dialog.prompt(promptOptions);
    promptResults.push(promptResult);
  }
  return { promptResults };
}
