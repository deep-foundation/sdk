import { ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { PACKAGE_NAME } from './package-name';
import { getOptionStyleName } from './get-option-style-name';

export async function getOptionStyleTypeLinkIds({
  deep,
}: {
  deep: DeepClient;
}): Promise<Record<ActionSheetButtonStyle, number>> {
  const optionStyleTypeLinkIds = {
    [ActionSheetButtonStyle.Cancel]:
      await deep.id(
        PACKAGE_NAME,
        `${await getOptionStyleName({ style: ActionSheetButtonStyle.Cancel })}OptionStyle`
      ),
    [ActionSheetButtonStyle.Default]:
      await deep.id(
        PACKAGE_NAME,
        `${await getOptionStyleName({ style: ActionSheetButtonStyle.Default })}OptionStyle`
      ),
    [ActionSheetButtonStyle.Destructive]:
      await deep.id(
        PACKAGE_NAME,
        `${await getOptionStyleName({
          style: ActionSheetButtonStyle.Destructive,
        })}OptionStyle`
      ),
  };
  return optionStyleTypeLinkIds;
}
