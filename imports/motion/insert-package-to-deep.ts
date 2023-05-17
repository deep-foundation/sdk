import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { MOTION_PACKAGE_NAME } from "./package-name";
import { PACKAGE_NAME as DEVICE_PACKAGE_NAME } from "./../device/package-name";

export async function insertPackageToDeep({ deep }: { deep: DeepClient }) {

  const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const packageTypeLinkId = await deep.id("@deep-foundation/core", "Package");
  const joinTypeLinkId = await deep.id("@deep-foundation/core", "Join");
  const valueTypeLinkId = await deep.id("@deep-foundation/core", "Value");
  const numberTypeLinkId = await deep.id("@deep-foundation/core", "Number");

  const { data: [{ id: packageLinkId }] } = await deep.insert({
    type_id: packageTypeLinkId,
    string: { data: { value: MOTION_PACKAGE_NAME } },
    in: {
      data: [
        {
          type_id: containTypeLinkId,
          from_id: deep.linkId
        },
      ]
    },
    out: {
      data: [
        {
          type_id: joinTypeLinkId,
          to_id: await deep.id('deep', 'users', 'packages'),
        },
        {
          type_id: joinTypeLinkId,
          to_id: await deep.id('deep', 'admin'),
        },
      ]
    },
  });


  await deep.insert([
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'Acceleration' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    },
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'AccelerationX' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    },
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'AccelerationY' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    },
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'AccelerationZ' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    },
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'AccelerationXIncludingGravity' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    },
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'AccelerationYIncludingGravity' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    },
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'AccelerationZIncludingGravity' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    },
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'Orientation' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    },
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'RotationRateAlpha' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    },
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'RotationRateBeta' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    },
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'RotationRateGamma' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    },
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'Interval' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    },
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'SubscribeToAcceleration' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    },
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'SubscribeToOrientation' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    },]);
}