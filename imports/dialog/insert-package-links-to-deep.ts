import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertPackageLinksToDeep({deep, deviceLinkId}: {deep: DeepClient, deviceLinkId: number}) {

  const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type");
  const anyTypeLinkId = await deep.id("@deep-foundation/core", "Any");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const packageTypeLinkId = await deep.id("@deep-foundation/core", "Package");
  const joinTypeLinkId = await deep.id("@deep-foundation/core", "Join");
  const valueTypeLinkId = await deep.id("@deep-foundation/core", "Value");
  const stringTypeLinkId = await deep.id("@deep-foundation/core", "String");
  const numberTypeLinkId = await deep.id("@deep-foundation/core", "Number");

  const { data: [{ id: packageLinkId }] } = await deep.insert({
    type_id: packageTypeLinkId,
    string: { data: { value: PACKAGE_NAME } },
    in: { data: [
      {
        type_id: containTypeLinkId,
        from_id: deep.linkId
      },
    ] },
    out: { data: [
      {
        type_id: joinTypeLinkId,
        to_id: await deep.id('deep', 'users', 'packages'),
      },
      {
        type_id: joinTypeLinkId,
        to_id: await deep.id('deep', 'admin'),
      },
    ] },
  });


  const { data: [{ id: alertTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'Alert' } },
    } },
  });

  const { data: [{ id: alertTitleTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: alertTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'AlertTitle' } },
    } }
  });

  const { data: [{ id: alertMessageTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: alertTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'AlertMessage' } },
    } }
  });

  const { data: [{ id: alertButtonTitleTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: alertTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'AlertButtonTitle' } },
    } }
  });

  const { data: [{ id: promptResultTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'PromptResult' } },
    } }
  });

  const { data: [{ id: promptResultValueTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: promptResultTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'PromptResultValue' } },
    } },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId
      }
    }
  });

  const { data: [{ id: promptResultPromptIsCancelledTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'PromptResultPromptIsCancelled' } },
    } }
  });

  const { data: [{ id: promptResultPromptIsNotCancelledTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'PromptResultPromptIsNotCancelled' } },
    } }
  });

  const { data: [{ id: promptTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'Prompt' } },
    } }
  });

  const { data: [{ id: promptTitleTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: promptTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'PromptTitle' } },
    } },
  });
  
  const { data: [{ id: promptMessageTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: promptTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'PromptMessage' } },
    } }
  });
  
  const { data: [{ id: promptOkButtonTitleTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: promptTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'PromptOkButtonTitle' } },
    } }
  });


  const { data: [{ id: promptCancelButtonTitleTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: promptTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'PromptCancelButtonTitle' } },
    } }
  });

  const { data: [{ id: inputPlaceholderTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: promptTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'InputPlaceholder' } },
    } }
  });

  const { data: [{ id: promptInputTextTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: promptTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'PromptInputText' } },
    } },
  });

  const { data: [{ id: confirmTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'Confirm' } },
    } },
  });

  const { data: [{ id: confirmTitleTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: confirmTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'ConfirmTitle' } },
    } }
  });

  const { data: [{ id: confirmMessageTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: confirmTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'ConfirmMessage' } },
    } }
  });

  const { data: [{ id: confirmOkButtonTitleTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: confirmTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'ConfirmOkButtonTitle' } },
    } }
  });

  const { data: [{ id: confirmCancelButtonTitleTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: confirmTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'ConfirmCancelButtonTitle' } },
    } }
  });

  const { data: [{ id: confirmResultTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'ConfirmResult' } },
    } }
  });

  const { data: [{ id: confirmResultValueTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: confirmResultTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'ConfirmResultValue' } },
    } }
  });

  const { data: [{ id: notifyTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: deviceLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'Notify' } },
    } }
  });

  const { data: [{ id: notifiedTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: notifyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'Notified' } },
    } }
  });
}