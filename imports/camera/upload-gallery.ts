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

  const readAsBase64 = async (webPath) => {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(webPath!);
    const blob = await response.blob();
    return await convertBlobToBase64(blob) as string;
  }

  const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
  const webPath = await readAsBase64(galleryImages[0].webPath);
  console.log(webPath);


  const { data: [{ id: photoLinkId }] } = await deep.insert(galleryImages.map(async (images) => ({
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
              // string: { data: { value: await readAsBase64(images.photos[0].webPath) } },
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