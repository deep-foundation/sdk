import { Contacts } from "@capacitor-community/contacts";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";

export async function createAllContacts({ deep, deviceLinkId }: { deep: DeepClient, deviceLinkId: any }) {
  await Contacts.getPermissions();

  const { contacts } = await Contacts.getContacts();

  const contactType = await deep.id("@deep-foundation/contact", "contact");
  const displayNameType = await deep.id(
    "@deep-foundation/contact",
    "displayName"
  );
  const phoneNumberType = await deep.id(
    "@deep-foundation/contact",
    "phoneNumber"
  );
  const emailType = await deep.id("@deep-foundation/contact", "email");
  const photoThumbnailType = await deep.id(
    "@deep-foundation/contact",
    "photoThumbnail"
  );
  const organizationNameType = await deep.id(
    "@deep-foundation/contact",
    "organizationName"
  );
  const organizationRoleType = await deep.id(
    "@deep-foundation/contact",
    "organizationRole"
  );
  const birthdayType = await deep.id("@deep-foundation/contact", "birthday");

  const ml = new ManagerLinks(deep);

  for (const contact of contacts) {
    const contactLink = await ml.createLink({
      containName: contact.displayName,
      contain_from_id: deviceLinkId,
      type_id: contactType,
    });

    await ml.createLink({
      containName: "displayName",
      value: contact.displayName,
      contain_from_id: contactLink,
      type_id: displayNameType,
    });

    for (const phoneNumber of contact.phoneNumbers) {
      await ml.createLink({
        containName: phoneNumber.label,
        value: phoneNumber.number,
        contain_from_id: contactLink,
        type_id: phoneNumberType,
      });
    }
    for (const email of contact.emails) {
      await ml.createLink({
        containName: email.label,
        value: email.address,
        contain_from_id: contactLink,
        type_id: emailType,
      });
    }
    await ml.createLink({
      containName: "photoThumbnail",
      value: contact.photoThumbnail,
      contain_from_id: contactLink,
      type_id: photoThumbnailType,
    });
    await ml.createLink({
      containName: "organizationName",
      value: contact.organizationName,
      contain_from_id: contactLink,
      type_id: organizationNameType,
    });
    await ml.createLink({
      containName: "organizationRole",
      value: contact.photoThumbnail,
      contain_from_id: contactLink,
      type_id: organizationRoleType,
    });
    await ml.createLink({
      containName: "birthdayType",
      value: contact.organizationName,
      contain_from_id: contactLink,
      type_id: birthdayType,
    });
  }
}

export async function createContactPackage({ deep }: { deep: DeepClient }) {
  const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type");
  const packageTypeLinkId = await deep.id("@deep-foundation/core", "Package");

  const ml = new ManagerLinks(deep);

  const contactPackage = await ml.createLink({
    value: "@deep-foundation/contact",
    contain_from_id: deep.linkId,
    type_id: packageTypeLinkId,
  });
  const contact = await ml.createLink({
    containName: "contact",
    contain_from_id: contactPackage,
    type_id: typeTypeLinkId,
  });
  const displayName = await ml.createLink({
    containName: "displayName",
    contain_from_id: contactPackage,
    type_id: typeTypeLinkId,
  });
  const phoneNumber = await ml.createLink({
    containName: "phoneNumber",
    contain_from_id: contactPackage,
    type_id: typeTypeLinkId,
  });
  const email = await ml.createLink({
    containName: "email",
    contain_from_id: contactPackage,
    type_id: typeTypeLinkId,
  });
  const photoThumbnail = await ml.createLink({
    containName: "photoThumbnail",
    contain_from_id: contactPackage,
    type_id: typeTypeLinkId,
  });
  const organizationName = await ml.createLink({
    containName: "organizationName",
    contain_from_id: contactPackage,
    type_id: typeTypeLinkId,
  });
  const organizationRole = await ml.createLink({
    containName: "organizationRole",
    contain_from_id: contactPackage,
    type_id: typeTypeLinkId,
  });
  const birthday = await ml.createLink({
    containName: "birthday",
    contain_from_id: contactPackage,
    type_id: typeTypeLinkId,
  });
}

class ManagerLinks {
  constructor(private deep: DeepClient) { }

  async createLink({
    containName,
    value,
    contain_from_id,
    type_id,
  }: {
    containName?: string;
    value?: string;
    contain_from_id: number;
    type_id: number;
  }) {
    const {
      data: [{ id }],
    } = await this.deep.insert({
      type_id: type_id,
      ...(value && { string: { data: { value: value } } }),
      in: {
        data: {
          type_id: 3,
          from_id: contain_from_id, // 362
          ...(containName && { string: { data: { value: containName } } }),
        },
      },
    });
    return id;
  }
}
