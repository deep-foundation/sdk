import { DeepClient } from "@deep-foundation/deeplinks/imports/client";

export const PACKAGE_NAME = "@deep-foundation/audiorecord"

export default async function initializePackage(deep: DeepClient, deviceLinkId) {
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

  const { data: [{ id: dialogTreeLinkId }] } = await deep.insert({
    type_id: treeTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: 'DialogTree' } },
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
          from_id: dialogTreeLinkId,
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
                from_id: dialogTreeLinkId,
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
                from_id: dialogTreeLinkId,
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
      in: {
        data: [{
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'Record' } },
        },
        {
          type_id: treeIncludeNodeTypeLinkId,
          from_id: dialogTreeLinkId,
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
                from_id: dialogTreeLinkId,
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
                from_id: dialogTreeLinkId,
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
                from_id: dialogTreeLinkId,
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
                from_id: dialogTreeLinkId,
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
                from_id: dialogTreeLinkId,
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
  ]);

  // await deep.insert([
    
  // ]);

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

  console.log("audiorecord package installed");
}

