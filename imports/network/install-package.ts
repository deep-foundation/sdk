import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { generateApolloClient } from '@deep-foundation/hasura/client';
import { getIsPackageInstalled } from "../get-is-package-installed";
import * as dotenv from 'dotenv';
import { getIsLinkExist } from "../get-is-link-exist";
dotenv.config();

export const PACKAGE_NAME = "@deep-foundation/network"
export const PACKAGE_TYPES = ["Wifi", "Cellular", "Unknown", "None"]

export default async function installPackage(deviceLinkId?) {

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

  if (!await getIsPackageInstalled({ deep, packageName: PACKAGE_NAME })) {
    const packageTypeLinkId = await deep.id('@deep-foundation/core', "Package")
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain")
    const joinTypeLinkId = await deep.id("@deep-foundation/core", "Join")
    const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type")
    const treeTypeLinkId = await deep.id('@deep-foundation/core', 'Tree');
    const anyTypeLinkId = await deep.id("@deep-foundation/core", "Any");
    const treeIncludeNodeTypeLinkId = await deep.id(
      '@deep-foundation/core',
      'TreeIncludeNode'
    );
    const treeIncludeUpTypeLinkId = await deep.id('@deep-foundation/core', 'TreeIncludeUp');
    const treeIncludeDownTypeLinkId = await deep.id(
      '@deep-foundation/core',
      'TreeIncludeDown'
    );

    const { data: [{ id: packageLinkId }] } = await deep.insert({
      type_id: packageTypeLinkId,
      string: { data: { value: PACKAGE_NAME } },
      in: {
        data: [{
          type_id: containTypeLinkId,
          from_id: deep.linkId,
        }]
      },
      out: {
        data: [{
          type_id: joinTypeLinkId,
          to_id: await deep.id('deep', 'users', 'packages')
        }, {
          type_id: joinTypeLinkId,
          to_id: await deep.id('deep', 'admin')
        }]
      },
    })

    const { data: [{ id: networkTreeId }] } = await deep.insert({
      type_id: treeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'NetworkTree' } },
        },
      }
    })

    const { data: [{ id: networkTypeLinkId }] } = await deep.insert({
      type_id: typeTypeLinkId,
      in: {
        data: [{
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'Network' } },
        },
        {
          type_id: treeIncludeNodeTypeLinkId,
          from_id: networkTreeId,
          in: {
            data: [
              {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
              },
            ],
          },
        }]
      },
      out: {
        data: PACKAGE_TYPES.map((TYPE) => ({
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: packageLinkId,
              string: { data: { value: TYPE } },
            },
            {
              type_id: treeIncludeNodeTypeLinkId,
              from_id: networkTreeId,
              in: {
                data: [
                  {
                    type_id: containTypeLinkId,
                    from_id: packageLinkId,
                  },
                ],
              },
            }]
          }
        }))
      }
    });

    // await deep.insert(PACKAGE_TYPES.map((TYPE) => ({
    //   type_id: typeTypeLinkId,
    //   from_id: networkTypeLinkId,
    //   to_id: anyTypeLinkId,
    //   in: {
    //     data: [{
    //       type_id: containTypeLinkId,
    //       from_id: packageLinkId,
    //       string: { data: { value: TYPE } },
    //     },
    //     {
    //       type_id: treeIncludeNodeTypeLinkId,
    //       from_id: networkTreeId,
    //       in: {
    //         data: [
    //           {
    //             type_id: containTypeLinkId,
    //             from_id: packageLinkId,
    //           },
    //         ],
    //       },
    //     }]
    //   }
    // })));

    if (deviceLinkId) {
      if (!await getIsLinkExist({ deep, packageName: "@deep-foundation/network", linkName: "Network" })) {
        const { data: [{ id: networkLinkId }] } = await deep.insert({
          type_id: await deep.id(PACKAGE_NAME, "Network"),
          in: {
            data: [{
              type_id: containTypeLinkId,
              from_id: deviceLinkId,
              string: { data: { value: "Network" } },
            }]
          }
        });
      }
    }
    console.log("network package installed")
  } else console.log("network package already exists");
}