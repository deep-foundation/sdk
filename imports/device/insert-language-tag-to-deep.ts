import { Device, LanguageTag } from "@capacitor/device";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertLanguageTagToDeep({deep, deviceLinkId, deviceLanguageTag}: {deep: DeepClient, deviceLinkId: number, deviceLanguageTag: LanguageTag}) {

	if(!deviceLinkId) {
		throw new Error("deviceLinkId must not be 0")
	}

  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const languageTagTypeLinkId = await deep.id(PACKAGE_NAME, 'LanguageTag');

  const {
		data: [{ id: batteryLevelLinkId }],
	} = await deep.insert({
		type_id: languageTagTypeLinkId,
		string: { data: { value: deviceLanguageTag.value } },
		in: {
			data: {
				type_id: containTypeLinkId,
				from_id: deviceLinkId,
			},
		},
	});
  
}