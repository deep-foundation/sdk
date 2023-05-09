require('react');
require('graphql');
require('lodash');
require('subscriptions-transport-ws');
import dotenv from 'dotenv';
import { generateApolloClient } from '@deep-foundation/hasura/client';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import puppeteer from 'puppeteer';
var myEnv = dotenv.config();
import { payInBrowser } from "./payInBrowser.cjs";
import fs from 'fs';
import { default as assert } from 'assert';
import { createSerialOperation } from '@deep-foundation/deeplinks/imports/gql/serial.js';
import path from 'path'
import { sleep } from './sleep';

main();

async function main() {
  const apolloClient = generateApolloClient({
    path: process.env.NEXT_PUBLIC_GQL_PATH || '', // <<= HERE PATH TO UPDATE
    ssl: !!~process.env.NEXT_PUBLIC_GQL_PATH.indexOf('localhost')
      ? false
      : true,
    // admin token in prealpha deep secret key
    // token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsibGluayJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJsaW5rIiwieC1oYXN1cmEtdXNlci1pZCI6IjI2MiJ9LCJpYXQiOjE2NTYxMzYyMTl9.dmyWwtQu9GLdS7ClSLxcXgQiKxmaG-JPDjQVxRXOpxs',
  });

  const unloginedDeep = new DeepClient({ apolloClient });
  const guest = await unloginedDeep.guest();
  const guestDeep = new DeepClient({ deep: unloginedDeep, ...guest });
  const admin = await guestDeep.login({
    linkId: await guestDeep.id('deep', 'admin'),
  });
  const deep = new DeepClient({ deep: guestDeep, ...admin });

  // await installPackage({deep})
  await callTests({deep})
}

