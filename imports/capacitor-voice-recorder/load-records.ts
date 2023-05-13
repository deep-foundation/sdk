import { CAPACITOR_VOICE_RECORDER_PACKAGE_NAME } from './package-name';

export default async function loadRecords(deep) {
  const recordTypelinkId = await deep.id(CAPACITOR_VOICE_RECORDER_PACKAGE_NAME, "Record");
  const soundTypelinkId = await deep.id(CAPACITOR_VOICE_RECORDER_PACKAGE_NAME, "Sound");
  const mimetypeTypelinkId = await deep.id(CAPACITOR_VOICE_RECORDER_PACKAGE_NAME, "MIME/type");
  const { data: recordLinks } = await deep.select({
    type_id: recordTypelinkId
  });

  let records = [];

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
                soundTypelinkId,
                mimetypeTypelinkId
              ]
          }
        }
      },
    })
    const soundLink = data.filter((link) => link.type_id === soundTypelinkId)
    const mimetypeLink = data.filter((link) => link.type_id === mimetypeTypelinkId)
    records = [...records, { sound: soundLink[0].value.value, mimetype: mimetypeLink[0].value.value }]
  }
  return records;
}