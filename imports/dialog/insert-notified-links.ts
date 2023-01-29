import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";
import { PACKAGE_NAME } from "./package-name";

export async function insertNotifiedLinks({deep, deviceLinkId, notNotifiedLinks}: {deep: DeepClient, deviceLinkId: number, notNotifiedLinks: Link<number>[]}) {
  const notifiedTypeLinkid = await deep.id(PACKAGE_NAME, 'Notified');
  await deep.insert(
    notNotifiedLinks.map((notNotifiedNotifyAlertLink) => ({
      type_id: notifiedTypeLinkid,
      from_id: notNotifiedNotifyAlertLink.id,
      to_id: deviceLinkId,
    }))
  );
}