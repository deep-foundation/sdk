import { DeepClient } from "@deep-foundation/deeplinks/imports/client";

export const PACKAGE_NAME = "@deep-foundation/audiorecord"
export const PACKAGE_TYPES =
  ["DeviceSupport", "Permissions", "AudioRecords", "Record", "Duration", "StartTime", "EndTime", "AudioChunk", "Format"]

export default async function initializePackage(deep: DeepClient, deviceLinkId) {
  const packageTypeLinkId = await deep.id('@deep-foundation/core', "Package")
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain")
  const joinTypeLinkId = await deep.id("@deep-foundation/core", "Join")
  const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type")

  const { data: [{ id: packageLinkId }] } = await deep.insert({
    type_id: packageTypeLinkId,
    string: { data: { value: PACKAGE_NAME } },
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: deep.linkId,
      }]
    },
    out: {
      data: [{
        type_id: joinTypeLinkId,
        to_id: await deep.id('deep', 'users', 'packages')
      }, {
        type_id: joinTypeLinkId,
        to_id: await deep.id('deep', 'admin')
      }]
    },
  })
  const { data: [{ id: pacakgeTypeLinkId }] } = await deep.insert(PACKAGE_TYPES.map((TYPE) => ({
    type_id: typeTypeLinkId,
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: TYPE } }
      }]
    }
  })))
  const { data: [{ id: AudioRecordsLinkId }] } = await deep.insert({
    type_id: await deep.id(PACKAGE_NAME, "AudioRecords"),
    string: { data: { value: "AudioRecords" } },
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: deviceLinkId,
        string: { data: { value: "AudioRecords" } },
      }
    }
  })
  console.log("audiorecord package installed");
  
}