import { ConfirmOptions } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { DIALOG_PACKAGE_NAME } from "./package-name";

export async function insertConfirm({ deep, confirmData: confirmData, containerLinkId }: { deep: DeepClient, confirmData: ConfirmOptions, containerLinkId: number }): Promise<void> {
  const confirmTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "Confirm");
  const confirmTitleTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "ConfirmTitle");
  const confirmMessageTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "ConfirmMessage");
  const confirmOkButtonTitleTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "ConfirmOkButtonTitle");
  const confirmCancelButtonTitleTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "ConfirmCancelButtonTitle");
  const syncTextFileTypeLinkId = await deep.id("@deep-foundation/core", "SyncTextFile");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");

  await deep.insert({
    type_id: confirmTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: containerLinkId
      }
    },
    out: {
      data: [
        confirmData.title &&
        {
          type_id: confirmTitleTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: containerLinkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: confirmData.title
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: containerLinkId
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
              from_id: containerLinkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: confirmData.message
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: containerLinkId
                }
              },
            },
          }
        },
        confirmData.okButtonTitle &&
        {
          type_id: confirmOkButtonTitleTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: containerLinkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: confirmData.okButtonTitle
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: containerLinkId
                }
              },
            },
          }
        },
        confirmData.cancelButtonTitle &&
        {
          type_id: confirmCancelButtonTitleTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: containerLinkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: confirmData.cancelButtonTitle
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: containerLinkId
                }
              },
            },
          }
        },
      ]
    }
  });
}