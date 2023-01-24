import { AccelListenerEvent, RotationRate } from "@capacitor/motion";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertOrientationDataToDeep({ deep, orientationData, deviceLinkId }: { deep: DeepClient, orientationData: RotationRate, deviceLinkId: number }) {
  const rotationTypeLinkId = await deep.id(PACKAGE_NAME, "Rotation");
  const rotationAlphaTypeLinkId = await deep.id(PACKAGE_NAME, "RotationAlpha");
  const rotationBetaTypeLinkId = await deep.id(PACKAGE_NAME, "RotationBeta");
  const rotationGammaTypeLinkId = await deep.id(PACKAGE_NAME, "RotationGamma");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");

  await deep.insert([
    {
      type_id: rotationTypeLinkId,
      out: {
        data: [{
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: rotationAlphaTypeLinkId,
              number: {
                data: {
                  value: orientationData.alpha
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
              type_id: rotationBetaTypeLinkId,
              number: {
                data: {
                  value: orientationData.beta
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
              type_id: rotationGammaTypeLinkId,
              number: {
                data: {
                  value: orientationData.gamma
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
  ]);


}