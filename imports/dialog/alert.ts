import { Dialog } from '@capacitor/dialog';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';
import { getAlertOptionsFromDeep } from './get-alert-options-from-deep';

export async function alert({
  deep,
  links: links,
}: {
  deep: DeepClient;
  links: Link<number>[];
}): Promise<void> {
  for (const notNotifiedNotifyAlertLink of links) {
    const alertOptions = await getAlertOptionsFromDeep({
      deep,
      alertLinkId: notNotifiedNotifyAlertLink.id,
    });
    await Dialog.alert(alertOptions);
  }
}
