import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";
import { PACKAGE_NAME as DEVICE_PACKAGE_NAME } from "./../device/package-name";

export async function insertPackageToDeep({deep}: {deep: DeepClient}) {

  const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type");
  const anyTypeLinkId = await deep.id("@deep-foundation/core", "Any");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const packageTypeLinkId = await deep.id("@deep-foundation/core", "Package");
  const joinTypeLinkId = await deep.id("@deep-foundation/core", "Join");
  const valueTypeLinkId = await deep.id("@deep-foundation/core", "Value");
  const stringTypeLinkId = await deep.id("@deep-foundation/core", "String");
  const numberTypeLinkId = await deep.id("@deep-foundation/core", "Number");
  const deviceTypeLinkId = await deep.id(DEVICE_PACKAGE_NAME, "Number");

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


  await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'Notification' } },
    } },
    out: {
      data: [
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: { data: {
            type_id: containTypeLinkId,
            from_id: packageLinkId,
            string: { data: { value: 'Title' } },
          } },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: { data: {
            type_id: containTypeLinkId,
            from_id: packageLinkId,
            string: { data: { value: 'Body' } },
          } },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: { data: {
            type_id: containTypeLinkId,
            from_id: packageLinkId,
            string: { data: { value: 'IconUrl' } },
          } },
        },
        {
          type_id: typeTypeLinkId,
          to_id: anyTypeLinkId,
          in: { data: {
            type_id: containTypeLinkId,
            from_id: packageLinkId,
            string: { data: { value: 'ImageUrl' } },
          } },
        },
        {
          type_id: typeTypeLinkId,
          to_id: deviceTypeLinkId,
          in: { data: {
            type_id: containTypeLinkId,
            from_id: packageLinkId,
            string: { data: { value: 'Notify' } },
          } },
          out: {
            data: [
              {
                type_id: typeTypeLinkId,
                to_id: deviceTypeLinkId,
                in: { data: {
                  type_id: containTypeLinkId,
                  from_id: packageLinkId,
                  string: { data: { value: 'Notified' } },
                } }
              }
            ]
          }
        },
      ]
    }
  });
}