import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { generateApolloClient } from '@deep-foundation/hasura/client';
import { getIsPackageInstalled } from "../get-is-package-installed";
import * as dotenv from 'dotenv';
import { getIsLinkExist } from "../get-is-link-exist";
dotenv.config();


export const PACKAGE_NAME = "@deep-foundation/audiorecord"

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
    const typeTypeLinkId = await deep.id('@deep-foundation/core', 'Type');
    const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
    const packageTypeLinkId = await deep.id('@deep-foundation/core', 'Package');
    const joinTypeLinkId = await deep.id('@deep-foundation/core', 'Join');
    const valueTypeLinkId = await deep.id('@deep-foundation/core', 'Value');
    const stringTypeLinkId = await deep.id('@deep-foundation/core', 'String');
    const numberTypeLinkId = await deep.id('@deep-foundation/core', 'Number');
    const objectTypeLinkId = await deep.id('@deep-foundation/core', 'Object');
    const anyTypeLinkId = await deep.id("@deep-foundation/core", "Any");
    const treeTypeLinkId = await deep.id('@deep-foundation/core', 'Tree');
    const treeIncludeNodeTypeLinkId = await deep.id('@deep-foundation/core', 'TreeIncludeNode');
    const treeIncludeUpTypeLinkId = await deep.id('@deep-foundation/core', 'TreeIncludeUp');
    const treeIncludeDownTypeLinkId = await deep.id('@deep-foundation/core', 'TreeIncludeDown');
    const userTypeLinkId = await deep.id('@deep-foundation/core', 'User');



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

    const { data: [{ id: audiorecordTreeId }] } = await deep.insert({
      type_id: treeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'AudioRecordTree' } },
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
            string: { data: { value: 'AudioRecords' } },
          },
          {
            type_id: treeIncludeNodeTypeLinkId,
            from_id: audiorecordTreeId,
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
                  string: { data: { value: 'Permissions' } },
                }, {
                  type_id: treeIncludeDownTypeLinkId,
                  from_id: audiorecordTreeId,
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
                  string: { data: { value: 'DeviceSupport' } },
                }, {
                  type_id: treeIncludeDownTypeLinkId,
                  from_id: audiorecordTreeId,
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
                  string: { data: { value: 'Record' } },
                },
                {
                  type_id: treeIncludeNodeTypeLinkId,
                  from_id: audiorecordTreeId,
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
                        string: { data: { value: 'Duration' } },
                      }, {
                        type_id: treeIncludeDownTypeLinkId,
                        from_id: audiorecordTreeId,
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
                        string: { data: { value: 'StartTime' } },
                      }, {
                        type_id: treeIncludeDownTypeLinkId,
                        from_id: audiorecordTreeId,
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
                        string: { data: { value: 'EndTime' } },
                      }, {
                        type_id: treeIncludeDownTypeLinkId,
                        from_id: audiorecordTreeId,
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
                        string: { data: { value: 'Sound' } },
                      }, {
                        type_id: treeIncludeDownTypeLinkId,
                        from_id: audiorecordTreeId,
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
                        string: { data: { value: 'MIME/type' } },
                      }, {
                        type_id: treeIncludeDownTypeLinkId,
                        from_id: audiorecordTreeId,
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
                  }
                ]
              }
            },
          ]
        }
      },
    ]);
    
    if (deviceLinkId) {
      if (!await getIsLinkExist({ deep, packageName: "@deep-foundation/audiorecord", linkName: "AudioRecords" })) {
        const { data: [{ id: AudioRecordsLinkId }] } = await deep.insert({
          type_id: await deep.id(PACKAGE_NAME, "AudioRecords"),
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deviceLinkId,
              string: { data: { value: "AudioRecords" } },
            }
          }
        })
      }
    }
    console.log("audiorecord package installed");
  } else console.log("audiorecord package already exists");
}