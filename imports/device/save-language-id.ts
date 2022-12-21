import { Device } from "@capacitor/device";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function getLanguageId(deep: DeepClient, deviceLinkId: number) {

	if(!deviceLinkId) {
		throw new Error("deviceLinkId must not be 0")
	}

  const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const languageCodeTypeLinkId = await deep.id(PACKAGE_NAME, 'LanguageCode');
  
  const {value: languageCode} = await Device.getLanguageCode();

  const {
		data: [{ id: languageCodeLinkId }],
	} = await deep.insert({
		type_id: languageCodeTypeLinkId,
		string: { data: { value: languageCode } },
		in: {
			data: {
				type_id: containTypeLinkId,
				from_id: deviceLinkId,
			},
		},
	});
  
}