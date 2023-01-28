import { AccelListenerEvent, RotationRate } from '@capacitor/motion';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { PACKAGE_NAME } from './package-name';

export async function updateOrInsertOrientationDataToDeep({
  deep,
  data,
  deviceLinkId,
}: {
  deep: DeepClient;
  data: RotationRate;
  deviceLinkId: number;
}) {
  const rotationRateTypeLinkId = await deep.id(PACKAGE_NAME, 'RotationRate');
  const rotationAlphaTypeLinkId = await deep.id(PACKAGE_NAME, 'RotationRateAlpha');
  const rotationBetaTypeLinkId = await deep.id(PACKAGE_NAME, 'RotationRateBeta');
  const rotationGammaTypeLinkId = await deep.id(PACKAGE_NAME, 'RotationRateGamma');
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');

  await deep.delete({
    up: {
      tree_id: {
        _id: ['@deep-foundation/core', 'containTree'],
      },
      parent: {
        type_id: containTypeLinkId,
        from_id: deviceLinkId,
        to_id: rotationRateTypeLinkId,
      },
    },
  });

  await deep.insert([
    {
      type_id: rotationRateTypeLinkId,
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
                type_id: rotationAlphaTypeLinkId,
                number: {
                  data: {
                    value: data.alpha,
                  },
                },
              },
            },
          },
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: rotationBetaTypeLinkId,
                number: {
                  data: {
                    value: data.beta,
                  },
                },
              },
            },
          },
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: rotationGammaTypeLinkId,
                number: {
                  data: {
                    value: data.gamma,
                  },
                },
              },
            },
          },
        ],
      },
    },
  ]);
}
