import { AlertOptions } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertAlertToDeep({ deep, alertOptions, containInLinkId }: { deep: DeepClient, containInLinkId: number, alertOptions: AlertOptions }): Promise<void> {
  const alertTypeLinkId = await deep.id(PACKAGE_NAME, "Alert");
  const alertTitleTypeLinkId = await deep.id(PACKAGE_NAME, "AlertTitle");
  const alertMessageTypeLinkId = await deep.id(PACKAGE_NAME, "AlertMessage");
  const alertButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "AlertButtonTitle");
  const syncTextFileTypeLinkId = await deep.id("@deep-foundation/core", "SyncTextFile");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");

  await deep.insert({
    type_id: alertTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: containInLinkId
      }
    },
    out: {
      data: [
        alertOptions.title &&
        {
          type_id: alertTitleTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: containInLinkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: alertOptions.title
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: containInLinkId
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
              from_id: containInLinkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: alertOptions.message
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: containInLinkId
                }
              },
            },
            
          }
        },
        alertOptions.buttonTitle && 
        {
          type_id: alertButtonTitleTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: containInLinkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: alertOptions.buttonTitle
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: containInLinkId
                }
              },
            },
          }
        }
      ]
    }
  });
}