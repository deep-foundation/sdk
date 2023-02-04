import { AlertOptions } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function getAlertOptionsFromDeep({ deep, alertLinkId }: { deep: DeepClient, alertLinkId: number }): Promise<AlertOptions> {
  const alertTitleTypeLinkId = await deep.id(PACKAGE_NAME, "AlertTitle");
  const alertMessageTypeLinkId = await deep.id(PACKAGE_NAME, "AlertMessage");
  const alertButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "AlertButtonTitle");

  console.log({
    in: {
      type_id: alertTitleTypeLinkId,
      from_id: alertLinkId,
    }
  }, await deep.select({
    in: {
      type_id: alertTitleTypeLinkId,
      from_id: alertLinkId,
    }
  }));
  
  const { data: [{ value: { value: title } }] } = await deep.select({
    in: {
      type_id: alertTitleTypeLinkId,
      from_id: alertLinkId,
    }
  });

  const { data: [{ value: { value: message } }] } = await deep.select({
    in: {
      type_id: alertMessageTypeLinkId,
      from_id: alertLinkId,
    }
  });

  const buttonTitleSelectResponse = await deep.select({
    in: {
      type_id: alertButtonTitleTypeLinkId,
      from_id: alertLinkId,
    }
  });

  return {
    title,
    message,
    buttonTitle: buttonTitleSelectResponse.data[0]?.value?.value
  }
}