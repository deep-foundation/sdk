import { PromptOptions } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertPromptToDeep({ deep, promptOptions }: { deep: DeepClient, promptOptions: PromptOptions }): Promise<void> {
  const promptTypeLinkId = await deep.id(PACKAGE_NAME, "Prompt");
  const promptTitleTypeLinkId = await deep.id(PACKAGE_NAME, "PromptTitle");
  const promptMessageTypeLinkId = await deep.id(PACKAGE_NAME, "PromptMessage");
  const promptOkButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "PromptOkButtonTitle");
  const promptCancelButtonTitleTypeLinkId = await deep.id(PACKAGE_NAME, "PromptCancelButtonTitle");
  const promptInputPlaceholderTypeLinkId = await deep.id(PACKAGE_NAME, "PromptInputPlaceholder");
  const promptInputTextTypeLinkId = await deep.id(PACKAGE_NAME, "PromptInputText");
  const syncTextFileTypeLinkId = await deep.id("@deep-foundation/core", "SyncTextFile");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");

  await deep.insert({
    type_id: promptTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: deep.linkId
      }
    },
    out: {
      data: [
        promptOptions.title &&
        {
          type_id: promptTitleTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: promptOptions.title
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: deep.linkId
                }
              },
            },
            
          }
        },
        {
          type_id: promptMessageTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: promptOptions.message
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: deep.linkId
                }
              },
            },
          }
        },
        promptOptions.okButtonTitle && 
        {
          type_id: promptOkButtonTitleTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: promptOptions.okButtonTitle
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: deep.linkId
                }
              },
            },
          }
        },
        promptOptions.cancelButtonTitle && 
        {
          type_id: promptCancelButtonTitleTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: promptOptions.cancelButtonTitle
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: deep.linkId
                }
              },
            },
          }
        },
        promptOptions.inputPlaceholder && 
        {
          type_id: promptInputPlaceholderTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: promptOptions.inputPlaceholder
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: deep.linkId
                }
              },
            },
          }
        },
        promptOptions.inputText && 
        {
          type_id: promptInputTextTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: promptOptions.inputText
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: deep.linkId
                }
              },
            },
          }
        }
      ]
    }
  });
}