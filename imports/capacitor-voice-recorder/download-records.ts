import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks";
import { PACKAGE_NAME } from './package-name';
import { LinkName } from "./link-name";

export interface IRecord { // Represents a downloaded record.
  sound: string,
  mimetype: string,
  startTime: string,
  endTime: string,
  duration: number
}

/**
 * Downloads all records from the deeplinks database.
 * @param {DeepClient} deep - The DeepClient instance.
 */

export async function downloadRecords(deep: DeepClient): Promise<IRecord[]> {
  // Retrieve the link IDs for the nessesary types.
  const recordTypelinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Record]);
  const startTimeTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.StartTime]);
  const endTimeTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.EndTime]);
  const durationTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Duration]);
  const mimetypeTypeLinkId = await deep.id("@deep-foundation/sound", LinkName[LinkName["MIME/type"]]);
  const soundTypeLinkId = await deep.id("@deep-foundation/sound", LinkName[LinkName.Sound]);

  const { data: recordLinks } = await deep.select({
    type_id: recordTypelinkId
  }); // Retrieve all record links.

  let records: any[] = [];

  for (let recordLink of recordLinks) {
    const { data } = await deep.select({
      up: {
        parent: {
          id: recordLink.id
        },
        link: {
          type_id: {
            _in: [soundTypeLinkId, mimetypeTypeLinkId, startTimeTypeLinkId, endTimeTypeLinkId, durationTypeLinkId]
          }
        }
      },
    }); // Retrieve the linked data for sound and mimetype types.

    // Filter the linked data 
    const sound = data.filter((link: Link<number>) => link.type_id === soundTypeLinkId)[0].value.value; 
    const mimetype = data.filter((link: Link<number>) => link.type_id === mimetypeTypeLinkId)[0].value.value;
    const startTime = data.filter((link: Link<number>) => link.type_id === startTimeTypeLinkId)[0].value.value; 
    const endTime = data.filter((link: Link<number>) => link.type_id === endTimeTypeLinkId)[0].value.value; 
    const duration = data.filter((link: Link<number>) => link.type_id === durationTypeLinkId)[0].value.value; 

    records = [...records, { sound, mimetype, startTime, endTime, duration }]; // Add the record to the records array.
  }
  return records; // Return the array of records.
}