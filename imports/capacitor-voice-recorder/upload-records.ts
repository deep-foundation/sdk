import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from './package-name';
import { ISound } from "./stop-recording";
import { LinkName } from "./link-name";

export interface IRecord { // Represents a record containing sound and its details.
  sound: ISound; // The recorded sound.
  startTime: string; // The start time of the recording.
  endTime: string; // The end time of the recording.
}

export interface IUploadRecordsOptions { // Represents the parameters for uploading records.
  deep: DeepClient; // The DeepClient instance.
  containerLinkId: number; // The ID of the container link.
  records: IRecord[]; // An array of records to be uploaded.
}

// uploadRecords function uploads the recorded sound with its details.

export async function uploadRecords({deep, containerLinkId, records}:IUploadRecordsOptions) {

  // Get the link IDs for nessesary types.

  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const recordTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Record]);
  const durationTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Duration]);
  const startTimeTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.StartTime]);
  const endTimeTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.EndTime]);
  const mimetypeTypeLinkId = await deep.id("@deep-foundation/sound", LinkName[LinkName["MIME/type"]]);
  const formatTypeLinkId = await deep.id("@deep-foundation/sound", LinkName[LinkName.Format]);
  const soundTypeLinkId = await deep.id("@deep-foundation/sound", LinkName[LinkName.Sound]);

  // Map the records to the links structure defined in package type links structure and insert into the database.

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