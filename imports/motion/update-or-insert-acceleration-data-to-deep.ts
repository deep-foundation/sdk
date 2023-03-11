import { AccelListenerEvent } from '@capacitor/motion';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { BoolExpLink } from '@deep-foundation/deeplinks/imports/client_types';
import { PACKAGE_NAME } from './package-name';

export async function updateOrInsertAccelerationDataToDeep({
  deep,
  data,
  deviceLinkId,
}: {
  deep: DeepClient;
  data: AccelListenerEvent;
  deviceLinkId: number;
}) {
  const accelerationTypeLinkId = await deep.id(PACKAGE_NAME, 'Acceleration');
  const accelerationXTypeLinkId = await deep.id(PACKAGE_NAME, 'AccelerationX');
  const accelerationYTypeLinkId = await deep.id(PACKAGE_NAME, 'AccelerationY');
  const accelerationZTypeLinkId = await deep.id(PACKAGE_NAME, 'AccelerationZ');
  const accelerationXIncludingGravityTypeLinkId = await deep.id(PACKAGE_NAME, 'AccelerationXIncludingGravity');
  const accelerationYIncludingGravityTypeLinkId = await deep.id(PACKAGE_NAME, 'AccelerationYIncludingGravity');
  const accelerationZIncludingGravityTypeLinkId = await deep.id(PACKAGE_NAME, 'AccelerationZIncludingGravity');
  const rotationAlphaTypeLinkId = await deep.id(PACKAGE_NAME, 'RotationRateAlpha');
  const rotationBetaTypeLinkId = await deep.id(PACKAGE_NAME, 'RotationRateBeta');
  const rotationGammaTypeLinkId = await deep.id(PACKAGE_NAME, 'RotationRateGamma');
  const intervalTypeLinkId = await deep.id(PACKAGE_NAME, 'Interval');
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');

  const { data: [accelerationLink] } = await deep.select({
    type_id: accelerationTypeLinkId,
    in: {
      type_id: containTypeLinkId,
      from_id: deviceLinkId,
    }
  })

  if (!accelerationLink) {
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
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: accelerationXIncludingGravityTypeLinkId,
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
                  type_id: accelerationYIncludingGravityTypeLinkId,
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
                  type_id: accelerationZIncludingGravityTypeLinkId,
                  number: {
                    data: {
                      value: data.accelerationIncludingGravity.z,
                    },
                  },
                },
              },
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: intervalTypeLinkId,
                  number: {
                    data: {
                      value: data.interval,
                    },
                  },
                },
              },
            },
            {
              type_id: containTypeLinkId,
              to: {
                data: {
                  type_id: rotationAlphaTypeLinkId,
                  number: {
                    data: {
                      value: data.rotationRate.alpha,
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
                      value: data.rotationRate.beta,
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
                      value: data.rotationRate.gamma,
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
    const accelerationXLinkLinkQuery: BoolExpLink = {
      type_id: {
        _eq: accelerationXTypeLinkId
      },
      in: {
        type_id: {
          _eq: containTypeLinkId
        },
        from_id: {
          _eq: accelerationLink.id
        }
      }
    }
    const { data: [valueLinkOfAccelerationXLink] } = await deep.select({
      link: accelerationXLinkLinkQuery,
    },
      {
        table: 'numbers', returning: `
        id
        `
      });
    await deep.update(
      {
        id: { _eq: valueLinkOfAccelerationXLink.id }
      },
      {
        value: data.acceleration.x
      },
      {
        table: "numbers", returning: `
        id
        `
      }
    )

    const accelerationYLinkLinkQuery: BoolExpLink = {
      type_id: {
        _eq: accelerationYTypeLinkId
      },
      in: {
        type_id: {
          _eq: containTypeLinkId
        },
        from_id: {
          _eq: accelerationLink.id
        }
      }
    }
    const { data: [valueLinkOfAccelerationYLink] } = await deep.select({
      link: accelerationYLinkLinkQuery,
    },
      {
        table: 'numbers', returning: `
        id
        `
      });
    await deep.update(
      {
        id: { _eq: valueLinkOfAccelerationYLink.id }
      },
      {
        value: data.acceleration.y
      },
      {
        table: "numbers"
      }
    )

    const accelerationZLinkLinkQuery: BoolExpLink = {
      type_id: {
        _eq: accelerationZTypeLinkId
      },
      in: {
        type_id: {
          _eq: containTypeLinkId
        },
        from_id: {
          _eq: accelerationLink.id
        }
      }
    }
    const { data: [valueLinkOfAccelerationZLink] } = await deep.select({
      link: accelerationZLinkLinkQuery,
    },
      {
        table: 'numbers', returning: `
        id
        `
      });
    await deep.update(
      {
        id: { _eq: valueLinkOfAccelerationZLink.id }
      },
      {
        value: data.acceleration.z
      },
      {
        table: "numbers", returning: `
        id
        `
      }
    )

    const accelerationXLinkIncludingGravityLinkQuery: BoolExpLink = {
      type_id: {
        _eq: accelerationXTypeLinkId
      },
      in: {
        type_id: {
          _eq: containTypeLinkId
        },
        from_id: {
          _eq: accelerationLink.id
        }
      }
    }
    const { data: [valueLinkOfAccelerationXIncludingGravityLink] } = await deep.select({
      link: accelerationXLinkIncludingGravityLinkQuery,
    },
      {
        table: 'numbers', returning: `
        id
        `
      });
    await deep.update(
      {
        id: { _eq: valueLinkOfAccelerationXIncludingGravityLink.id }
      },
      {
        value: data.acceleration.x
      },
      {
        table: "numbers", returning: `
        id
        `
      }
    )

    const accelerationYLinkIncludingGravityLinkQuery: BoolExpLink = {
      type_id: {
        _eq: accelerationYTypeLinkId
      },
      in: {
        type_id: {
          _eq: containTypeLinkId
        },
        from_id: {
          _eq: accelerationLink.id
        }
      }
    }
    const { data: [valueLinkOfAccelerationYIncludingGravityLink] } = await deep.select({
      link: accelerationYLinkIncludingGravityLinkQuery,
    },
      {
        table: 'numbers', returning: `
        id
        `
      });
    await deep.update(
      {
        id: { _eq: valueLinkOfAccelerationYIncludingGravityLink.id }
      },
      {
        value: data.acceleration.y
      },
      {
        table: "numbers", returning: `
        id
        `
      }
    )


    const accelerationZLinkIncludingGravityLinkQuery: BoolExpLink = {
      type_id: {
        _eq: accelerationZTypeLinkId
      },
      in: {
        type_id: {
          _eq: containTypeLinkId
        },
        from_id: {
          _eq: accelerationLink.id
        }
      }
    }
    const { data: [valueLinkOfAccelerationZIncludingGravityLink] } = await deep.select({
      link: accelerationZLinkIncludingGravityLinkQuery,
    },
      {
        table: 'numbers', returning: `
        id
        `
      });
    await deep.update(
      {
        id: { _eq: valueLinkOfAccelerationZIncludingGravityLink.id }
      },
      {
        value: data.acceleration.z
      },
      {
        table: "numbers", returning: `
        id
        `
      }
    )

    const intervalLinkQuery: BoolExpLink = {
      type_id: {
        _eq: intervalTypeLinkId
      },
      in: {
        type_id: {
          _eq: containTypeLinkId
        },
        from_id: {
          _eq: accelerationLink.id
        }
      }
    }
    const { data: [valueLinkOfIntervalLink] } = await deep.select({
      link: intervalLinkQuery,
    },
      {
        table: 'numbers', returning: `
        id
        `
      });
    await deep.update(
      {
        id: { _eq: valueLinkOfIntervalLink.id }
      },
      {
        value: data.interval
      },
      {
        table: "numbers", returning: `
        id
        `
      }
    )
  }
}
