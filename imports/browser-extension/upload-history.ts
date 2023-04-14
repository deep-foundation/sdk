import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export default async function uploadHistory(deep: DeepClient, deviceLinkId, history) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const browserExtensionLinkId = await deep.id(deviceLinkId, "BrowserExtension");
  const pageTypeLinkId = await deep.id(PACKAGE_NAME, "Page");
  const urlTypeLinkId = await deep.id(PACKAGE_NAME, "PageUrl");
  const titleTypeLinkId = await deep.id(PACKAGE_NAME, "PageTitle");
  const typedCountTypeLinkId = await deep.id(PACKAGE_NAME, "TypedCount");
  const visitCountTypeLinkId = await deep.id(PACKAGE_NAME, "VisitCount");
  const lastVisitTimeTypeLinkId = await deep.id(PACKAGE_NAME, "LastVisitTime");

  await deep.insert(history.map((page) => ({
    type_id: pageTypeLinkId,
    number: { data: { value: page.id } },
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: browserExtensionLinkId,
      }]
    },
    out: {
      data: [
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: urlTypeLinkId,
              string: { data: { value: page.url } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: titleTypeLinkId,
              string: { data: { value: page.title } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: typedCountTypeLinkId,
              string: { data: { value: page.typedCount ? page.typedCount.toString() : "none" } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: visitCountTypeLinkId,
              string: { data: { value: page.visitCount ? page.visitCount.toString() : "none" } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: lastVisitTimeTypeLinkId,
              string: { data: { value: page.lastVisitTime ? page.lastVisitTime.toString() : "none" } },
            }
          }
        }]
    }
  })))
}