import { PACKAGE_NAME } from './install-package';

export default async function uploadPhotos(deep, deviceLinkId, photos) {
    const cameraLinkId = await deep.id(deviceLinkId, "Camera");
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const photoTypeLinkId = await deep.id(PACKAGE_NAME, "Photo");
    const base64TypeLinkId = await deep.id(PACKAGE_NAME, "Base64");
    const webPathTypeLinkId = await deep.id(PACKAGE_NAME, "WebPath");
    const exifTypeLinkId = await deep.id(PACKAGE_NAME, "Exif");
    const formatTypeLinkId = await deep.id(PACKAGE_NAME, "Format");
    const timestampTypeLinkId = await deep.id(PACKAGE_NAME, "TimeStamp");

    const { data: [{ id: photoLinkId }] } = await deep.insert(photos.map((photo) => ({
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
                            type_id: base64TypeLinkId,
                            string: { data: { value: photo.base64String } },
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
                            string: { data: { value: new Date() } },
                        }
                    }
                }
            ]
        }
    })));
}