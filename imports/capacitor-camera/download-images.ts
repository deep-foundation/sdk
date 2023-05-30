import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { CAPACITOR_CAMERA_PACKAGE_NAME } from './package-name';

export const downloadImages = async (deep:DeepClient) => {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const photoTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Photo");
  const cameraTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Camera");

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
      `})
  const images = data.map(photo => {
    photo.properties.forEach(property => photo[property.property.type.in[0].value.value] = property.property.value.value)
    return photo;
  })
  return images;
}