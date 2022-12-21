import { Device } from "@capacitor/device";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function getLanguageTag(deep: DeepClient, deviceLinkId: number) {

	if(!deviceLinkId) {
		throw new Error("deviceLinkId must not be 0")
	}

  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const languageTagTypeLinkId = await deep.id(PACKAGE_NAME, 'LanguageTag');
  
  const {value: languageTag} = await Device.getLanguageTag();

  const {
		data: [{ id: batteryLevelLinkId }],
	} = await deep.insert({
		type_id: languageTagTypeLinkId,
		string: { data: { value: languageTag } },
		in: {
			data: {
				type_id: containTypeLinkId,
				from_id: deviceLinkId,
			},
		},
	});
  
}