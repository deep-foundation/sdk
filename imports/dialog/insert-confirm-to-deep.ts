import { ConfirmOptions } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertConfirmToDeep({ deep, confirmOptions }: { deep: DeepClient, confirmOptions: ConfirmOptions }): Promise<void> {
  const confirmTypeLinkId = await deep.id(PACKAGE_NAME, "Confirm");
  const confirmTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmTitle");
  const confirmMessageTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmMessage");
  const confirmOkButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmOkButtonTitle");
  const confirmCancelButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmCancelButtonTitle");
  const syncTextFileTypeLinkId = await deep.id("@deep-foundation/core", "SyncTextFile");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");

  await deep.insert({
    type_id: confirmTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: deep.linkId
      }
    },
    out: {
      data: [
        confirmOptions.title &&
        {
          type_id: confirmTitleTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: confirmOptions.title
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: deep.linkId
                }
              },
            },

          }
        },
        {
          type_id: confirmMessageTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: confirmOptions.message
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: deep.linkId
                }
              },
            },
          }
        },
        confirmOptions.okButtonTitle &&
        {
          type_id: confirmOkButtonTitleTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: confirmOptions.okButtonTitle
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: deep.linkId
                }
              },
            },
          }
        },
        confirmOptions.cancelButtonTitle &&
        {
          type_id: confirmCancelButtonTitleTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: confirmOptions.cancelButtonTitle
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: deep.linkId
                }
              },
            },
          }
        },
      ]
    }
  });
}