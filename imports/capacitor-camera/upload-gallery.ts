import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { CAPACITOR_CAMERA_PACKAGE_NAME } from './package-name';

export interface IUploadGallery {
  deep: DeepClient,
  containerLinkId: number,
  galleryImages: any
}


export default async function uploadGallery({ deep, containerLinkId, galleryImages }: IUploadGallery) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const photoTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Photo");
  const base64TypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Base64");
  const webPathTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "WebPath");
  const exifTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Exif");
  const formatTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "Format");
  const timestampTypeLinkId = await deep.id(CAPACITOR_CAMERA_PACKAGE_NAME, "TimeStamp");

  const readAsBase64 = async (webPath) => {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(webPath);
    const blob = await response.blob();
    return await convertBlobToBase64(blob) as string;
  };

  const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  const photos = await Promise.all(galleryImages.map(async (image) => ({
    format: image.photos[0].format,
    webPath: image.photos[0].webPath,
    base64: await readAsBase64(image.photos[0].webPath),
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
        }]
    }
  })));
}