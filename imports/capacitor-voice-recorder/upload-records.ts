import { CAPACITOR_VOICE_RECORDER_PACKAGE_NAME } from './package-name';

export default async function uploadRecords(deep, containerLinkId, sounds) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const soundTypeLinkId = await deep.id("@deep-foundation/sound", "Sound");
  const recordTypeLinkId = await deep.id(CAPACITOR_VOICE_RECORDER_PACKAGE_NAME, "Record");
  const durationTypeLinkId = await deep.id(CAPACITOR_VOICE_RECORDER_PACKAGE_NAME, "Duration");
  const startTimeTypeLinkId = await deep.id(CAPACITOR_VOICE_RECORDER_PACKAGE_NAME, "StartTime");
  const endTimeTypeLinkId = await deep.id(CAPACITOR_VOICE_RECORDER_PACKAGE_NAME, "EndTime");
  const mimetypeTypeLinkId = await deep.id("@deep-foundation/sound", "MIME/type");
  const formatTypeLinkId = await deep.id("@deep-foundation/sound", "Format");

  await deep.insert(sounds.map((sound) => ({
    type_id: recordTypeLinkId,
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: containerLinkId,
      }]
    },
    out: {
      data: [
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: soundTypeLinkId,
              string: { data: { value: sound.record["recordDataBase64"] } },
              out: {
                data: [
                  {
                    type_id: containTypeLinkId,
                    to: {
                      data: {
                        type_id: mimetypeTypeLinkId,
                        string: { data: { value: sound.record["mimeType"] } },
                      }
                    }
                  },
                  {
                    type_id: containTypeLinkId,
                    to: {
                      data: {
                        type_id: formatTypeLinkId,
                        string: { data: { value: sound.record["mimeType"] === "audio/webm;codecs=opus" ? "webm" : "aac" } },
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: durationTypeLinkId,
              number: { data: { value: sound.record["msDuration"] } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: startTimeTypeLinkId,
              string: { data: { value: sound.startTime } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: endTimeTypeLinkId,
              string: { data: { value: sound.endTime } },
            }
          }
        }]
    }
  })));
}