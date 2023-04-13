import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertWebPushCertificate({deep, webPushCertificate,shouldMakeActive}:{deep: DeepClient, webPushCertificate: string, shouldMakeActive: boolean}) {
  const containTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Contain'
  );
  const webPushCertificateTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'WebPushCertificate'
  );
  const usesWebPushCertificateTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'UsesWebPushCertificate'
  );

  if (shouldMakeActive) {
    await deep.delete({
      up: {
        tree_id: {_eq: await deep.id("@deep-foundation/core", "containTree")},
        parent: {
          type_id: { _id: ["@deep-foundation/core", "Contain"] },
          to: { type_id: usesWebPushCertificateTypeLinkId },
          from_id: deep.linkId
        }
      }
    })
  }

  await deep.insert({
    type_id: webPushCertificateTypeLinkId,
    string: {
      data: {
        value: webPushCertificate,
      },
    },
    in: {
      data: [
        {
          type_id: containTypeLinkId,
          from_id: deep.linkId,
        },
        ...(shouldMakeActive ? [
          {
            type_id: usesWebPushCertificateTypeLinkId,
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