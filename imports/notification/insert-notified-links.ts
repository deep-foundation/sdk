import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";
import { PACKAGE_NAME } from "./package-name";

export async function insertNotifiedLinks({deep, deviceLinkId, notifyLinkIds}: {deep: DeepClient, deviceLinkId: number, notifyLinkIds: number[]}) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const notifiedTypeLinkid = await deep.id(PACKAGE_NAME, 'Notified');
  await deep.insert(
    notifyLinkIds.map((notifyLinkId) => ({
      type_id: notifiedTypeLinkid,
      from_id: notifyLinkId,
      to_id: deviceLinkId,
      in: {
        data: [
          {
            type_id: containTypeLinkId,
            from_id: deep.linkId
          },
        ]
      }
    }))
  );
}