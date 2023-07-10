import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { Photo } from '@capacitor/camera';
import { PACKAGE_NAME } from './package-name';
import { LinkName } from './link-name';

export interface IUploadPhotosOptions {
  deep: DeepClient, // The DeepClient instance.
  containerLinkId: number, // The ID of the container link.
  photos: Photo[] // Array of photos to upload.
}

export async function uploadPhotos({ deep, containerLinkId, photos }: IUploadPhotosOptions) {
  // Retrieve the link IDs for the nessesary types.
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const photoTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Photo]);
  const base64TypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Base64]);
  const webPathTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.WebPath]);
  const exifTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Exif]);
  const formatTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Format]);
  const timestampTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.TimeStamp]);

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