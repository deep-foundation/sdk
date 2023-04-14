import { getLinkId } from "./get-link-id.js"
import { GQL_URL, GQL_TOKEN, PACKAGE_NAME } from "./config.js"

export const executeActivateTab = async (tabId) => {
    const containTypeLinkId = await getLinkId("@deep-foundation/core", "Contain");
    const activeTypeLinkId = await getLinkId(PACKAGE_NAME, "Active");
    const tabTypeLinkId = await getLinkId(PACKAGE_NAME, "Tab");
  
    const requestPayload = {
      query: `
        mutation activateTab($activeTypeLinkId: bigint!, $containTypeLinkId: bigint!, $tabTypeLinkId: bigint!, $tabId: bigint!) {
          update_strings(
            where: { link: {
              type_id: {_eq: $activeTypeLinkId},
              in:{
                type_id: {_eq: $containTypeLinkId},
                from:{
                  type_id: {_eq: $tabTypeLinkId},
                  number: {value: {_eq: $tabId}}
                }
              }
            }
          }
            _set: {value: "true"}
          ) {
            returning {
              id
            }
          }
        }
      `,
      variables: {
        activeTypeLinkId: activeTypeLinkId,
        containTypeLinkId: containTypeLinkId,
        tabTypeLinkId: tabTypeLinkId,
        tabId: tabId,
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
  
    return responseData.data.update_strings.returning;
  };