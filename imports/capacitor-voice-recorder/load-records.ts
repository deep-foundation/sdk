import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";
import { CAPACITOR_VOICE_RECORDER_PACKAGE_NAME } from './package-name';

export default async function loadRecords(deep: DeepClient):Promise<any[]> {
  const recordTypelinkId = await deep.id(CAPACITOR_VOICE_RECORDER_PACKAGE_NAME, "Record");
  const mimetypeTypeLinkId = await deep.id("@deep-foundation/sound", "MIME/type");
  const soundTypeLinkId = await deep.id("@deep-foundation/sound", "Sound");
  const { data: recordLinks } = await deep.select({
    type_id: recordTypelinkId
  });

  let records: any[] = [];

  for (let recordLink of recordLinks) {
    const { data } = await deep.select({
      up: {
        parent: {
          id: recordLink.id
        },
        link: {
          type_id: {
            _in:
              [
                soundTypeLinkId,
                mimetypeTypeLinkId
              ]
          }
        }
      },
    })
    const soundLink = data.filter((link:Link<number>) => link.type_id === soundTypeLinkId)
    const mimetypeLink = data.filter((link:Link<number>) => link.type_id === mimetypeTypeLinkId)
    records = [...records, { sound: soundLink[0].value.value, mimetype: mimetypeLink[0].value.value }]
  }
  return records;
}