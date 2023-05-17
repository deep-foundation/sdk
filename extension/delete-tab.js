import { getLinkId } from "./get-link-id.js"
import { GQL_URL, GQL_TOKEN, DEVICE_LINK_ID, PACKAGE_NAME } from "./config.js"

export const executeDeleteTab = async (tabId) => {
  const containTypeLinkId = await getLinkId("@deep-foundation/core", "Contain");
  const browserExtensionTypeLinkId = await getLinkId(PACKAGE_NAME, "BrowserExtension");
  const tabTypeLinkId = await getLinkId(PACKAGE_NAME, "Tab");
  const containTreeId = await getLinkId("@deep-foundation/core", "containTree");

  const requestPayload = {
    query: `
        mutation deleteTab($containTypeLinkId: bigint!, $browserExtensionTypeLinkId: bigint!, $tabTypeLinkId: bigint!, $tabId: bigint!, $containTreeId: bigint!) {
            delete_links(
                where: {
                  up: {
                    tree_id: { _eq: $containTreeId }
                    parent: {
                      type_id: { _eq: $containTypeLinkId }
                      from: { type_id: { _eq: $browserExtensionTypeLinkId } }
                      to: {
                        _or: [
                          { type_id: { _eq: $tabTypeLinkId }, number: { value: { _eq: $tabId} } }
                        ]
                      }
                    }
                  }
                }
              ) {
                returning {
                  id
                }
              }
            }
      `,
    variables: {
      containTypeLinkId: containTypeLinkId,
      browserExtensionTypeLinkId: browserExtensionTypeLinkId,
      tabTypeLinkId: tabTypeLinkId,
      tabId: tabId,
      containTreeId: containTreeId,
    },
  };

  const response = await fetch(GQL_URL, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Authorization": `Bearer ${GQL_TOKEN}`,
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(requestPayload),
  });

  const responseData = await response.json();
  console.log(responseData);

  return responseData.data.delete_links.returning;
};