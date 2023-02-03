import { AlertOptions } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertAlertToDeep({ deep, alertOptions }: { deep: DeepClient, alertOptions: AlertOptions }): Promise<void> {
  const alertTypeLinkId = await deep.id(PACKAGE_NAME, "Alert");
  const alertTitleTypeLinkId = await deep.id(PACKAGE_NAME, "AlertTitle");
  const alertMessageTypeLinkId = await deep.id(PACKAGE_NAME, "AlertMessage");
  const alertButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "AlertButtonTitle");
  const syncTextFileTypeLinkId = await deep.id("@deep-foundation/core", "SyncTextFile");

  await deep.insert({
    type_id: alertTypeLinkId,
    out: {
      data: [
        alertOptions.title &&
        {
          type_id: alertTitleTypeLinkId,
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: alertOptions.title
                }
              }
            }
          }
        },
        {
          type_id: alertMessageTypeLinkId,
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: alertOptions.message
                }
              }
            }
          }
        },
        alertOptions.buttonTitle && 
        {
          type_id: alertButtonTitleTypeLinkId,
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: alertOptions.buttonTitle
                }
              }
            }
          }
        }
      ]
    }
  });
}