import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";
import { PACKAGE_NAME as DEVICE_PACKAGE_NAME } from "../device/package-name";
import { PACKAGE_NAME as NOTIFICATION_PACKAGE_NAME } from "../notification/package-name";
import * as fs from 'fs';
import { generateApolloClient } from '@deep-foundation/hasura/client';
import { execSync } from "child_process";
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

async function installPackage() {
  const apolloClient = generateApolloClient({
    path: process.env.NEXT_PUBLIC_GQL_PATH || '', // <<= HERE PATH TO UPDATE
    ssl: !!~process.env.NEXT_PUBLIC_GQL_PATH.indexOf('localhost')
      ? false
      : true,
    // admin token in prealpha deep secret key
    // token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsibGluayJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJsaW5rIiwieC1oYXN1cmEtdXNlci1pZCI6IjI2MiJ9LCJpYXQiOjE2NTYxMzYyMTl9.dmyWwtQu9GLdS7ClSLxcXgQiKxmaG-JPDjQVxRXOpxs',
  });

  const unloginedDeep = new DeepClient({ apolloClient });
  const guest = await unloginedDeep.guest();
  const guestDeep = new DeepClient({ deep: unloginedDeep, ...guest });
  const admin = await guestDeep.login({
    linkId: await guestDeep.id('deep', 'admin'),
  });
  const deep = new DeepClient({ deep: guestDeep, ...admin });

  const typeTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Type'
  );
  const containTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Contain'
  );
  const packageTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Package'
  );
  const joinTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Join'
  );
  const valueTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Value'
  );
  const stringTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'String'
  );
  const numberTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Number'
  );
  const objectTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Object'
  );
  const anyTypeLinkId = await deep.id(
    "@deep-foundation/core",
    "Any"
  );
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
  const userTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'User'
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

  const { data: [notificationPackageLinkId] } = await deep.select({
    type_id: packageTypeLinkId,
    string: {
      value: {
        _eq: NOTIFICATION_PACKAGE_NAME
      }
    }
  })
  if (!notificationPackageLinkId) {
    execSync('npx ts-node ./imports/notification/install-package.ts', { encoding: 'utf-8', stdio: 'inherit' })
    // throw new Error(`${NOTIFICATION_PACKAGE_NAME} package is not installed`)
  }

  const deviceTypeLinkId = await deep.id(
    DEVICE_PACKAGE_NAME,
    'Device'
  );

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

  const { data: [{ id: pushNotificationTreeLinkId }] } = await deep.insert({
    type_id: treeTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: {
          data: {
            value: "PushNotificationTree"
          }
        }
      }
    }
  });

  await deep.insert([{
    type_id: typeTypeLinkId,
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: 'PushNotification' } },
      },
      {
        type_id: treeIncludeNodeTypeLinkId,
        from_id: pushNotificationTreeLinkId,
        in: {
          data: [
            {
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'TreeIncludeNodePushNotification' } },
            },
          ],
        },
      }
      ],
    },
    out: {
      data: [
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'PushNotificationTitle' } },
            },
            {
              type_id: treeIncludeDownTypeLinkId,
              from_id: pushNotificationTreeLinkId,
              in: {
                data: [
                  {
                    type_id: containTypeLinkId,
                    from_id: packageLinkId,
                    string: { data: { value: 'TreeIncludeDownPushNotificationTitle' } },
                  },
                ],
              },
            }
            ],
          },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'PushNotificationBody' } },
            },
            {
              type_id: treeIncludeDownTypeLinkId,
              from_id: pushNotificationTreeLinkId,
              in: {
                data: [
                  {
                    type_id: containTypeLinkId,
                    from_id: packageLinkId,
                    string: { data: { value: 'TreeIncludeDownPushNotificationBody' } },
                  },
                ],
              },
            }
            ],
          },
          
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: 'PushNotificationImageUrl' } },
            },
            {
              type_id: treeIncludeDownTypeLinkId,
              from_id: pushNotificationTreeLinkId,
              in: {
                data: [
                  {
                    type_id: containTypeLinkId,
                    from_id: packageLinkId,
                    string: { data: { value: 'TreeIncludeDownPushNotificationImageUrl' } },
                  },
                ],
              },
            }
            ],
          },
          
        },
        {
          type_id: await deep.id(NOTIFICATION_PACKAGE_NAME, "Notify"),
          to_id: deviceTypeLinkId,
          in: {
            data: [
              {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'Notify' } },
              },
            ]
          },
          out: {
            data: {
              type_id: await deep.id(NOTIFICATION_PACKAGE_NAME, "Notified"),
              to_id: deviceTypeLinkId,
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'Notified' } },
                },
              },
            },
          }
        },
      ]
    }
  },
  {
    type_id: typeTypeLinkId,
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: 'WebPushCertificate' } },
      },
      {
        type_id: typeTypeLinkId,
        from_id: userTypeLinkId,
        in: {
          data: [{
            type_id: containTypeLinkId,
            from_id: packageLinkId,
            string: { data: { value: 'UsesWebPushCertificate' } },
          },

          ],
        },
      },
      ],
    },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId,
        string: { data: { value: 'TypeOfValueOfWebPushCertificate' } },

      },
    },
  },
  {
    type_id: typeTypeLinkId,
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: 'DeviceRegistrationToken' } },
      },
      ],
    },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId,
        string: { data: { value: 'TypeOfValueOfDeviceRegistrationToken' } },
      },
    },
  },
  {
    type_id: typeTypeLinkId,
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: 'ServiceAccount' } },
      },
      {
        type_id: typeTypeLinkId,
        from_id: userTypeLinkId,
        in: {
          data: [{
            type_id: containTypeLinkId,
            from_id: packageLinkId,
            string: { data: { value: 'UsesServiceAccount' } },
          },

          ],
        },
      },],
    },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: objectTypeLinkId,
        string: { data: { value: 'TypeOfValueOfServiceAccount' } },
      },
    },
  }
  ]);

  const fileTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'SyncTextFile'
  );
  const supportsJsLinkId = await deep.id(
    '@deep-foundation/core',
    'dockerSupportsJs' /* | "plv8SupportsJs" */
  );
  const handlerTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'Handler'
  );
  const handleOperationLinkId = await deep.id(
    '@deep-foundation/core',
    'HandleInsert' /* | HandleUpdate | HandleDelete */
  );
  const code = fs.readFileSync(path.join(__dirname, 'notifyInsertHandler.js'), { encoding: 'utf-8' });

  await deep.insert({
    type_id: fileTypeLinkId,
    in: {
      data: [
        {
          type_id: containTypeLinkId,
          from_id: packageLinkId, // before created package
          string: { data: { value: "PushNotificationNotifyInsertHandlerCode" } },
        },
        {
          from_id: supportsJsLinkId,
          type_id: handlerTypeLinkId,
          in: {
            data: [
              {
                type_id: containTypeLinkId,
                from_id: packageLinkId, // before created package
                string: { data: { value: "PushNotificationNotifyInsertHandler" } },
              },
              {
                type_id: handleOperationLinkId,
                // The type of link which operation will trigger handler. Example: insert handle will be triggered if you insert a link with this type_id
                from_id: await deep.id(PACKAGE_NAME, "Notify"),
                in: {
                  data: [
                    {
                      type_id: containTypeLinkId,
                      from_id: packageLinkId, // before created package
                      string: { data: { value: "HandlePushNotificationNotifyInsert" } },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
    string: {
      data: {
        value: code,
      },
    },
  });
};

installPackage();