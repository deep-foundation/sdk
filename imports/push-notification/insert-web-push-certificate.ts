import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertWebPushCertificate({deep, webPushCertificate}:{deep: DeepClient, webPushCertificate: string}) {
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

  await deep.insert({
    type_id: usesWebPushCertificateTypeLinkId,
    from_id: deep.linkId,
    to: {
      data: {
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