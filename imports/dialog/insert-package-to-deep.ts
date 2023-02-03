import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";
import { PACKAGE_NAME as DEVICE_PACKAGE_NAME } from "./../device/package-name";
import { PACKAGE_NAME as NOTIFICATION_PACKAGE_TYPE } from "./../device/notification";

export async function insertPackageToDeep({ deep }: { deep: DeepClient }) {

  const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type");
  const anyTypeLinkId = await deep.id("@deep-foundation/core", "Any");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const packageTypeLinkId = await deep.id("@deep-foundation/core", "Package");
  const joinTypeLinkId = await deep.id("@deep-foundation/core", "Join");
  const deviceTypeLinkId = await deep.id(DEVICE_PACKAGE_NAME, "Device");
  const baseNotifyTypeLinkId = await deep.id(NOTIFICATION_PACKAGE_TYPE, "Notify");
  const baseNotifiedTypeLinkId = await deep.id(NOTIFICATION_PACKAGE_TYPE, "Notified");

  const { data: [{ id: packageLinkId }] } = await deep.insert({
    type_id: packageTypeLinkId,
    string: { data: { value: PACKAGE_NAME } },
    in: {
      data: [
        {
          type_id: containTypeLinkId,
          from_id: deep.linkId
        },
      ]
    },
    out: {
      data: [
        {
          type_id: joinTypeLinkId,
          to_id: await deep.id('deep', 'users', 'packages'),
        },
        {
          type_id: joinTypeLinkId,
          to_id: await deep.id('deep', 'admin'),
        },
      ]
    },
  });

  await deep.insert([
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'Alert' } },
        }
      },
      out: {
        data: [
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'AlertTitle' } },
              }
            }
          },
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'AlertMessage' } },
              }
            }
          },
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'AlertButtonTitle' } },
              }
            }
          }
        ]
      }
    },
    {
      type_id: typeTypeLinkId,
      from_id: anyTypeLinkId,
      to_id: anyTypeLinkId,
      in: {
        data: [
          {
            type_id: containTypeLinkId,
            from_id: packageLinkId,
            string: { data: { value: 'Prompt' } },
          },
          {
            type_id: typeTypeLinkId,
            from_id: deviceTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'PromptIsCancelled' } },
              }
            }
          },
          {
            type_id: typeTypeLinkId,
            from_id: deviceTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'PromptIsNotCancelled' } },
              }
            }
          }
        ]
      },
      out: {
        data: [
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'PromptTitle' } },
              }
            },
          },
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'PromptMessage' } },
              }
            }
          },
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'PromptOkButtonTitle' } },
              }
            }
          },
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'PromptCancelButtonTitle' } },
              }
            }
          },
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'InputPlaceholder' } },
              }
            }
          },
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'PromptInputText' } },
              }
            },
          },
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'PromptResultValue' } },
              }
            },
          }
        ]
      }
    },
    {
      type_id: typeTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'Confirm' } },
        }
      },
      out: {
        data: [
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'ConfirmTitle' } },
              }
            }
          },
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'ConfirmMessage' } },
              }
            }
          },
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'ConfirmOkButtonTitle' } },
              }
            }
          },
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'ConfirmCancelButtonTitle' } },
              }
            }
          },
          {
            type_id: typeTypeLinkId,
            to_id: anyTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'ConfirmResultValue' } },
              }
            }
          }
        ]
      }
    },
    {
      type_id: baseNotifyTypeLinkId,
      from_id: anyTypeLinkId, // TODO alertTypeLinkId | promptTypeLinkId | confirmTypeLinkId
      to_id: deviceTypeLinkId,
      in: {
        data: [
          {
            type_id: containTypeLinkId,
            from_id: packageLinkId,
            string: { data: { value: 'Notify' } },
          }
        ]
      },
      out: {
        data: [
          {
            type_id: baseNotifiedTypeLinkId,
            to_id: deviceTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: 'Notified' } },
              }
            }
          }
        ]
      }
    }
  ]);
}