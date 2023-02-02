import {
  ActionSheet,
  ActionSheetButtonStyle,
  ShowActionsOptions,
} from '@capacitor/action-sheet';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { getOptionStyleName } from './get-option-style-name';
import { getOptionStyleTypeLinkIds } from './get-option-style-type-link-ids';
import { PACKAGE_NAME } from './package-name';

export async function insertActionSheet({
  deep,
  actionSheetOptions: actionSheetData,
}: {
  deep: DeepClient;
  actionSheetOptions: ShowActionsOptions;
}) {
  const syncTextFileTypeLinkId = await deep.id(
    '@deep-foundation/core',
    'SyncTextFile'
  );
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const actionSheetTypeLinkId = await deep.id(PACKAGE_NAME, 'ActionSheet');
  const actionSheetTitleTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'ActionSheetTitle'
  );
  const actionSheetMessageTypeLinkId = await deep.id(
    PACKAGE_NAME,
    'ActionSheetMessage'
  );
  const optionTypeLinkId = await deep.id(PACKAGE_NAME, 'Option');
  const optionTitleTypeLinkId = await deep.id(PACKAGE_NAME, 'OptionTitle');
  const optionStyleTypeLinkId = await deep.id(PACKAGE_NAME, 'OptionStyle');
  const optionStyleTypeLinkIds = getOptionStyleTypeLinkIds({ deep });

  await deep.insert([
    {
      type_id: actionSheetTypeLinkId,
      out: {
        data: [
          {
            type_id: actionSheetTitleTypeLinkId,
            to: {
              data: {
                type_id: syncTextFileTypeLinkId,
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
            to: {
              data: {
                type_id: syncTextFileTypeLinkId,
                string: {
                  data: {
                    value: actionSheetData.message,
                  },
                },
              },
            },
          },
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: optionTypeLinkId,
                out: {
                  data: (
                    await Promise.all(
                      actionSheetData.options.map(async (option) => [
                        {
                          type_id: containTypeLinkId,
                          to: {
                            data: {
                              type_id: optionTitleTypeLinkId,
                              to: {
                                data: {
                                  type_id: syncTextFileTypeLinkId,
                                  string: {
                                    data: {
                                      value: option.title,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                        {
                          type_id: containTypeLinkId,
                          to: {
                            data: {
                              type_id: optionStyleTypeLinkId,
                              to_id:
                                optionStyleTypeLinkIds[
                                  await getOptionStyleName({
                                    style: option.style,
                                  })
                                ],
                            },
                          },
                        },
                      ])
                    )
                  ).flat(),
                },
              },
            },
          },
        ],
      },
    },
  ]);
}
