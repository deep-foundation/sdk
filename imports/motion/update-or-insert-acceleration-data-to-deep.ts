import { AccelListenerEvent } from '@capacitor/motion';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { PACKAGE_NAME } from './package-name';

export async function updateOrInsertAccelerationDataToDeep({
  deep,
  data,
  deviceLinkId,
}: {
  deep: DeepClient;
  data: Omit<AccelListenerEvent, 'rotationRate'>;
  deviceLinkId: number;
}) {
  const accelerationTypeLinkId = await deep.id(PACKAGE_NAME, 'Acceleration');
  const accelerationIncludingGravityTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'AccelerationIncludingGravity'
  );
  const accelerationXTypeLinkId = await deep.id(PACKAGE_NAME, 'AccelerationX');
  const accelerationYTypeLinkId = await deep.id(PACKAGE_NAME, 'AccelerationY');
  const accelerationZTypeLinkId = await deep.id(PACKAGE_NAME, 'AccelerationZ');
  const rotationRateTypeLinkId = await deep.id(PACKAGE_NAME, 'RotationRate');
  const rotationRateAlphaTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'RotationRateAlpha'
  );
  const rotationRateBetaTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'RotationRateBeta'
  );
  const rotationRateGammaTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'RotationRateGamma'
  );
  const intervalTypeLinkId = await deep.id(PACKAGE_NAME, 'Interval');
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');

  await deep.delete({
    up: {
      tree_id: {
        _id: ['@deep-foundation/core', 'containTree'],
      },
      parent: {
        type_id: containTypeLinkId,
        from_id: deviceLinkId,
        to: {
          _or: [
            {
              type_id: accelerationTypeLinkId,
            },
            {
              type_id: accelerationIncludingGravityTypeLinkId,
            },
          ],
        },
      },
    },
  });

  await deep.insert([
    {
      type_id: accelerationTypeLinkId,
      in: {
        data: [
          {
            type_id: containTypeLinkId,
            from_id: deviceLinkId,
          },
        ],
      },
      out: {
        data: [
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: accelerationXTypeLinkId,
                number: {
                  data: {
                    value: data.acceleration.x,
                  },
                },
              },
            },
          },
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: accelerationYTypeLinkId,
                number: {
                  data: {
                    value: data.acceleration.y,
                  },
                },
              },
            },
          },
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: accelerationZTypeLinkId,
                number: {
                  data: {
                    value: data.acceleration.z,
                  },
                },
              },
            },
          },
        ],
      },
    },
    {
      type_id: accelerationIncludingGravityTypeLinkId,
      in: {
        data: [
          {
            type_id: containTypeLinkId,
            from_id: deviceLinkId,
          },
        ],
      },
      out: {
        data: [
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: accelerationXTypeLinkId,
                number: {
                  data: {
                    value: data.accelerationIncludingGravity.x,
                  },
                },
              },
            },
          },
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: accelerationYTypeLinkId,
                number: {
                  data: {
                    value: data.accelerationIncludingGravity.y,
                  },
                },
              },
            },
          },
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: accelerationZTypeLinkId,
                number: {
                  data: {
                    value: data.accelerationIncludingGravity.z,
                  },
                },
              },
            },
          },
        ],
      },
    },
    {
      type_id: intervalTypeLinkId,
      number: {
        data: {
          value: data.interval,
        },
      },
    },
  ]);
}
