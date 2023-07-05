import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { CAPACITOR_VOICE_RECORDER_PACKAGE_NAME } from './package-name';
import { ISound } from "./stop-recording";

export interface IRecord {
  sound: ISound;
  startTime: string;
  endTime: string;
}

export interface IUploadRecords {
  deep: DeepClient;
  containerLinkId: number;
  records: IRecord[];
}

export async function uploadRecords({deep, containerLinkId, records}:IUploadRecords) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const recordTypeLinkId = await deep.id(CAPACITOR_VOICE_RECORDER_PACKAGE_NAME, "Record");
  const durationTypeLinkId = await deep.id(CAPACITOR_VOICE_RECORDER_PACKAGE_NAME, "Duration");
  const startTimeTypeLinkId = await deep.id(CAPACITOR_VOICE_RECORDER_PACKAGE_NAME, "StartTime");
  const endTimeTypeLinkId = await deep.id(CAPACITOR_VOICE_RECORDER_PACKAGE_NAME, "EndTime");
  const mimetypeTypeLinkId = await deep.id("@deep-foundation/sound", "MIME/type");
  const formatTypeLinkId = await deep.id("@deep-foundation/sound", "Format");
  const soundTypeLinkId = await deep.id("@deep-foundation/sound", "Sound");

  await deep.insert(records.map((record) => ({
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
              string: { data: { value: record.sound["recordDataBase64"] } },
              out: {
                data: [
                  {
                    type_id: containTypeLinkId,
                    to: {
                      data: {
                        type_id: mimetypeTypeLinkId,
                        string: { data: { value: record.sound["mimeType"] } },
                      }
                    }
                  },
                  {
                    type_id: containTypeLinkId,
                    to: {
                      data: {
                        type_id: formatTypeLinkId,
                        string: { data: { value: record.sound["mimeType"] === "audio/webm;codecs=opus" ? "webm" : "aac" } },
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
              number: { data: { value: record.sound["msDuration"] } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: startTimeTypeLinkId,
              string: { data: { value: record.startTime } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: endTimeTypeLinkId,
              string: { data: { value: record.endTime } },
            }
          }
        }]
    }
  })));
}