async function callTests({deep}: {deep: DeepClient}){

    const route = process.env.PAYMENTS_C2B_NOTIFICATION_ROUTE;
    const port = parseInt(process.env.PAYMENTS_C2B_NOTIFICATION_PORT);
    const ownerLinkId = deep.linkId;
    
    const reservedIds = await deep.reserve(26);
    
    const routeLinkId = reservedIds.pop();
    const routerStringUseLinkId = reservedIds.pop();
    const routerLinkId = reservedIds.pop();
    const portLinkId = reservedIds.pop();

    const notificationHandlerLinkId = await deep.id("@deep-foundation/payments-tinkoff-c2b", "TinkoffNotificationHandler")
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const routeTypeLinkId = await deep.id("@deep-foundation/core", "Route");
    const routerTypeLinkId = await deep.id("@deep-foundation/core", "Router");
    const portTypeLinkId = await deep.id("@deep-foundation/core", "Port");
    const routerStringUseTypeLinkId = await deep.id("@deep-foundation/core", "RouterStringUse");
    const routerListeningTypeLinkId = await deep.id("@deep-foundation/core", "RouterListening");
    const syncTextFileTypeLinkId = await deep.id("@deep-foundation/core", "SyncTextFile");

    const storageBusinessTypeLinkId = await deep.id("@deep-foundation/payments-tinkoff-c2b", "StorageBusiness");
    const terminalPasswordTypeLinkId = await deep.id("@deep-foundation/payments-tinkoff-c2b", "TerminalPassword");
    const usesTerminalPasswordTypeLinkId = await deep.id("@deep-foundation/payments-tinkoff-c2b", "UsesTerminalPassword");
    const terminalKeyTypeLinkId = await deep.id("@deep-foundation/payments-tinkoff-c2b", "TerminalKey");
    const usesTerminalKeyTypeLinkId = await deep.id("@deep-foundation/payments-tinkoff-c2b", "UsesTerminalKey");
    const notificationUrlTypeLinkId = await deep.id("@deep-foundation/payments-tinkoff-c2b", "NotificationUrl");
    const usesNotificationUrlTypeLinkId = await deep.id("@deep-foundation/payments-tinkoff-c2b", "UsesNotificationUrl");
    
    const paymentTypeLinkId = await deep.id("@deep-foundation/payments-tinkoff-c2b", "Payment");
    const sumTypeLinkId = await deep.id("@deep-foundation/payments-tinkoff-c2b", "Sum");
    const paymentObjectTypeLinkId = await deep.id("@deep-foundation/payments-tinkoff-c2b", "Object");
    const payTypeLinkId = await deep.id("@deep-foundation/payments-tinkoff-c2b", "Pay");
    const payedTypeLinkId = await deep.id("@deep-foundation/payments-tinkoff-c2b", "Payed");
    const urlTypeLinkId = await deep.id("@deep-foundation/payments-tinkoff-c2b", "Url");

    await deep.serial({
      operations: [
        createSerialOperation({
          table: 'links',
          type: 'insert',
          objects: {
            id: routeLinkId,
            type_id: routeTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: ownerLinkId
              }
            },
          }
        }),
        createSerialOperation({
          table: 'links',
          type: 'insert',
          objects: {
            type_id: await deep.id("@deep-foundation/core", "HandleRoute"),
            from_id: routeLinkId,
            to_id: notificationHandlerLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: ownerLinkId
              }
            },
          }
        }),
        createSerialOperation({
          table: 'links',
          type: 'insert',
          objects: {
            id: routerLinkId,
            type_id: routerTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: ownerLinkId
              }
            },
          }
        }),
        createSerialOperation({
          table: 'links',
          type: 'insert',
          objects: {
            id: routerStringUseLinkId,
            type_id: routerStringUseTypeLinkId,
            from_id: routeLinkId,
            to_id: routerLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: ownerLinkId
              }
            },
          }
        }),
        createSerialOperation({
          table: 'strings',
          type: 'insert',
          objects: {
            link_id: routerStringUseLinkId,
            value: route
          }
        }),
        createSerialOperation({
          table: 'links',
          type: 'insert',
          objects: {
            id: portLinkId,
            type_id: portTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: ownerLinkId
              }
            },
          }
        }),
        createSerialOperation({
          table: 'numbers',
          type: 'insert',
          objects: {
            link_id: portLinkId,
            value: port
          }
        }),
        createSerialOperation({
          table: 'links',
          type: 'insert',
          objects: {
            type_id: routerListeningTypeLinkId,
            from_id: routerLinkId,
            to_id: portLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: ownerLinkId
              }
            },
          }
        }),
      ]
    });

    const TEST_PRICE = 5500;

    const storageBusinessLinkId = reservedIds.pop();
    const terminalKeyLinkId = reservedIds.pop();
    const terminalPasswordLinkId = reservedIds.pop();
    const notificationUrlLinkId = reservedIds.pop();
    const productLinkId = reservedIds.pop();

    await deep.serial({
      operations: [
        {
          type: 'insert',
          table: 'links',
          objects: {
            id: storageBusinessLinkId,
            type_id: storageBusinessTypeLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: deep.linkId,
              }
            }
          },
        },
        {
          type: 'insert',
          table: 'links',
          objects: {
            id: terminalPasswordLinkId,
            type_id: terminalPasswordTypeLinkId,
            in: {
              data: [
                {
                  type_id: containTypeLinkId,
                  from_id: storageBusinessLinkId,
                },
              ],
            },
          },
        },
        {
          type: 'insert',
          table: 'strings',
          objects: {
            link_id: terminalPasswordLinkId,
            value: process.env.PAYMENTS_C2B_TERMINAL_PASSWORD
          }
        },
        {
          type: 'insert',
          table: 'links',
          objects: {
            type_id: usesTerminalPasswordTypeLinkId,
            from_id: storageBusinessLinkId,
            to_id: terminalPasswordLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: storageBusinessLinkId,
              }
            }
          },
        },
        {
          type: 'insert',
          table: 'links',
          objects: {
            id: terminalKeyLinkId,
            type_id: terminalKeyTypeLinkId,
            in: {
              data: [
                {
                  type_id: containTypeLinkId,
                  from_id: storageBusinessLinkId,
                },
              ],
            },
          },
        },
        {
          type: 'insert',
          table: 'strings',
          objects: {
            link_id: terminalKeyLinkId,
            value: process.env.PAYMENTS_C2B_TERMINAL_KEY
          }
        },
        {
          type: 'insert',
          table: 'links',
          objects: {
            type_id: usesTerminalKeyTypeLinkId,
            from_id: storageBusinessLinkId,
            to_id: terminalKeyLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: storageBusinessLinkId,
              }
            }
          },
        },
        {
          type: 'insert',
          table: 'links',
          objects: {
            id: notificationUrlLinkId,
            type_id: notificationUrlTypeLinkId,
            in: {
              data: [
                {
                  type_id: containTypeLinkId,
                  from_id: storageBusinessLinkId,
                },
              ],
            },
          },
        },
        {
          type: 'insert',
          table: 'strings',
          objects: {
            link_id: notificationUrlLinkId,
            value: process.env.PAYMENTS_C2B_NOTIFICATION_URL
          }
        },
        {
          type: 'insert',
          table: 'links',
          objects: {
            type_id: usesNotificationUrlTypeLinkId,
            from_id: storageBusinessLinkId,
            to_id: notificationUrlLinkId,
            in: {
              data: {
                type_id: containTypeLinkId,
                from_id: storageBusinessLinkId,
              }
            }
          },
        },
        {
          type: 'insert',
          table: 'links',
          objects: {
            id: productLinkId,
            type_id: syncTextFileTypeLinkId,
            in: {
              data: [
                {
                  type_id: containTypeLinkId,
                  from_id: deep.linkId,
                },
              ],
            },
          }
        }
      ]
    })

    const paymentLinkId = reservedIds.pop();
    const sumLinkId = reservedIds.pop();
    const objectLinkId = reservedIds.pop();
    const payLinkId = reservedIds.pop();

    const paymentInsertData = createSerialOperation({
      type: 'insert',
      table: 'links',
      objects: {
        id: paymentLinkId,
        type_id: paymentTypeLinkId,
        from_id: deep.linkId,
        to_id: storageBusinessLinkId,
        in: {
          data: [
            {
              type_id: containTypeLinkId,
              from_id: deep.linkId,
            },
          ],
        },
      }
    });

    const sumInsertData = createSerialOperation({
      type: 'insert',
      table: 'links',
      objects: {
        id: sumLinkId,
        type_id: sumTypeLinkId,
        from_id: deep.linkId,
        to_id: paymentLinkId,
        in: {
          data: [
            {
              type_id: containTypeLinkId,
              from_id: deep.linkId,
            },
          ],
        },
      }
    });

    const sumValueInsertData = createSerialOperation({
      type: 'insert',
      table: 'numbers',
      objects: {
        link_id: sumLinkId,
        value: TEST_PRICE
      }
    });

    const objectInsertData = createSerialOperation({
      type: 'insert',
      table: 'links',
      objects: {
        id: objectLinkId,
        type_id: paymentObjectTypeLinkId,
        from_id: paymentLinkId,
        to_id: productLinkId,
        in: {
          data: [
            {
              type_id: containTypeLinkId,
              from_id: deep.linkId,
            },
          ],
        },
      }
    })

    const payInsertData = createSerialOperation({
      type: 'insert',
      table: 'links',
      objects: {
        id: payLinkId,
        type_id: payTypeLinkId,
        from_id: deep.linkId,
        to_id: sumLinkId,
        in: {
          data: [
            {
              type_id: containTypeLinkId,
              from_id: deep.linkId,
            },
          ],
        },
      }
    });

    await deep.serial({
      operations: [
        paymentInsertData,
        sumInsertData,
        sumValueInsertData,
        objectInsertData,
        payInsertData
      ]
    })

    async function tryGetLink({ selectData, delayMs, attemptsCount }) {
      let resultLink;
      for (let i = 0; i < attemptsCount; i++) {
        const { data: [link] } = await deep.select(selectData);

        if (link) {
          resultLink = link
        }

        await sleep(delayMs);
      }
      return { link: resultLink };
    }

    const { link: urlLink } = await tryGetLink({
      delayMs: 1000, attemptsCount: 10, selectData: {
        type_id: urlTypeLinkId,
        to_id: payLinkId,
      }
    });

    assert.notStrictEqual(urlLink, undefined)

    const url = urlLink.value.value;

    assert.notStrictEqual(urlLink, undefined)

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await payInBrowser({
      browser,
      page,
      url,
    });

    const { link: payedLink } = await tryGetLink({
      delayMs: 1000, attemptsCount: 10, selectData: {
        type_id: payedTypeLinkId,
        to_id: payLinkId,
      }
    });
    assert.notEqual(payedLink, undefined)
  
}


