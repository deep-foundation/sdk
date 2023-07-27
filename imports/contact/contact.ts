import { Contacts } from '@capacitor-community/contacts';
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";


export async function saveAllContacts({ deep, deviceLinkId }: { deep: DeepClient, deviceLinkId: any }) {

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
  const typeContactLinkId = await deep.id(CAPACITOR_CONTACT_PACKAGE_NAME, "contact");
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
  const typeEmailsAddressLinkId = await deep.id("@l4legenda/capacitor-contact-email-payload", "address");
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

  const contactsArray = contacts.map(contact => {

    const out_data = [];

    const constactIdObject = {
      type_id: typeContainLinkId,
      to: {
        data: {
          type_id: typeContactIdLinkId,
          string: { data: { value: contact.contactId } }
        }
      }
    };
    out_data.push(constactIdObject);

    const name = {
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
              {
                type_id: typeContainLinkId,
                to: {
                  data: {
                    type_id: typeDisplayLinkId,
                    string: { data: { value: contact.name?.display } }
                  }
                }
              },
              {
                type_id: typeContainLinkId,
                to: {
                  data: {
                    type_id: typeGivenLinkId,
                    string: { data: { value: contact.name?.given } }
                  }
                }
              },
            ]
          }
        }
      }
    };
    out_data.push(name);

    // organization
    if (contact.organization) {
      const organization = {
        type_id: typeContainLinkId,
        to: {
          data: {
            type_id: typeOrganizationLinkId,
            out: {
              data: [
                // company
                {
                  type_id: typeContainLinkId,
                  to: {
                    data: {
                      type_id: typeOrganizationCompanyLinkId,
                      string: { data: { value: contact.organization?.company } }
                    }
                  }
                },
                // jobTitle
                {
                  type_id: typeContainLinkId,
                  to: {
                    data: {
                      type_id: typeOrganizationJobTitleLinkId,
                      string: { data: { value: contact.organization?.jobTitle } }
                    }
                  }
                },
                // department
                {
                  type_id: typeContainLinkId,
                  to: {
                    data: {
                      type_id: typeOrganizationDepartmentLinkId,
                      string: { data: { value: contact.organization?.department } }
                    }
                  }
                },
              ]
            }
          }
        }
      };
      out_data.push(organization);
    }

    // birthday
    if (contact.birthday) {
      const birthday = {
        type_id: typeContainLinkId,
        to: {
          data: {
            type_id: typeBirthdayLinkId,
            out: {
              data: [
                // day
                {
                  type_id: typeContainLinkId,
                  to: {
                    data: {
                      type_id: typeBirthdayDayLinkId,
                      number: { data: { value: contact.birthday.day } }
                    }
                  }
                },
                // month
                {
                  type_id: typeContainLinkId,
                  to: {
                    data: {
                      type_id: typeBirthdayMonthLinkId,
                      number: { data: { value: contact.birthday.month } }
                    }
                  }
                },
                // year
                {
                  type_id: typeContainLinkId,
                  to: {
                    data: {
                      type_id: typeBirthdayYearLinkId,
                      number: { data: { value: contact.birthday.year } }
                    }
                  }
                },
              ]
            }
          }
        }
      };
      out_data.push(birthday)
    };

    // note
    if (contact.note) {
      const note = {
        type_id: typeContainLinkId,
        to: {
          data: {
            type_id: typeNoteLinkId,
            string: { data: { value: contact.note } }
          }
        }
      };
      out_data.push(note);
    }

    // phones
    if (contact.phones?.length) {
      for (const phone of contact.phones) {
        const phones = {
          type_id: typeContainLinkId,
          to: {
            data: {
              type_id: typePhonesPhoneLinkId,
              out: {
                data: [
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typePhoneNumberLinkId,
                        string: { data: { value: phone.number } }
                      }
                    }
                  },
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typePhoneLabelLinkId,
                        string: { data: { value: phone.label } }
                      }
                    }
                  },
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typePhoneTypeLinkId,
                        string: { data: { value: phone.type } }
                      }
                    }
                  }
                ],
              }
            }
          }
        }
        out_data.push(phones);
      }
    }

    // emails
    if (contact.emails?.length) {
      for (const email of contact.emails) {
        const emails = {
          type_id: typeContainLinkId,
          to: {
            data: {
              type_id: typeEmailsEmailLinkId,
              out: {
                data: [
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typeEmailsAddressLinkId,
                        string: { data: { value: email.address } }
                      }
                    }
                  },
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typeEmailsLabelLinkId,
                        string: { data: { value: email.label } }
                      }
                    }
                  },
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typeEmailsIsPrimaryLinkId,
                        string: { data: { value: email.isPrimary } }
                      }
                    }
                  },
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typeEmailsTypeLinkId,
                        string: { data: { value: email.type } }
                      }
                    }
                  },
                ],
              }
            }
          }
        };
        out_data.push(emails);
      }
    }

    // urls
    if (contact.urls?.length) {
      const urls = (contact.urls.map((url) => ({
        type_id: typeContainLinkId,
        to: {
          data: {
            type_id: typeUrlsUrlLinkId,
            string: { data: { value: url } },
          }
        }
      })));
      out_data.push(urls);
    }

    if(contact.postalAddresses?.length) {
      for (const postalAddress of contact.postalAddresses) {
        const postal_address = {
          type_id: typeContainLinkId,
          to: {
            data: {
              type_id: typePostalAddressesLinkId,
              out: {
                data: [
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typePostalAddressesTypeLinkId,
                        string: { data: { value: postalAddress.type } }
                      }
                    }
                  },
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typePostalAddressesLabelLinkId,
                        string: { data: { value: postalAddress.label } }
                      }
                    }
                  },
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typePostalAddressesIsPrimaryLinkId,
                        string: { data: { value: postalAddress.isPrimary } }
                      }
                    }
                  },
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typePostalAddressesStreetLinkId,
                        string: { data: { value: postalAddress.street } }
                      }
                    }
                  },
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typePostalAddressesNeighborhoodLinkId,
                        string: { data: { value: postalAddress.neighborhood } }
                      }
                    }
                  },
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typePostalAddressesCityLinkId,
                        string: { data: { value: postalAddress.city } }
                      }
                    }
                  },
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typePostalAddressesRegionLinkId,
                        string: { data: { value: postalAddress.region } }
                      }
                    }
                  },
                  {
                    type_id: typeContainLinkId,
                    to: {
                      data: {
                        type_id: typePostalAddressesPostcodeLinkId,
                        string: { data: { value: postalAddress.postcode } }
                      }
                    }
                  },
                ],
              },
            },
          },
        };
        out_data.push(postal_address);
      }
    }

    // image
    const postal_address = {
      type_id: typeContainLinkId,
      to: {
        data: {
          type_id: typeImageBase64StringLinkId,
          string: { data: { value: contact.image?.base64String } }
        },
      },
    };
    out_data.push(postal_address);

    const contactObject = {
      type_id: typeContactLinkId,
      in: {
        data: {
          type_id: typeContainLinkId,
          from_id: deviceLinkId,
        }
      },
      out: {
        data: out_data
      }
    }

    return contactObject
  })

  await deep.insert(contactsArray[0])
}