import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";
import { PACKAGE_NAME } from "./package-name";

export async function insertNotifiedLinks({deep, deviceLinkId, links}: {deep: DeepClient, deviceLinkId: number, links: Link<number>[]}) {
  const notifiedTypeLinkid = await deep.id(PACKAGE_NAME, 'Notified');
  await deep.insert(
    links.map((notNotifiedNotifyAlertLink) => ({
      type_id: notifiedTypeLinkid,
      from_id: notNotifiedNotifyAlertLink.id,
      to_id: deviceLinkId,
    }))
  );
}