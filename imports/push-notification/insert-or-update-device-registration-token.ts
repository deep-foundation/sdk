import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertOrUpdateDeviceRegistrationToken ({
  deep, deviceRegistrationToken,  deviceLinkId
}: {
  deep: DeepClient;
  deviceRegistrationToken: string;
  deviceLinkId: number;
}): Promise<{deviceRegistrationTokenLinkId: number}> {
  const deviceRegistrationTokenTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'DeviceRegistrationToken'
  );
  const containTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Contain'
  );
  console.log({ deviceLinkId });

  const {data: [deviceRegistrationTokenLink]} = await deep.select({
    type_id: deviceRegistrationTokenTypeLinkId,
    in: {
      type_id: containTypeLinkId,
      from_id: deviceLinkId
    }
  })
  if(!deviceRegistrationTokenLink) {
    const {
      data: [{ id: deviceRegistrationTokenLinkId }],
    } = await deep.insert({
      type_id: deviceRegistrationTokenTypeLinkId,
      string: {
        data: {
          value: deviceRegistrationToken,
        },
      },
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: deviceLinkId,
        },
      },
    });
    return {deviceRegistrationTokenLinkId};
  } else {
    await deep.update({
      id: deviceRegistrationTokenLink.id
    }, {
      value: deviceRegistrationToken
    }, {
      table: 'strings'
    })
    return {deviceRegistrationTokenLinkId: deviceRegistrationTokenLink.id};
  }
};