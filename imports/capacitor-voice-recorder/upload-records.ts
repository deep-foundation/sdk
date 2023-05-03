import { PACKAGE_NAME } from "./install-package";

export default async function uploadRecords(deep, deviceLinkId, sounds) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const audioRecordsLinkId = await deep.id(deviceLinkId, "AudioRecords");
  const soundTypeLinkId = await deep.id("@deep-foundation/sound", "Sound");
  const recordTypeLinkId = await deep.id(PACKAGE_NAME, "Record");
  const durationTypeLinkId = await deep.id(PACKAGE_NAME, "Duration");
  const startTimeTypeLinkId = await deep.id(PACKAGE_NAME, "StartTime");
  const endTimeTypeLinkId = await deep.id(PACKAGE_NAME, "EndTime");
  const mimetypeTypeLinkId = await deep.id("@deep-foundation/sound", "MIME/type");
  const formatTypeLinkId = await deep.id("@deep-foundation/sound", "Format");

  await deep.insert(sounds.map((sound) => ({
    type_id: recordTypeLinkId,
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: audioRecordsLinkId,
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