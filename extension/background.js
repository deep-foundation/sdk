// import { DeepClient } from './node_modules/@deep-foundation/deeplinks/imports/client';

// const apolloClient = generateApolloClient({
//     path: process.env.NEXT_PUBLIC_GQL_PATH || '', // <<= HERE PATH TO UPDATE
//     ssl: !!~process.env.NEXT_PUBLIC_GQL_PATH.indexOf('localhost')
//         ? false
//         : true,
//     // admin token in prealpha deep secret key
//     // token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsibGluayJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJsaW5rIiwieC1oYXN1cmEtdXNlci1pZCI6IjI2MiJ9LCJpYXQiOjE2NTYxMzYyMTl9.dmyWwtQu9GLdS7ClSLxcXgQiKxmaG-JPDjQVxRXOpxs',
// });

// const unloginedDeep = new DeepClient({ apolloClient });
// const guest = await unloginedDeep.guest();
// const guestDeep = new DeepClient({ deep: unloginedDeep, ...guest });
// const admin = await guestDeep.login({
//     linkId: await guestDeep.id('deep', 'admin'),
// });
// const deep = new DeepClient({ deep: guestDeep, ...admin });


// chrome.runtime.onInstalled.addListener(() => {
//     chrome.contextMenus.create({
//         "id": "sampleContextMenu",
//         "title": "Sample Context Menu",
//         "contexts": ["selection"]
//     });
// });

// chrome.tabs.onActivated.addListener(async (activeTab) => {

// })

// query GetPackagesByNames {
//     packages: links(where: {type_id: {_eq: 2}, string: { value: {_in: ["@deep-foundation/core"]}}}) {
//       id
//       name: value
//       versions: in(where: {type_id: {_eq: 46}, string: {value: {_is_null: false}}}) {
//         id
//         version: value
//       }
//     }
//   }

// const deepquery = {
//     "query": `mutation {
//         insert_links(objects: { type_id: 1 }) {
//           returning {
//             id
//           }
//         }
//       }
//       `,
// }

const pathToWhere = (start, ...path) => {
  const pckg = typeof (start) === 'string' ? { type_id: { _eq: 2 }, string: { value: { _eq: start } } } : { id: { _eq: start } };
  let where = pckg;
  for (let p = 0; p < path.length; p++) {
    const item = path[p];
    if (typeof (item) !== 'boolean') {
      const nextWhere = { in: { type_id: { _eq: 3 }, string: { value: { _eq: item } }, from: where } };
      where = nextWhere;
    }
  }
  return where;
}

const getDeepId = async (start, ...path) => {
  const containWhere = pathToWhere(start, ...path);

  const deepquery2 = {
    "query": `query deepid($where:links_bool_exp!){links(where:$where){id}}`,
    variables: { where: containWhere }
  }

  const response = await fetch("http://127.0.0.1:3006/gql", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW4iXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4iLCJ4LWhhc3VyYS11c2VyLWlkIjoiMzc2In0sImlhdCI6MTY3OTkzNTMyOH0.LmDNulSTSSrm7gKno3E1sBLAhz5TKi-SFBl9oFNfs-k"
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(deepquery2), // body data type must match "Content-Type" header
  });
  const result = await response.json()

  console.log(start, ...path)
  console.log(deepquery2.query);
  console.log(result);
  return result.data.links[0].id
}

// Define the InsertTabs mutation in GraphQL syntax
const insertTabsMutation = `
mutation InsertLinks($links: [links_insert_input!]!) {
  insert_links(objects: $links) {
    returning {
      id
    }
  }
}
`;

// Prepare the variables object using the tabs array
const prepareInsertTabsVariables = async (tabs) => {
  const containTypeLinkId = await getDeepId("@deep-foundation/core", "Contain");
  const browserExtensionLinkId = await getDeepId(2457, "BrowserExtension");
  const tabTypeLinkId = await getDeepId("@deep-foundation/browser-extension", "Tab");
  const urlTypeLinkId = await getDeepId("@deep-foundation/browser-extension", "TabUrl");
  const titleTypeLinkId = await getDeepId("@deep-foundation/browser-extension", "TabTitle");
  const activeTypeLinkId = await getDeepId("@deep-foundation/browser-extension", "Active");
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

// Function to execute the InsertTabs mutation
const executeInsertTabs = async (tabs) => {
  const variables = await prepareInsertTabsVariables(tabs);

  const requestPayload = {
    query: insertTabsMutation,
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

chrome.runtime.onInstalled.addListener((reason) => {
  console.log("Extension installed or updated:", reason);

  chrome.tabs.query({}, async (tabs) => {
    await executeInsertTabs(tabs);
  });

  chrome.tabs.onActivated.addListener((activeInfo) => {
    // Add code to execute when a tab is activated
    console.log("Tab activated:", activeInfo.tabId);
  });

  chrome.tabs.onCreated.addListener((tab) => {
    // Add code to execute when a new tab is created
    console.log("Tab created:", tab.id);
  });

  chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    // Add code to execute when a tab is deleted
    console.log("Tab removed:", tabId);
  });
})

