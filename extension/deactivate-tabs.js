import { getLinkId } from "./get-link-id.js"
import { GQL_URL, GQL_TOKEN, PACKAGE_NAME } from "./config.js"

export const executeDeactivateTabs = async () => {
  const activeTypeLinkId = await getLinkId(PACKAGE_NAME, "Active");
  const requestPayload = {
    query: `
        mutation deactivateTabs {
          update_strings(where: {link: {type_id: {_eq: "${activeTypeLinkId}"}}}, _set: {value: "false"}) {
            returning {
              id
            }
          }
        }
      `,
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