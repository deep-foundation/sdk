import { ActionSheetButtonStyle } from "@capacitor/action-sheet";

export async function getOptionStyleName({style} : {style: ActionSheetButtonStyle}): Promise<string> {
  return Object.keys(ActionSheetButtonStyle).find(key => ActionSheetButtonStyle[key] === style);
}