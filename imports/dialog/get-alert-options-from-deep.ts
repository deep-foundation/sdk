import { AlertOptions } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function getAlertOptionsFromDeep({ deep, alertLinkId }: { deep: DeepClient, alertLinkId: number }): Promise<AlertOptions> {
  const alertTitleTypeLinkId = await deep.id(PACKAGE_NAME, "AlertTitle");
  const alertMessageTypeLinkId = await deep.id(PACKAGE_NAME, "AlertMessage");
  const alertButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "AlertButtonTitle");

  const { data: [{ value: { value: title } }] } = await deep.select({
    from: {
      type_id: alertTitleTypeLinkId,
      from_id: alertLinkId,
    }
  });

  const { data: [{ value: { value: message } }] } = await deep.select({
    from: {
      type_id: alertMessageTypeLinkId,
      from_id: alertLinkId,
    }
  });

  const { data: [{ value: { value: buttonTitle } }] } = await deep.select({
    from: {
      type_id: alertButtonTitleTypeLinkId,
      from_id: alertLinkId,
    }
  });

  return {
    title,
    message,
    buttonTitle
  }
}