import { ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { PACKAGE_NAME } from './package-name';
import { getOptionStyleName } from './get-option-style-name';

export async function getOptionStyleTypeLinkIds({
  deep,
}: {
  deep: DeepClient;
}): Promise<Record<string, number>> {
  const optionStyleTypeLinkIds = {
    [await getOptionStyleName({ style: ActionSheetButtonStyle.Cancel })]:
      await deep.id(
        PACKAGE_NAME,
        `${await getOptionStyleName({ style: ActionSheetButtonStyle.Cancel })}OptionStyle`
      ),
    [await getOptionStyleName({ style: ActionSheetButtonStyle.Default })]:
      await deep.id(
        PACKAGE_NAME,
        `${await getOptionStyleName({ style: ActionSheetButtonStyle.Default })}OptionStyle`
      ),
    [await getOptionStyleName({ style: ActionSheetButtonStyle.Destructive })]:
      await deep.id(
        PACKAGE_NAME,
        `${await getOptionStyleName({
          style: ActionSheetButtonStyle.Destructive,
        })}OptionStyle`
      ),
  };
  return optionStyleTypeLinkIds;
}
