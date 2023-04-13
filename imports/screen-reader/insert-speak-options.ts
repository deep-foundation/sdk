import { SpeakOptions } from '@capacitor/screen-reader';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { getLanguageOption } from './get-language-option';
import { getValueOption } from './get-value-option';
import { PACKAGE_NAME } from './package-name';

export async function insertSpeakOptions({
  deep,
  options,
}: {
  deep: DeepClient;
  options: SpeakOptions;
}): Promise<void> {
  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const syncTextFileTypeLinkId = await deep.id('@deep-foundation/core', 'SyncTextFile');
  const speakOptionsTypeLinkId = await deep.id(PACKAGE_NAME, 'SpeakOptions');
  const valueTypeLinkId = await deep.id(PACKAGE_NAME, 'Value');
  const languageTypeLinkId = await deep.id(PACKAGE_NAME, 'Language');

  await deep.insert({
    type_id: speakOptionsTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: deep.linkId,
      },
    },
    out: {
      data: [
        {
          type_id: valueTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId,
            },
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: options.value,
                },
              },
            },
          },
        },
        {
          type_id: languageTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: deep.linkId,
            },
          },
          to: {
            data: {
              type_id: syncTextFileTypeLinkId,
              string: {
                data: {
                  value: options.language,
                },
              },
            },
          },
        },
      ],
    },
  });
}
