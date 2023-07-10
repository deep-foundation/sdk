import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { PACKAGE_NAME } from './package-name';
import { getBase64FromWebp } from './get-base64-from-webp';
import { GalleryPhoto } from '@capacitor/camera';
import { LinkName } from './link-name';

export interface IUploadGalleryOptions {
  deep: DeepClient; // The DeepClient instance.
  containerLinkId: number; // The ID of the container link.
  galleryPhotos: GalleryPhoto[]; // Array of gallery photos to upload.
}


export async function uploadGallery({ deep, containerLinkId, galleryPhotos }: IUploadGalleryOptions) {
  // Retrieve the link IDs for the nessesary types.
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const photoTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Photo]);
  const base64TypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Base64]);
  const webPathTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.WebPath]);
  const exifTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Exif]);
  const formatTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.Format]);
  const timestampTypeLinkId = await deep.id(PACKAGE_NAME, LinkName[LinkName.TimeStamp]);

  const photos = await Promise.all(galleryPhotos.map(async (photo: GalleryPhoto) => ({
    format: photo.format,
    webPath: photo.webPath,
    exif: photo.exif ? photo.exif : "none",
    base64: await getBase64FromWebp(photo.webPath),
  }))); // Get the Base64-encoded image data from the web path.

  console.log({ photos });

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
              string: { data: { value: photo.base64 } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: webPathTypeLinkId,
              string: { data: { value: photo.webPath } },
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
              string: { data: { value: photo.exif } },
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
        }]
    }
  })));
}