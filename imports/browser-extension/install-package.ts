import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { generateApolloClient } from '@deep-foundation/hasura/client';
import { getIsPackageInstalled } from "../get-is-package-installed";
import * as dotenv from 'dotenv';
import { getIsLinkExist } from "../get-is-link-exist";
dotenv.config();

export const PACKAGE_NAME = "@deep-foundation/browser-extension"
  
export default async function installPackage(deviceLinkId:number) {

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

    const { data: [{ id: browserExtensionTreeLinkId }] } = await deep.insert({
      type_id: treeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'BrowserExtensionTree' } },
        },
      }
    })

    await deep.insert([
      {
        type_id: typeTypeLinkId,
        in: {
          data: [{
            type_id: containTypeLinkId,
            from_id: packageLinkId,
            string: { data: { value: 'BrowserExtension' } },
          },
          {
            type_id: treeIncludeNodeTypeLinkId,
            from_id: browserExtensionTreeLinkId,
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
          data: [
            {
              type_id: typeTypeLinkId,
              to_id: anyTypeLinkId,
              in: {
                data: [{
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'Page' } },
                },
                {
                  type_id: treeIncludeNodeTypeLinkId,
                  from_id: browserExtensionTreeLinkId,
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
                data: [
                  {
                    type_id: typeTypeLinkId,
                    to_id: anyTypeLinkId,
                    in: {
                      data: [{
                        type_id: containTypeLinkId,
                        from_id: packageLinkId,
                        string: { data: { value: 'PageUrl' } },
                      }, {
                        type_id: treeIncludeDownTypeLinkId,
                        from_id: browserExtensionTreeLinkId,
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
                  },
                  {
                    type_id: typeTypeLinkId,
                    to_id: anyTypeLinkId,
                    in: {
                      data: [{
                        type_id: containTypeLinkId,
                        from_id: packageLinkId,
                        string: { data: { value: 'LastVisitTime' } },
                      }, {
                        type_id: treeIncludeDownTypeLinkId,
                        from_id: browserExtensionTreeLinkId,
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
                  },
                  {
                    type_id: typeTypeLinkId,
                    to_id: anyTypeLinkId,
                    in: {
                      data: [{
                        type_id: containTypeLinkId,
                        from_id: packageLinkId,
                        string: { data: { value: 'TypedCount' } },
                      }, {
                        type_id: treeIncludeDownTypeLinkId,
                        from_id: browserExtensionTreeLinkId,
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
                  },
                  {
                    type_id: typeTypeLinkId,
                    to_id: anyTypeLinkId,
                    in: {
                      data: [{
                        type_id: containTypeLinkId,
                        from_id: packageLinkId,
                        string: { data: { value: 'VisitCount' } },
                      }, {
                        type_id: treeIncludeDownTypeLinkId,
                        from_id: browserExtensionTreeLinkId,
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
                  },
                  {
                    type_id: typeTypeLinkId,
                    to_id: anyTypeLinkId,
                    in: {
                      data: [{
                        type_id: containTypeLinkId,
                        from_id: packageLinkId,
                        string: { data: { value: 'PageTitle' } },
                      }, {
                        type_id: treeIncludeDownTypeLinkId,
                        from_id: browserExtensionTreeLinkId,
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
                  },
                ]
              }
            },
            {
              type_id: typeTypeLinkId,
              to_id: anyTypeLinkId,
              in: {
                data: [{
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'Tab' } },
                },
                {
                  type_id: treeIncludeNodeTypeLinkId,
                  from_id: browserExtensionTreeLinkId,
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
                data: [
                  {
                    type_id: typeTypeLinkId,
                    to_id: anyTypeLinkId,
                    in: {
                      data: [{
                        type_id: containTypeLinkId,
                        from_id: packageLinkId,
                        string: { data: { value: 'TabUrl' } },
                      }, {
                        type_id: treeIncludeDownTypeLinkId,
                        from_id: browserExtensionTreeLinkId,
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
                  },
                  {
                    type_id: typeTypeLinkId,
                    to_id: anyTypeLinkId,
                    in: {
                      data: [{
                        type_id: containTypeLinkId,
                        from_id: packageLinkId,
                        string: { data: { value: 'TabTitle' } },
                      }, {
                        type_id: treeIncludeDownTypeLinkId,
                        from_id: browserExtensionTreeLinkId,
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
                  },
                  {
                    type_id: typeTypeLinkId,
                    to_id: anyTypeLinkId,
                    in: {
                      data: [{
                        type_id: containTypeLinkId,
                        from_id: packageLinkId,
                        string: { data: { value: 'Active' } },
                      }, {
                        type_id: treeIncludeDownTypeLinkId,
                        from_id: browserExtensionTreeLinkId,
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
                  },
                ]
              }
            },
          ]
        }
      },
    ]);

    if (deviceLinkId) {
      if (!await getIsLinkExist({ deep, packageName: "@deep-foundation/browser-extension", linkName: "BrowserExtension" })) {
        const { data: [{ id: BrowserExtensionLinkId }] } = await deep.insert({
          type_id: await deep.id(PACKAGE_NAME, "BrowserExtension"),
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deviceLinkId,
              string: { data: { value: "BrowserExtension" } },
            }
          }
        })
      }
    }
    console.log("browser-history package installed")
  } else console.log("browser-history package already exists");
}