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

import { executeInsertTabs } from "./insert-tabs.js";
import { executeDeactivateTabs } from "./deactivate-tabs.js";
import { executeActivateTab } from "./activate-tab.js";
import { executeDeleteTab } from "./delete-tab.js";
import { executeUploadHistory } from "./upload-history.js";

// chrome.runtime.onInstalled.addListener((reason) => {
//   console.log("Extension installed or updated:", reason);

//   chrome.tabs.query({}, async (tabs) => {
//     await executeInsertTabs(tabs);
//   });

//   chrome.history.search({ text: '', maxResults: 2 }, async (history) => {
//     await executeUploadHistory(history);
//   });

//   chrome.tabs.onActivated.addListener(async (activeInfo) => {
//     // Add code to execute when a tab is activated
//     await executeDeactivateTabs();
//     await executeActivateTab(activeInfo.tabId);
//     console.log("Tab activated:", activeInfo.tabId);
//   });

//   chrome.tabs.onCreated.addListener(async (tab) => {
//     // Add code to execute when a new tab is created
//     await executeInsertTabs([tab]);
//     console.log("Tab created:", tab.id);
//   });

//   chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
//     // Add code to execute when a tab is deleted
//     await executeDeleteTab(tabId);
//     console.log("Tab removed:", tabId);
//   });
// })

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "uploadHistory") {
    // Code to execute when UPLOAD HISTORY button is clicked
    chrome.history.search({ text: "", maxResults: 2 }, async (history) => {
      await executeUploadHistory(history);
    });
  } else if (message.action === "uploadTabs") {
    // Code to execute when SUBSCRIBE TABS button is clicked
    chrome.tabs.query({}, async (tabs) => {
      await executeInsertTabs(tabs);
    });
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
      // Add code to execute when a tab is activated
      await executeDeactivateTabs();
      await executeActivateTab(activeInfo.tabId);
      console.log("Tab activated:", activeInfo.tabId);
    });
  
    chrome.tabs.onCreated.addListener(async (tab) => {
      // Add code to execute when a new tab is created
      await executeInsertTabs([tab]);
      console.log("Tab created:", tab.id);
    });
  
    chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
      // Add code to execute when a tab is deleted
      await executeDeleteTab(tabId);
      console.log("Tab removed:", tabId);
    });
  }
});