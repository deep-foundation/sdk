import { ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { PACKAGE_NAME } from './package-name';
import { PACKAGE_NAME as DEVICE_PACKAGE_NAME } from "./../device/package-name";
import { generateApolloClient } from "@deep-foundation/hasura/client";
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
dotenv.config();

async function installPackage() {

  const apolloClient = generateApolloClient({
    path: process.env.NEXT_PUBLIC_GQL_PATH || '', // <<= HERE PATH TO UPDATE
    ssl: !!~process.env.NEXT_PUBLIC_GQL_PATH.indexOf('localhost') ? false : true,
    // admin token in prealpha deep secret key
    // token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsibGluayJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJsaW5rIiwieC1oYXN1cmEtdXNlci1pZCI6IjI2MiJ9LCJpYXQiOjE2NTYxMzYyMTl9.dmyWwtQu9GLdS7ClSLxcXgQiKxmaG-JPDjQVxRXOpxs',
  });
  const unloginedDeep = new DeepClient({ apolloClient });
  const guest = await unloginedDeep.guest();
  const guestDeep = new DeepClient({ deep: unloginedDeep, ...guest });
  const admin = await guestDeep.login({ linkId: await guestDeep.id('deep', 'admin') });
  const deep = new DeepClient({ deep: guestDeep, ...admin });

  const typeTypeLinkId = await deep.id('@deep-foundation/core', 'Type');
  const anyTypeLinkId = await deep.id('@deep-foundation/core', 'Any');
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const packageTypeLinkId = await deep.id('@deep-foundation/core', 'Package');
  const joinTypeLinkId = await deep.id('@deep-foundation/core', 'Join');
  const valueTypeLinkId = await deep.id('@deep-foundation/core', 'Value');
  const numberTypeLinkId = await deep.id('@deep-foundation/core', 'Number');
  const treeTypeLinkId = await deep.id('@deep-foundation/core', 'Tree');
  const treeIncludeNodeTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'TreeIncludeNode'
  );
  const treeIncludeUpTypeLinkId = await deep.id('@deep-foundation/core', 'TreeIncludeUp');
  const treeIncludeDownTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'TreeIncludeDown'
  );

  {
    const { data: [packageLinkId] } = await deep.select({
      type_id: packageTypeLinkId,
      string: {
        value: {
          _eq: PACKAGE_NAME
        }
      }
    })
    if (packageLinkId) {
      console.info("Package is already installed");
      return;
    }
  }

  const { data: [devicePackageLinkId] } = await deep.select({
    type_id: packageTypeLinkId,
    string: {
      value: {
        _eq: DEVICE_PACKAGE_NAME
      }
    }
  })
  if (!devicePackageLinkId) {
    execSync('npx ts-node ./imports/device/install-package.ts', { encoding: 'utf-8', stdio: 'inherit' })
    // throw new Error(`${DEVICE_PACKAGE_NAME} package is not installed`)
  }

  const deviceTypeLinkId = await deep.id(DEVICE_PACKAGE_NAME, "Device");

  const {
    data: [{ id: packageLinkId }],
  } = await deep.insert({
    type_id: packageTypeLinkId,
    string: { data: { value: PACKAGE_NAME } },
    in: {
      data: [
        {
          type_id: containTypeLinkId,
          from_id: deep.linkId,
        },
      ],
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
      ],
    },
  });

  const { data: [{ id: actionSheetTreeLinkId }] } = await deep.insert({
    type_id: treeTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: 'MotionTree' } },
      },
    }
  })

  await deep.insert([
    {
      type_id: typeTypeLinkId,
      from_id: deviceTypeLinkId,
      to_id: deviceTypeLinkId,
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
      from_id: deviceTypeLinkId,
      to_id: deviceTypeLinkId,
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
      from_id: deviceTypeLinkId,
      to_id: deviceTypeLinkId,
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
      from_id: deviceTypeLinkId,
      to_id: deviceTypeLinkId,
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
      from_id: deviceTypeLinkId,
      to_id: deviceTypeLinkId,
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
      from_id: deviceTypeLinkId,
      to_id: deviceTypeLinkId,
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
      from_id: deviceTypeLinkId,
      to_id: deviceTypeLinkId,
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
      from_id: deviceTypeLinkId,
      to_id: deviceTypeLinkId,
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
      from_id: deviceTypeLinkId,
      to_id: deviceTypeLinkId,
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
          string: { data: { value: 'AccelerationInterval' } },
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
          string: { data: { value: 'OrientationInterval' } },
        }
      },
      out: {
        data: {
          type_id: valueTypeLinkId,
          to_id: numberTypeLinkId
        }
      }
    }])
    
}

installPackage();