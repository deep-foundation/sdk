import { AccelListenerEvent, RotationRate } from '@capacitor/motion';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { BoolExp, BoolExpLink } from '@deep-foundation/deeplinks/imports/client_types';
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
  const orientationTypeLinkId = await deep.id(PACKAGE_NAME, 'Orientation');
  const rotationAlphaTypeLinkId = await deep.id(PACKAGE_NAME, 'RotationRateAlpha');
  const rotationBetaTypeLinkId = await deep.id(PACKAGE_NAME, 'RotationRateBeta');
  const rotationGammaTypeLinkId = await deep.id(PACKAGE_NAME, 'RotationRateGamma');
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');

  const { data: [orientationLink] } = await deep.select({
    type_id: orientationTypeLinkId,
    in: {
      type_id: containTypeLinkId,
      from_id: deviceLinkId,
    }
  })

  if (!orientationLink) {
    await deep.insert([
      {
        type_id: orientationTypeLinkId,
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
    ])
  } else {
    const rotationAlphaLinkQuery: BoolExpLink = {
      type_id: {
        _eq: rotationAlphaTypeLinkId
      },
      in: {
        type_id: {
          _eq: containTypeLinkId
        },
        from_id: {
          _eq: orientationLink.id
        }
      }
    }
    const { data: [valueLinkOfRotationAlphaLink] } = await deep.select({
      link: rotationAlphaLinkQuery,
    },
      {
        table: 'numbers', returning: `
      id
      link {
        id
      }
      ` });
    const rotatinAlphaLinkId = valueLinkOfRotationAlphaLink.link.id;
    await deep.update(
      {
        id: { _eq: valueLinkOfRotationAlphaLink.id }
      },
      {
        value: data.alpha
      },
      {
        table: "numbers"
      }
    )

    const rotationBetaLinkQuery: BoolExpLink = {
      type_id: {
        _eq: rotationBetaTypeLinkId
      },
      in: {
        type_id: {
          _eq: containTypeLinkId
        },
        from_id: {
          _eq: orientationLink.id
        }
      }
    }
    const { data: [valueLinkOfRotationBetaLink] } = await deep.select({
      link: rotationBetaLinkQuery,
    },
      {
        table: 'numbers', returning: `
      id
      link {
        id
      }
      ` });
    const rotatinBetaLinkId = valueLinkOfRotationBetaLink.link.id;
    await deep.update(
      {
        id: { _eq: valueLinkOfRotationBetaLink.id }
      },
      {
        value: data.beta
      },
      {
        table: "numbers"
      }
    )

    const rotationGammaLinkQuery: BoolExpLink = {
      type_id: {
        _eq: rotationGammaTypeLinkId
      },
      in: {
        type_id: {
          _eq: containTypeLinkId
        },
        from_id: {
          _eq: orientationLink.id
        }
      }
    }
    const { data: [valueLinkOfRotationGammaLink] } = await deep.select({
      link: rotationGammaLinkQuery,
    },
      {
        table: 'numbers', returning: `
      id
      link {
        id
      }
      ` });
    const rotatinGammaLinkId = valueLinkOfRotationGammaLink.link.id;
    await deep.update(
      {
        id: { _eq: valueLinkOfRotationGammaLink.id }
      },
      {
        value: data.gamma
      },
      {
        table: "numbers"
      }
    )
  }
}

