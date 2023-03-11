import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertServiceAccount({deep, serviceAccount}: {deep: DeepClient, serviceAccount: string}) {
  const containTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Contain'
  );
  const serviceAccountTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'ServiceAccount'
  );
  const usesServiceAccountTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'UsesServiceAccount'
  );

  await deep.insert({
    type_id: usesServiceAccountTypeLinkId,
    from_id: deep.linkId,
    to: {
      data: {
        type_id: serviceAccountTypeLinkId,
        object: {
          data: {
            value: serviceAccount,
          },
        },
        in: {
          data: [
            {
              type_id: containTypeLinkId,
              from_id: deep.linkId,
            },
          ],
        },
      }
    },
    in: {
      data: [
        {
          type_id: containTypeLinkId,
          from_id: deep.linkId,
        },
      ],
    },
  });

}