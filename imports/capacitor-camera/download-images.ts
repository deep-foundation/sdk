import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { PACKAGE_NAME } from './package-name';
import { LinkName } from './link-name';

/**
 * Downloads images created by this camera package from deep database.
 * @param {DeepClient} deep - The DeepClient object used for communication.
 * @returns {Promise<any[]>} A Promise that resolves with an array of downloaded images.
 */
export const downloadImages = async (deep: DeepClient): Promise<any[]> => {
  // Retrieve the link IDs for the nessesary types.
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain"); 
  const photoTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Photo]); 
  const cameraTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Camera]); 

  const { data } = await deep.select({
    type_id: photoTypeLinkId,
    in: {
      type_id: containTypeLinkId,
      from: {
        type_id: cameraTypeLinkId
      }
    }
  }, {
    "returning": `id
        properties: out {
          property: to {
            type {
              in(where: {value: {_is_null: false}}) {
                value
              }
            }
            value
          }
        }
      `}); // Fetch images from the camera package and retrieve their properties.

  const images = data.map(photo => {
    photo.properties.forEach((property: any) => photo[property.property.type.in[0].value.value] = property.property.value.value);
    return photo;
  });

  return images; // Return the downloaded images.
}