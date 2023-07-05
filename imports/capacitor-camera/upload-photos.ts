import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { Photo } from '@capacitor/camera';
import { CAPACITOR_CAMERA_PACKAGE_NAME } from './package-name';

export interface IUploadPhotos {
  deep: DeepClient,
  containerLinkId: number,
  photos: Photo[]
}

export async function uploadPhotos({ deep, containerLinkId, photos }: IUploadPhotos) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const photoTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Photo");
  const base64TypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Base64");
  const webPathTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "WebPath");
  const exifTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Exif");
  const formatTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Format");
  const timestampTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "TimeStamp");

  const { data: [{ id: photoLinkId }] } = await deep.insert(photos.map((photo) => ({
    type_id: photoTypeLinkId,
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
              type_id: base64TypeLinkId,
              string: { data: { value: `data:image/${photo.format};base64,` + photo.base64String } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: webPathTypeLinkId,
              string: { data: { value: photo.webPath ? photo.webPath : "none" } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: formatTypeLinkId,
              string: { data: { value: photo.format } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: exifTypeLinkId,
              string: { data: { value: photo.exif ? photo.exif : "none" } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: timestampTypeLinkId,
              string: { data: { value: new Date().toDateString() } },
            }
          }
        }
      ]
    }
  })));
}