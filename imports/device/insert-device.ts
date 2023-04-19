import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { DEVICE_PACKAGE_NAME } from "./package-name";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";

export async function insertDevice({deep}: {deep: DeepClient}) {
   const deviceTypeLinkId = await deep.id(DEVICE_PACKAGE_NAME, 'Device');
          const containTypeLinkId = await deep.id(
            '@deep-foundation/core',
            'Contain'
          );
          let {
            data: [deviceLink],
          } = await deep.insert(
            {
              type_id: deviceTypeLinkId,
              in: {
                data: [
                  {
                    type_id: containTypeLinkId,
                    from_id: deep.linkId,
                  },
                ],
              },
            },
            { returning: deep.selectReturning }
          );

          return {deviceLink} as {deviceLink: Link<number>}
}