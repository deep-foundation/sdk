import { Contacts } from '@capacitor-community/contacts';
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";

const CAPACITOR_CONTACT_NAME_PACKAGE = "@l4legenda/capacitor-contact";
const CORE_NAME_PACKAGE = "@deep-foundation/core";

export async function createAllContacts({ deep, deviceLinkId }: { deep: DeepClient, deviceLinkId: any }) {

  const checkPermissions = await Contacts.checkPermissions();

  if (!checkPermissions) {
    await Contacts.requestPermissions();
  }

  const { contacts } = await Contacts.getContacts(
    {
      projection: {
        name: true,
        organization: true,
        birthday: true,
        note: true,
        phones: true,
        emails: true,
        urls: true,
        postalAddresses: true,
        image: true,
      }
    })
  const typeContainLinkId = await deep.id(CORE_NAME_PACKAGE, "Contain");
  const typeContactLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "contact");
  const typeContactIdLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "contactId");
  const typeNameLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "name");

  const typeMiddleLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "middle");
  const typeFamilyLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "family");
  const typePrefixLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "prefix");
  const typeSuffixLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "suffix");

  const typeOrganizationLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "organization");

  const typeCompanyLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "company");
  const typeJobTitleLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "jobTitle");
  const typeDepartmentLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "department");

  const typeBirthdayLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "birthday");

  const typeDayLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "day");
  const typeMonthLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "month");
  const typeYearLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "year");

  const typeNoteLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "note");
  const typePhonesLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "phones");
  const typePhoneNumberLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "phoneNumber");
  const typeEmailsLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "emails");
  const typeEmailAddressLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "emailAddress");
  const typeUrlsLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "urls");
  const typePostalAddressesLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "postalAddresses");
  const typeImageLinkId = await deep.id(CAPACITOR_CONTACT_NAME_PACKAGE, "image");

  for (const contact of contacts) {
    console.log(JSON.stringify(contact))
    await deep.insert({
      type_id: typeContactLinkId,
      in: {
        data: {
          type_id: typeContainLinkId,
          from_id: deviceLinkId,
        }
      },
      out: {
        data: [
          // contactId link
          {
            type_id: typeContainLinkId,
            to: {
              data: {
                type_id: typeContactIdLinkId,
                string: { data: { value: contact.contactId } }
              }
            }
          },
          // name link
          {
            type_id: typeContainLinkId,
            to: {
              data: {
                type_id: typeNameLinkId,
                out: {
                  data: [
                    // middle
                    {
                      type_id: typeContainLinkId,
                      to: {
                        data: {
                          type_id: typeMiddleLinkId,
                          string: { data: { value: contact.name?.middle } }
                        }
                      }
                    },
                    // family
                    {
                      type_id: typeContainLinkId,
                      to: {
                        data: {
                          type_id: typeFamilyLinkId,
                          string: { data: { value: contact.name?.family } }
                        }
                      }
                    },
                    // prefix
                    {
                      type_id: typeContainLinkId,
                      to: {
                        data: {
                          type_id: typePrefixLinkId,
                          string: { data: { value: contact.name?.prefix } }
                        }
                      }
                    },
                    // suffix
                    {
                      type_id: typeContainLinkId,
                      to: {
                        data: {
                          type_id: typeSuffixLinkId,
                          string: { data: { value: contact.name?.suffix } }
                        }
                      }
                    },
                  ]
                }
              }
            }
          },
          // organization
          {
            type_id: typeContainLinkId,
            to: {
              data: {
                type_id: typeOrganizationLinkId,
                out: {
                  data: (contact.organization && [
                    // company
                    {
                      type_id: typeContainLinkId,
                      to: {
                        data: {
                          type_id: typeCompanyLinkId,
                          string: { data: { value: contact.organization?.company } }
                        }
                      }
                    },
                    // jobTitle
                    {
                      type_id: typeContainLinkId,
                      to: {
                        data: {
                          type_id: typeJobTitleLinkId,
                          string: { data: { value: contact.organization?.jobTitle } }
                        }
                      }
                    },
                    // department
                    {
                      type_id: typeContainLinkId,
                      to: {
                        data: {
                          type_id: typeDepartmentLinkId,
                          string: { data: { value: contact.organization?.department } }
                        }
                      }
                    },
                  ] || [])
                }
              }
            }
          },
          // birthday
          // {
          //   type_id: typeContainLinkId,
          //   to: {
          //     data: {
          //       type_id: typeBirthdayLinkId,
          //       out: {
          //         data: (contact.birthday && [
          //           // day
          //           (contact.birthday.day && {
          //             type_id: typeContainLinkId,
          //             to: {
          //               data: {
          //                 type_id: typeDayLinkId,
          //                 number: { data: { value: contact?.birthday?.day } }
          //               }
          //             }
          //           }),
          //           // month
          //           (contact.birthday.month && {
          //             type_id: typeContainLinkId,
          //             to: {
          //               data: {
          //                 type_id: typeMonthLinkId,
          //                 number: { data: { value: contact.birthday.month } }
          //               }
          //             }
          //           }),
          //           // year
          //           (contact.birthday.year && {
          //             type_id: typeContainLinkId,
          //             to: {
          //               data: {
          //                 type_id: typeYearLinkId,
          //                 number: { data: { value: contact.birthday.year } }
          //               }
          //             }
          //           }),
          //         ] || [])
          //       }
          //     }
          //   }
          // },
          // note
          {
            type_id: typeContainLinkId,
            to: {
              data: {
                type_id: typeNoteLinkId,
                string: { data: { value: contact.note } }
              }
            }
          },
          // phones
          {
            type_id: typeContainLinkId,
            to: {
              data: {
                type_id: typePhonesLinkId,
                out: {
                  data: (contact.phones?.map((phone) => (
                    {
                      type_id: typeContainLinkId,
                      string: { data: { value: phone.label } },
                      to: {
                        data: {
                          type_id: typePhoneNumberLinkId,
                          string: { data: { value: phone.number } }
                        }
                      }
                    }
                  )) || []),

                }
              }
            }
          },
          // emails
          {
            type_id: typeContainLinkId,
            to: {
              data: {
                type_id: typeEmailsLinkId,
                out: {
                  data: (contact.emails?.map((email) => (
                    {
                      type_id: typeContainLinkId,
                      string: { data: { value: email.label } },
                      to: {
                        data: {
                          type_id: typeEmailAddressLinkId,
                          string: { data: { value: email.address } }
                        }
                      }
                    }
                  )) || []),

                }
              }
            }
          },
          // urls
          // ...(contact.urls && (contact.urls?.map((url) => ({
          //   type_id: typeContainLinkId,
          //   to: {
          //     data: {
          //       type_id: typeUrlsLinkId,
          //       string: { data: { value: url } },
          //     }
          //   }
          // }))) || []),
          // postalAddresses
          // image
        ]
      }
    })
  }
}

export async function initPackageContact({ deep }: { deep: DeepClient }) {
  const typeContainLinkId = await deep.id("@deep-foundation/core", "Contain");
  const typePackageQueryLinkId = await deep.id("@deep-foundation/core", "PackageQuery");
  const typeInstallLinkId = await deep.id("@deep-foundation/npm-packager", "Install");

  await deep.insert({
    type_id: typePackageQueryLinkId,
    string: { data: { value: CAPACITOR_CONTACT_NAME_PACKAGE } },
    in: {
      data: [
        {
          type_id: typeContainLinkId,
          from_id: deep.linkId,
        },
        {
          type_id: typeInstallLinkId,
          from_id: deep.linkId,
        },
      ]
    },
  })
}
