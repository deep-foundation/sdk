import { getLinkId } from "./get-link-id.js"
import { GQL_URL, GQL_TOKEN, DEVICE_LINK_ID } from "./config.js"

const prepareInsertTabsVariables = async (tabs) => {
  const containTypeLinkId = await getLinkId("@deep-foundation/core", "Contain");
  const browserExtensionLinkId = await getLinkId(DEVICE_LINK_ID, "BrowserExtension");
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

const prepareTabsData = async (tabs) => {
  const tabTypeLinkId = await getLinkId("@deep-foundation/browser-extension", "Tab");
  const urlTypeLinkId = await getLinkId("@deep-foundation/browser-extension", "TabUrl");
  const titleTypeLinkId = await getLinkId("@deep-foundation/browser-extension", "TabTitle");
  const activeTypeLinkId = await getLinkId("@deep-foundation/browser-extension", "Active");

  return tabs.map((tab) => {
    return {
      type_id: tabTypeLinkId,
      number: { data: { value: tab.id } },
      out: {
        data: [
          {
            type_id: urlTypeLinkId,
            string: { data: { value: tab.url } },
          },
          {
            type_id: titleTypeLinkId,
            string: { data: { value: tab.title } },
          },
          {
            type_id: activeTypeLinkId,
            string: { data: { value: tab.active ? "true" : "false" } },
          },
        ],
      },
    };
  });
};

const insertTabs = async (tabs) => {
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
  console.log(requestPayload.query);
  console.log(requestPayload.variables);
  console.log(responseData);

  return responseData.data;
};

export const executeInsertTabs = async (tabs) => {
  const tabsData = await prepareTabsData(tabs);
  const existingTabs = await checkExistingTabs(tabs);

  const newTabs = tabsData.filter(
    (tab) => !existingTabs.some((existingTab) => existingTab.number.value === tab.number.data.value)
  );

  if (newTabs.length) {
    await insertTabs(newTabs);
  } else {
    console.log("No new tabs to insert.");
  }
};

const checkExistingTabs = async (tabs) => {
  const tabIds = tabs.map((tab) => tab.id);
  console.log({tabIds});
  const tabTypeLinkId = await getLinkId("@deep-foundation/browser-extension", "Tab");

  const requestPayload = {
    query: `
      query getTabsByIds($tabIds: [Int!]) {
        links(where: {type_id: {_eq: ${tabTypeLinkId}}, number: {value: {_in: $tabIds}}}) {
          number {
            value
          }
        }
      }
    `,
    variables: {
      tabIds: tabIds,
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
  return responseData.data.links;
};