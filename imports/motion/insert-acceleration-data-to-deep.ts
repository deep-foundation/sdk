import { AccelListenerEvent } from "@capacitor/motion";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertMotionDataToDeep({ deep, accelData, deviceLinkId }: { deep: DeepClient, accelData: AccelListenerEvent, deviceLinkId: number }) {
  const accelerationTypeLinkId = await deep.id(PACKAGE_NAME, "Acceleration");
  const accelerationIncludingGravityTypeLinkId = await deep.id(PACKAGE_NAME, "AccelerationIncludingGravity");
  const accelerationXTypeLinkId = await deep.id(PACKAGE_NAME, "AccelerationX");
  const accelerationYTypeLinkId = await deep.id(PACKAGE_NAME, "AccelerationY");
  const accelerationZTypeLinkId = await deep.id(PACKAGE_NAME, "AccelerationZ");
  const rotationRateTypeLinkId = await deep.id(PACKAGE_NAME, "RotationRate");
  const rotationRateAlphaTypeLinkId = await deep.id(PACKAGE_NAME, "RotationRateAlpha");
  const rotationRateBetaTypeLinkId = await deep.id(PACKAGE_NAME, "RotationRateBeta");
  const rotationRateGammaTypeLinkId = await deep.id(PACKAGE_NAME, "RotationRateGamma");
  const intervalTypeLinkId = await deep.id(PACKAGE_NAME, "Interval");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");

  await deep.insert([
    {
      type_id: accelerationTypeLinkId,
      out: {
        data: [{
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: accelerationXTypeLinkId,
              number: {
                data: {
                  value: accelData.acceleration.x
                }
              }
            }
          },
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: accelerationYTypeLinkId,
              number: {
                data: {
                  value: accelData.acceleration.y
                }
              }
            }
          },
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: accelerationZTypeLinkId,
              number: {
                data: {
                  value: accelData.acceleration.z
                }
              }
            }
          },
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        }]
      },
      in: {
        data: [{
          type_id: containTypeLinkId,
          from_id: deviceLinkId
        }]
      }
    },
    {
      type_id: accelerationIncludingGravityTypeLinkId,
      out: {
        data: [{
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: accelerationXTypeLinkId,
              number: {
                data: {
                  value: accelData.accelerationIncludingGravity.x
                }
              }
            }
          },
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: accelerationYTypeLinkId,
              number: {
                data: {
                  value: accelData.accelerationIncludingGravity.y
                }
              }
            }
          },
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: accelerationZTypeLinkId,
              number: {
                data: {
                  value: accelData.accelerationIncludingGravity.z
                }
              }
            }
          },
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        }]
      },
      in: {
        data: [{
          type_id: containTypeLinkId,
          from_id: deviceLinkId
        }]
      }
    }
    ,
    {
      type_id: rotationRateTypeLinkId,
      out: {
        data: [{
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: rotationRateAlphaTypeLinkId,
              number: {
                data: {
                  value: accelData.rotationRate.alpha
                }
              }
            }
          },
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: rotationRateBetaTypeLinkId,
              number: {
                data: {
                  value: accelData.rotationRate.beta
                }
              }
            }
          },
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: rotationRateGammaTypeLinkId,
              number: {
                data: {
                  value: accelData.rotationRate.gamma
                }
              }
            }
          },
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId
            }]
          }
        }]
      },
      in: {
        data: [{
          type_id: containTypeLinkId,
          from_id: deviceLinkId
        }]
      }
    },
    {
      type_id: intervalTypeLinkId,
      number: {
        data: {
          value: accelData.interval
        }
      }
    }
  ]);


}