import { getLinkId } from "./get-link-id";

const prepareInsertTabsVariables = async (tabs) => {
	const containTypeLinkId = await getLinkId("@deep-foundation/core", "Contain");
	const browserExtensionLinkId = await getLinkId(2457, "BrowserExtension");
	const tabTypeLinkId = await getLinkId("@deep-foundation/browser-extension", "Tab");
	const urlTypeLinkId = await getLinkId("@deep-foundation/browser-extension", "TabUrl");
	const titleTypeLinkId = await getLinkId("@deep-foundation/browser-extension", "TabTitle");
	const activeTypeLinkId = await getLinkId("@deep-foundation/browser-extension", "Active");
	const links = tabs.map((tab) => ({
		type_id: tabTypeLinkId,
		number: { data: { value: tab.id } },
		in: {
			data: [
				{
					type_id: containTypeLinkId,
					from_id: browserExtensionLinkId,
				},
			],
		},
		out: {
			data: [
				{
					type_id: containTypeLinkId,
					to: {
						data: {
							type_id: urlTypeLinkId,
							string: { data: { value: tab.url } },
						},
					},
				},
				{
					type_id: containTypeLinkId,
					to: {
						data: {
							type_id: titleTypeLinkId,
							string: { data: { value: tab.title } },
						},
					},
				},
				{
					type_id: containTypeLinkId,
					to: {
						data: {
							type_id: activeTypeLinkId,
							string: { data: { value: tab.active ? "true" : "false" } },
						},
					},
				},
			],
		},

	}));

	return { links };
};

export const executeInsertTabs = async (tabs) => {
	const variables = await prepareInsertTabsVariables(tabs);

	const requestPayload = {
		query: `
      mutation InsertLinks($links: [links_insert_input!]!) {
        insert_links(objects: $links) {
          returning {
            id
          }
        }
      }
      `,
		variables,
	};

	const response = await fetch("http://127.0.0.1:3006/gql", {
		method: "POST",
		cache: "no-cache",
		headers: {
			"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4iLCJ4LWhhc3VyYS11c2VyLWlkIjoiMzc2In0sImlhdCI6MTY3OTkzNTMyOH0.LmDNulSTSSrm7gKno3E1sBLAhz5TKi-SFBl9oFNfs-k",
			"Content-Type": "application/json",
		},
		redirect: "follow",
		referrerPolicy: "no-referrer",
		body: JSON.stringify(requestPayload),
	});

	const responseData = await response.json();
	console.log(requestPayload.query);
	console.log(requestPayload.variables);
	console.log(responseData);

	return responseData.data;
};