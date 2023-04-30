import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { BoolExpLink } from "@deep-foundation/deeplinks/imports/client_types";
import { PACKAGE_NAME } from "./package-name";

export async function insertServiceAccount({ deep, serviceAccount, makeActive = false }: { deep: DeepClient, serviceAccount: object, makeActive?: boolean }) {
  console.log({ deep, serviceAccount, makeActive });
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

  if (makeActive) {
    await deep.delete({
      up: {
        tree_id: {_eq: await deep.id("@deep-foundation/core", "containTree")},
        parent: {
          type_id: { _id: ["@deep-foundation/core", "Contain"] },
          to: { type_id: usesServiceAccountTypeLinkId },
          from_id: deep.linkId
        }
      }
    })
  }

  await deep.insert({
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
        ...(makeActive ? [
          {
            type_id: usesServiceAccountTypeLinkId,
            from_id: deep.linkId,
            in: {
              data: [
                {
                  type_id: containTypeLinkId,
                  from_id: deep.linkId,
                },
              ],
            },
          }
        ] : [] )
      ],
    },
  })
}