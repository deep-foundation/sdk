import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { getIsPackageInstalled } from "../get-is-package-installed";

export const PACKAGE_NAME = "@deep-foundation/browser-extension"

export default async function initializePackage(deep: DeepClient, deviceLinkId) {
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
            string: { data: { value: 'BrowserExtension' } },
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
                  string: { data: { value: 'Page' } },
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
                        string: { data: { value: 'PageUrl' } },
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
                        string: { data: { value: 'LastVisitTime' } },
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
                        string: { data: { value: 'TypedCount' } },
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
                        string: { data: { value: 'VisitCount' } },
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
                        string: { data: { value: 'PageTitle' } },
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
              to_id: anyTypeLinkId,
              in: {
                data: [{
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'Tab' } },
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
                        string: { data: { value: 'TabUrl' } },
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
                        string: { data: { value: 'TabTitle' } },
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
                        string: { data: { value: 'Active' } },
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
          ]
        }
      },
    ]);

    const { data: [{ id: browserExtensionLinkId }] } = await deep.insert({
      type_id: await deep.id(PACKAGE_NAME, "BrowserExtension"),
      in: {
        data: [{
          type_id: containTypeLinkId,
          from_id: deviceLinkId,
          string: { data: { value: "BrowserExtension" } },
        }]
      }
    })
  } else console.log("browser-history package already exists")
}