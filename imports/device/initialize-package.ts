import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function initializePackage(deep: DeepClient) {

  const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type");
  const anyTypeLinkId = await deep.id("@deep-foundation/core", "Any");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const packageTypeLinkId = await deep.id("@deep-foundation/core", "Package");
  const joinTypeLinkId = await deep.id("@deep-foundation/core", "Join");
  const valueTypeLinkId = await deep.id("@deep-foundation/core", "Value");
  const stringTypeLinkId = await deep.id("@deep-foundation/core", "String");
  const numberTypeLinkId = await deep.id("@deep-foundation/core", "Number");

  const { error } = await deep.insert({
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
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'UUID' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId
                }
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'Device' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId
                }
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'UUID' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId
                }
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'Name' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId
                }
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'Model' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId
                }
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'Platform' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId
                }
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'Operating System' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId
                }
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'OS Version' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId
                }
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'Manufacturer' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId
                }
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'IsVirtual' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'MemUsed' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: numberTypeLinkId
                }
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'RealDiskFree' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: numberTypeLinkId
                }
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'WebViewVersion' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId
                }
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'BatteryLevel' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: numberTypeLinkId
                }
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'IsCharging' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'IsNotCharging' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'LanguageCode' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: numberTypeLinkId
                }
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          string: { data: { value: 'LanguageTag' } },
          to: {
            data: {
              type_id: typeTypeLinkId,
              from_id: anyTypeLinkId,
              to_id: anyTypeLinkId,
              out: {
                data: {
                  type_id: valueTypeLinkId,
                  to_id: stringTypeLinkId
                }
              }
            }
          }
        },
      ]
    },
  });

  if (error) throw new Error(error);
}