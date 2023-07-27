import { AlertOptions } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { DIALOG_PACKAGE_NAME } from "./package-name";

export async function insertAlert({ deep, alertData: alertData, containerLinkId: containerLinkId }: { deep: DeepClient, containerLinkId: number, alertData: AlertOptions }): Promise<void> {
  const alertTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "Alert");
  const alertTitleTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "AlertTitle");
  const alertMessageTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "AlertMessage");
  const alertButtonTitleTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "AlertButtonTitle");
  const syncTextFileTypeLinkId = await deep.id("@deep-foundation/core", "SyncTextFile");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");

  await deep.insert({
    type_id: alertTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: containerLinkId
      }
    },
    out: {
      data: [
        alertData.title &&
        {
          type_id: alertTitleTypeLinkId,
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
                  value: alertData.title
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
          type_id: alertMessageTypeLinkId,
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
                  value: alertData.message
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
        alertData.buttonTitle && 
        {
          type_id: alertButtonTitleTypeLinkId,
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
                  value: alertData.buttonTitle
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
        }
      ]
    }
  });
}