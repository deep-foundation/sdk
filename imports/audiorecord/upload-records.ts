import { PACKAGE_NAME } from "./initialize-package";

export default async function uploadRecords(deep, deviceLinkId, audioChunks) {
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const audioRecordsLinkId = await deep.id(deviceLinkId, "AudioRecords");
    const audioChunkTypeLinkId = await deep.id(PACKAGE_NAME, "AudioChunk");
    const recordTypeLinkId = await deep.id(PACKAGE_NAME, "Record");
    const durationTypeLinkId = await deep.id(PACKAGE_NAME, "Duration");
    const startTimeTypeLinkId = await deep.id(PACKAGE_NAME, "StartTime");
    const endTimeTypeLinkId = await deep.id(PACKAGE_NAME, "EndTime");
    const formatTypeLinkId = await deep.id(PACKAGE_NAME, "Format");
    await deep.insert(audioChunks.map((audioChunk) => ({
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
                type_id: audioChunkTypeLinkId,
                string: { data: { value: audioChunk.record["recordDataBase64"] } },
              }
            }
          },
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: durationTypeLinkId,
                string: { data: { value: audioChunk.record["msDuration"].toString() } },
              }
            }
          },
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: startTimeTypeLinkId,
                string: { data: { value: audioChunk.startTime } },
              }
            }
          },
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: endTimeTypeLinkId,
                string: { data: { value: audioChunk.endTime } },
              }
            }
          },
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: formatTypeLinkId,
                string: { data: { value: audioChunk.record["mimeType"] } },
              }
            }
          }]
      }
    })));
  }