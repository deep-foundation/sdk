import { ConfirmOptions } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function getConfirmOptionsFromDeep({deep, confirmLinkId}: {deep: DeepClient, confirmLinkId: number}): Promise<ConfirmOptions> {
  const confirmTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmTitle");
  const confirmMessageTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmMessage");
  const confirmOkButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmOkButtonTitle");
  const confirmCancelButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "ConfirmCancelButtonTitle");

  const {data: [{value: {value: title}}]} = await deep.select({
    in: {
      type_id: confirmTitleTypeLinkId,
      from_id: confirmLinkId,
    }
  });

  const {data: [{value: {value: message}}]} = await deep.select({
    in: {
      type_id: confirmMessageTypeLinkId,
      from_id: confirmLinkId,
    }
  });

  const {data: [{value: {value: okButtonTitle}}]} = await deep.select({
    in: {
      type_id: confirmOkButtonTitleTypeLinkId,
      from_id: confirmLinkId,
    }
  });

  const {data: [{value: {value: cancelButtonTitle}}]} = await deep.select({
    in: {
      type_id: confirmCancelButtonTitleTypeLinkId,
      from_id: confirmLinkId,
    }
  });

  return {
    title,
    message,
    okButtonTitle,
    cancelButtonTitle
  }
}