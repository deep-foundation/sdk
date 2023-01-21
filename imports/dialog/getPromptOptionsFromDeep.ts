import { PromptOptions } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function getPromptOptionsFromDeep({deep, promptLinkId}: {deep: DeepClient, promptLinkId: number}): Promise<PromptOptions> {
  const promptTitleTypeLinkId = await deep.id(PACKAGE_NAME, "PromptTitle");
  const promptMessageTypeLinkId = await deep.id(PACKAGE_NAME, "PromptMessage");
  const promptOkButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "PromptOkButtonTitle");
  const promptCancelButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "PromptCancelButtonTitle");
  const promptInputPlaceholderTypeLinkId = await deep.id(PACKAGE_NAME, "PromptInputPlaceholder");
  const promptInputTextTypeLinkId = await deep.id(PACKAGE_NAME, "PromptInputText");

  const {data: [{value: {value: title}}]} = await deep.select({
    from: {
      type_id: promptTitleTypeLinkId,
      from_id: promptLinkId,
    }
  });

  const {data: [{value: {value: message}}]} = await deep.select({
    from: {
      type_id: promptMessageTypeLinkId,
      from_id: promptLinkId,
    }
  });

  const {data: [{value: {value: okButtonTitle}}]} = await deep.select({
    from: {
      type_id: promptOkButtonTitleTypeLinkId,
      from_id: promptLinkId,
    }
  });

  const {data: [{value: {value: cancelButtonTitle}}]} = await deep.select({
    from: {
      type_id: promptCancelButtonTitleTypeLinkId,
      from_id: promptLinkId,
    }
  });

  const {data: [{value: {value: inputPlaceholder}}]} = await deep.select({
    from: {
      type_id: promptInputPlaceholderTypeLinkId,
      from_id: promptLinkId,
    }
  });

  const {data: [{value: {value: inputText}}]} = await deep.select({
    from: {
      type_id: promptInputTextTypeLinkId,
      from_id: promptLinkId,
    }
  });

  return {
    title,
    message,
    okButtonTitle,
    cancelButtonTitle,
    inputPlaceholder,
    inputText
  };
}