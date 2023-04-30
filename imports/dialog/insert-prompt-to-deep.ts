import { PromptOptions } from "@capacitor/dialog";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { DIALOG_PACKAGE_NAME } from "./package-name";

export async function insertPrompt({ deep, promptData: promptData, containerLinkId }: { deep: DeepClient, promptData: PromptOptions, containerLinkId: number}): Promise<void> {
  const promptTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "Prompt");
  const promptTitleTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "PromptTitle");
  const promptMessageTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "PromptMessage");
  const promptOkButtonTitleTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "PromptOkButtonTitle");
  const promptCancelButtonTitleTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "PromptCancelButtonTitle");
  const promptInputPlaceholderTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "PromptInputPlaceholder");
  const promptInputTextTypeLinkId = await deep.id(DIALOG_PACKAGE_NAME, "PromptInputText");
  const syncTextFileTypeLinkId = await deep.id("@deep-foundation/core", "SyncTextFile");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");

  await deep.insert({
    type_id: promptTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: containerLinkId
      }
    },
    out: {
      data: [
        promptData.title &&
        {
          type_id: promptTitleTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: containerLinkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: promptData.title
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: containerLinkId
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
              from_id: containerLinkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: promptData.message
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: containerLinkId
                }
              },
            },
          }
        },
        promptData.okButtonTitle && 
        {
          type_id: promptOkButtonTitleTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: containerLinkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: promptData.okButtonTitle
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: containerLinkId
                }
              },
            },
          }
        },
        promptData.cancelButtonTitle && 
        {
          type_id: promptCancelButtonTitleTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: containerLinkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: promptData.cancelButtonTitle
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: containerLinkId
                }
              },
            },
          }
        },
        promptData.inputPlaceholder && 
        {
          type_id: promptInputPlaceholderTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: containerLinkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: promptData.inputPlaceholder
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: containerLinkId
                }
              },
            },
          }
        },
        promptData.inputText && 
        {
          type_id: promptInputTextTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: containerLinkId
            }
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: promptData.inputText
                }
              },
              in: {
                data: {
                  type_id: containTypeLinkId,
                  from_id: containerLinkId
                }
              },
            },
          }
        }
      ]
    }
  });
}