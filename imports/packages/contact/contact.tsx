import { Contacts } from '@capacitor-community/contacts';
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";


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
  const typeContainLinkId = await deep.id("@deep-foundation/core", "Contain");
  const typeContactLinkId = await deep.id("@l4legenda/capacitor-contact", "contact");
  const typeContactIdLinkId = await deep.id("@l4legenda/capacitor-contact-contact-id", "contactId");

  const typeNameLinkId = await deep.id("@l4legenda/capacitor-contact-name-payload", "name");
  const typeDisplayLinkId = await deep.id("@l4legenda/capacitor-contact-name-payload", "display");
  const typeGivenLinkId = await deep.id("@l4legenda/capacitor-contact-name-payload", "given");
  const typeMiddleLinkId = await deep.id("@l4legenda/capacitor-contact-name-payload", "middle");
  const typeFamilyLinkId = await deep.id("@l4legenda/capacitor-contact-name-payload", "family");
  const typePrefixLinkId = await deep.id("@l4legenda/capacitor-contact-name-payload", "prefix");
  const typeSuffixLinkId = await deep.id("@l4legenda/capacitor-contact-name-payload", "suffix");

  const typeOrganizationLinkId = await deep.id("@l4legenda/capacitor-contact-organization-payload", "organization");
  const typeOrganizationCompanyLinkId = await deep.id("@l4legenda/capacitor-contact-organization-payload", "company");
  const typeOrganizationJobTitleLinkId = await deep.id("@l4legenda/capacitor-contact-organization-payload", "jobTitle");
  const typeOrganizationDepartmentLinkId = await deep.id("@l4legenda/capacitor-contact-organization-payload", "department");

  const typeBirthdayLinkId = await deep.id("@l4legenda/capacitor-contact-birthday-payload", "birthday");

  const typeBirthdayDayLinkId = await deep.id("@l4legenda/capacitor-contact-birthday-payload", "day");
  const typeBirthdayMonthLinkId = await deep.id("@l4legenda/capacitor-contact-birthday-payload", "month");
  const typeBirthdayYearLinkId = await deep.id("@l4legenda/capacitor-contact-birthday-payload", "year");

  const typeNoteLinkId = await deep.id("@l4legenda/capacitor-contact-note", "note");

  const typePhonesPhoneLinkId = await deep.id("@l4legenda/capacitor-contact-phones-payload", "phone");
  const typePhoneNumberLinkId = await deep.id("@l4legenda/capacitor-contact-phones-payload", "number");
  const typePhoneLabelLinkId = await deep.id("@l4legenda/capacitor-contact-phones-payload", "label");
  const typePhoneTypeLinkId = await deep.id("@l4legenda/capacitor-contact-phones-payload", "type");

  const typeEmailsEmailLinkId = await deep.id("@l4legenda/capacitor-contact-email-payload", "email");
  const typeEmailsTypeLinkId = await deep.id("@l4legenda/capacitor-contact-email-payload", "type");
  const typeEmailsLabelLinkId = await deep.id("@l4legenda/capacitor-contact-email-payload", "label");
  const typeEmailsNumberLinkId = await deep.id("@l4legenda/capacitor-contact-email-payload", "number");
  const typeEmailsIsPrimaryLinkId = await deep.id("@l4legenda/capacitor-contact-email-payload", "isPrimary");

  const typeUrlsLinkId = await deep.id("@l4legenda/capacitor-contact-urls", "urls");
  const typeUrlsUrlLinkId = await deep.id("@l4legenda/capacitor-contact-urls", "url");

  const typePostalAddressesLinkId = await deep.id("@l4legenda/capacitor-contact-postal-addresses", "postalAddresses");
  const typePostalAddressesCountryLinkId = await deep.id("@l4legenda/capacitor-contact-postal-addresses", "country");
  const typePostalAddressesStreetLinkId = await deep.id("@l4legenda/capacitor-contact-postal-addresses", "street");
  const typePostalAddressesRegionLinkId = await deep.id("@l4legenda/capacitor-contact-postal-addresses", "region");
  const typePostalAddressesPostcodeLinkId = await deep.id("@l4legenda/capacitor-contact-postal-addresses", "postcode");
  const typePostalAddressesCityLinkId = await deep.id("@l4legenda/capacitor-contact-postal-addresses", "city");
  const typePostalAddressesIsPrimaryLinkId = await deep.id("@l4legenda/capacitor-contact-postal-addresses", "isPrimary");
  const typePostalAddressesTypeLinkId = await deep.id("@l4legenda/capacitor-contact-postal-addresses", "type");
  const typePostalAddressesNeighborhoodLinkId = await deep.id("@l4legenda/capacitor-contact-postal-addresses", "neighborhood");
  const typePostalAddressesLabelLinkId = await deep.id("@l4legenda/capacitor-contact-postal-addresses", "label");

  const typeImageBase64StringLinkId = await deep.id("@l4legenda/capacitor-contact-image-payload", "base64String");

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
