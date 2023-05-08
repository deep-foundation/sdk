import {
  ActionSheet,
  ActionSheetButtonStyle,
  ShowActionsOptions,
} from '@capacitor/action-sheet';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { getOptionStyleName } from './get-option-style-name';
import { getOptionStyleTypeLinkIds } from './get-option-style-type-link-ids';
import { ACTION_SHEET_PACKAGE_NAME } from './package-name';
import _ from 'lodash';

export async function insertActionSheet({
  deep,
  actionSheetData,
  containerLinkId,
}: {
  deep: DeepClient;
  actionSheetData: ShowActionsOptions;
  containerLinkId: number;
}) {
  if (!containerLinkId) {
    throw new Error(`containerLinkId is required`);
  }

  const syncTextFileTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'SyncTextFile'
  );
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const actionSheetTypeLinkId = await deep.id(
    ACTION_SHEET_PACKAGE_NAME,
    'ActionSheet'
  );
  const actionSheetTitleTypeLinkId = await deep.id(
    ACTION_SHEET_PACKAGE_NAME,
    'ActionSheetTitle'
  );
  const actionSheetMessageTypeLinkId = await deep.id(
    ACTION_SHEET_PACKAGE_NAME,
    'ActionSheetMessage'
  );
  const optionTypeLinkId = await deep.id(
    ACTION_SHEET_PACKAGE_NAME,
    'ActionSheetOption'
  );
  const usesOptionTypeLinkId = await deep.id(
    ACTION_SHEET_PACKAGE_NAME,
    'UsesActionSheetOption'
  );
  const optionTitleTypeLinkId = await deep.id(
    ACTION_SHEET_PACKAGE_NAME,
    'ActionSheetOptionTitle'
  );
  const optionStyleTypeLinkId = await deep.id(
    ACTION_SHEET_PACKAGE_NAME,
    'ActionSheetOptionStyle'
  );

  await deep.insert([
    {
      type_id: actionSheetTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: containerLinkId,
        },
      },
      out: {
        data: [
          {
            type_id: actionSheetTitleTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: containerLinkId,
              },
            },
            to: {
              data: {
                type_id: syncTextFileTypeLinkId,
                in: {
                  data: {
                    type_id: containTypeLinkId,
                    from_id: containerLinkId,
                  },
                },
                string: {
                  data: {
                    value: actionSheetData.title,
                  },
                },
              },
            },
          },
          {
            type_id: actionSheetMessageTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: containerLinkId,
              },
            },
            to: {
              data: {
                type_id: syncTextFileTypeLinkId,
                in: {
                  data: {
                    type_id: containTypeLinkId,
                    from_id: containerLinkId,
                  },
                },
                string: {
                  data: {
                    value: actionSheetData.message,
                  },
                },
              },
            },
          },
          ...(await Promise.all(
            actionSheetData.options.map(async (option, i) => ({
              type_id: usesOptionTypeLinkId,
              in: {
                data: [
                  {
                    type_id: containTypeLinkId,
                    from_id: deep.linkId,
                  },
                ],
              },
              number: {
                data: {
                  value: i,
                },
              },
              to: {
                data: {
                  type_id: optionTypeLinkId,
                  in: {
                    data: [
                      {
                        type_id: containTypeLinkId,
                        from_id: deep.linkId,
                      },
                    ],
                  },
                  out: {
                    data: [
                      {
                        type_id: optionTitleTypeLinkId,
                        in: {
                          data: {
                            type_id: containTypeLinkId,
                            from_id: containerLinkId,
                          },
                        },
                        to: {
                          data: {
                            type_id: syncTextFileTypeLinkId,
                            in: {
                              data: {
                                type_id: containTypeLinkId,
                                from_id: containerLinkId,
                              },
                            },
                            string: {
                              data: {
                                value: option.title,
                              },
                            },
                          },
                        },
                      },
                      ...(option.style
                        ? [
                            {
                              type_id: optionStyleTypeLinkId,
                              in: {
                                data: {
                                  type_id: containTypeLinkId,
                                  from_id: containerLinkId,
                                },
                              },
                              to_id: await deep.id(
                                ACTION_SHEET_PACKAGE_NAME,
                                `ActionSheet${_.upperFirst(
                                  _.lowerCase(option.style)
                                )}OptionStyle`
                              ),
                            },
                          ]
                        : []),
                    ],
                  },
                },
              },
            }))
          )),
        ],
      },
    },
  ]);
}
