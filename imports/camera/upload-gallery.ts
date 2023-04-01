import { PACKAGE_NAME } from './install-package';


export default async function uploadGallery(deep, deviceLinkId, galleryImages) {
    const cameraLinkId = await deep.id(deviceLinkId, "Camera");
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const photoTypeLinkId = await deep.id(PACKAGE_NAME, "Photo");
    const base64TypeLinkId = await deep.id(PACKAGE_NAME, "Base64");
    const webPathTypeLinkId = await deep.id(PACKAGE_NAME, "WebPath");
    const exifTypeLinkId = await deep.id(PACKAGE_NAME, "Exif");
    const formatTypeLinkId = await deep.id(PACKAGE_NAME, "Format");
    const timestampTypeLinkId = await deep.id(PACKAGE_NAME, "TimeStamp");

    const { data: [{ id: photoLinkId }] } = await deep.insert(galleryImages.map((images) => ({
      type_id: photoTypeLinkId,
      in: {
        data: [{
          type_id: containTypeLinkId,
          from_id: cameraLinkId,
        }]
      },
      out: {
        data: [
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: webPathTypeLinkId,
                string: { data: { value: images.photos[0].webPath} },
              }
            }
          },
          {
            type_id: containTypeLinkId,
            to: {
              data: {
                type_id: formatTypeLinkId,
                string: { data: { value: images.photos[0].format } },
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