export const executeDeactivateTabs = async () => {
	const activeTypeLinkId = await getLinkId("@deep-foundation/browser-extension", "Active");
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

  const response = await fetch("http://127.0.0.1:3006/gql", {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Authorization": "Bearer <your-token>",
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