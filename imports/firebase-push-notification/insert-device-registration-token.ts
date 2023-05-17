import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertDeviceRegistrationToken({
  deep, deviceRegistrationToken, deviceLinkId
}: {
  deep: DeepClient;
  deviceRegistrationToken: string;
  deviceLinkId: number;
}): Promise<{ deviceRegistrationTokenLinkId: number }> {
  const deviceRegistrationTokenTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'DeviceRegistrationToken'
  );
  const containTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Contain'
  );

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
      data: [{
        type_id: containTypeLinkId,
        from_id: deviceLinkId,
      },
      ],
    },
  });
  return { deviceRegistrationTokenLinkId };

};