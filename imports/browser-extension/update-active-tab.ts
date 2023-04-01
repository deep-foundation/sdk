import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./install-package";

export default async function updateActiveTab(deep: DeepClient, deviceLinkId, activeTab) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const browserExtensionLinkId = await deep.id(deviceLinkId, "BrowserExtension");
  const tabTypeLinkId = await deep.id(PACKAGE_NAME, "Tab");
  const urlTypeLinkId = await deep.id(PACKAGE_NAME, "TabUrl");
  const titleTypeLinkId = await deep.id(PACKAGE_NAME, "TabTitle");
  const activeTypeLinkId = await deep.id(PACKAGE_NAME, "Active");

  await deep.insert({
    type_id: tabTypeLinkId,
    number: { data: { value: activeTab.id } },
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
              string: { data: { value: activeTab.url } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: titleTypeLinkId,
              string: { data: { value: activeTab.title } },
            }
          }
        },
        {
          type_id: containTypeLinkId,
          to: {
            data: {
              type_id: activeTypeLinkId,
              string: { data: { value: activeTab.active ? "true" : "false" } },
            }
          }
        }]
    }
  })
}