import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { CAPACITOR_CAMERA_PACKAGE_NAME } from './package-name';
import { getBase64FromWebp } from './get-base64-from-webp';
import { GalleryPhoto } from '@capacitor/camera';

export interface IUploadGallery {
  deep: DeepClient,
  containerLinkId: number,
  galleryPhotos: GalleryPhoto[]
}


export async function uploadGallery({ deep, containerLinkId, galleryPhotos }: IUploadGallery) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const photoTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Photo");
  const base64TypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Base64");
  const webPathTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "WebPath");
  const exifTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Exif");
  const formatTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Format");
  const timestampTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "TimeStamp");

  const photos = await Promise.all(galleryPhotos.map(async (photo: GalleryPhoto) => ({
    format: photo.format,
    webPath: photo.webPath,
    exif: photo.exif ? photo.exif : "none",
    base64: await getBase64FromWebp(photo.webPath),
  })));

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