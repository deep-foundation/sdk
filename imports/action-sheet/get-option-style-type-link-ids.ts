import { ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { PACKAGE_NAME } from './package-name';
import { getOptionStyleName } from './get-option-style-name';

export async function getOptionStyleTypeLinkIds({
  deep,
}: {
  deep: DeepClient;
}): Promise<Map<ActionSheetButtonStyle, number>> {
  const optionStyleTypeLinkIds = new Map<ActionSheetButtonStyle, number>(
    await Promise.all(
      Object.keys(ActionSheetButtonStyle).map(
        async (buttonStyle: keyof typeof ActionSheetButtonStyle) => [ActionSheetButtonStyle[buttonStyle] as ActionSheetButtonStyle, await deep.id(PACKAGE_NAME, `ActionSheet${buttonStyle}OptionStyle`)] as readonly [ActionSheetButtonStyle, number]
      )
    )
  );
  console.log(optionStyleTypeLinkIds)
  return optionStyleTypeLinkIds;
}
