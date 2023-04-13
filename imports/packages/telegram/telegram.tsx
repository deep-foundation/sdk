import { DeepClient } from '@deep-foundation/deeplinks/imports/client'
import { insertHandler } from '../../handlers'

export const createTelegramPackage = async ({ deep }: { deep: DeepClient }) => {

    const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type");
    const packageTypeLinkId = await deep.id("@deep-foundation/core", "Package");
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const handleInsertTypeId = await deep.id('@deep-foundation/core', 'HandleInsert');
    const fileTypeLinkId = await deep.id('@deep-foundation/core', 'SyncTextFile');
    const portTypeLinkId = await deep.id("@deep-foundation/core", "Port");
    const supportsId = await deep.id("@deep-foundation/core", "dockerSupportsJs");
    const routerListeningTypeLinkId = await deep.id("@deep-foundation/core", "RouterListening");
    const routerTypeLinkId = await deep.id("@deep-foundation/core", "Router");
    const routeTypeLinkId = await deep.id("@deep-foundation/core", "Route");
    const routerStringUseTypeLinkId = await deep.id("@deep-foundation/core", "RouterStringUse");
    const handleRouteTypeLinkId = await deep.id("@deep-foundation/core", "HandleRoute");
    const handlerTypeLinkId = await deep.id("@deep-foundation/core", "Handler");

    const { data: [{ id: telegramPackageLinkId }] } = await deep.insert({
        type_id: packageTypeLinkId,
        string: { data: { value: "@deep-foundation/telegram" } },
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: deep.linkId,
            },
        },
    });

    const { data: [{ id: tokenBotLinkId }] } = await deep.insert({
        type_id: typeTypeLinkId,
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: telegramPackageLinkId,
                string: { data: { value: "tokenBot" } },
            },
        },
    });

    const { data: [{ id: chatIdLinkId }] } = await deep.insert({
        type_id: typeTypeLinkId,
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: telegramPackageLinkId,
                string: { data: { value: "chatId" } },
            },
        },
    });

    const { data: [{ id: messageLinkId }] } = await deep.insert({
        type_id: typeTypeLinkId,
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: telegramPackageLinkId,
                string: { data: { value: "message" } },
            },
        },
    });

    const { data: [{ id: sendMessageLinkId }] } = await deep.insert({
        type_id: typeTypeLinkId,
        from_id: messageLinkId,
        to_id: chatIdLinkId,
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: telegramPackageLinkId,
                string: { data: { value: "sendMessage" } },
            },
        },
    });

    const { data: [{ id: hostLinkId }] } = await deep.insert({
        type_id: typeTypeLinkId,
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: telegramPackageLinkId,
                string: { data: { value: "host" } },
            },
        },
    });

    const { data: [{ id: setWebhookLinkId }] } = await deep.insert({
        type_id: typeTypeLinkId,
        from_id: tokenBotLinkId,
        to_id: hostLinkId,
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: telegramPackageLinkId,
                string: { data: { value: "setWebhook" } },
            },
        },
    });

    const handlerSendMessage = await insertHandler(
        deep,
        handleInsertTypeId,
        sendMessageLinkId,
        /* javascript */`
            async ({deep, require, data: {newLink: {id: sendMessageLinkId}}}) => {
                const {data: [{from_id: messageLinkId, to_id: chatIdLinkId}]} = await deep.select({
                    id: sendMessageLinkId,
                })
                const {data: [{value:{value: messageValue}}]} = await deep.select({
                    id: messageLinkId,
                })
                const {data: [{value:{value: chatIdValue}}]} = await deep.select({
                    id: chatIdLinkId,
                })

                const {data: [{value:{value: tokenValue}}]} = await deep.select({
                    type_id: await deep.id("@deep-foundation/telegram", "tokenBot")
                })

                const axios = require('axios');
                await axios.post("https://api.telegram.org/bot"+tokenValue+"/sendMessage",{
                    chat_id: chatIdValue,
                    text: messageValue
                });

                return { result: 1}
            }
    `)

    const handlerSetWebhook = await insertHandler(
        deep,
        handleInsertTypeId,
        setWebhookLinkId,
        /* javascript */`
            async ({deep, require, data: {newLink: {id: setWebhookLinkId}}}) => {
                const {data: [{from_id: tokenBotLinkId, to_id: hostLinkId}]} = await deep.select({
                    id: setWebhookLinkId,
                })
                const {data: [{value:{value: hostValue}}]} = await deep.select({
                    id: hostLinkId,
                })

                const {data: [{value:{value: tokenValue}}]} = await deep.select({
                    type_id: await deep.id("@deep-foundation/telegram", "tokenBot")
                })

                const axios = require('axios');
                await axios.post("https://api.telegram.org/bot"+tokenValue+"/setWebhook",{
                    url: hostValue,
                });

                return { result: 1}
            }
    `)


    const codeIndexRoute = /* javascript */`
async (
    req,
    res,
    next,
    { deep, require, gql }
) => {
    res.send('ok');
}
`

    const router = await deep.insert(
        {
            type_id: portTypeLinkId,
            number: {
                data: { value: 3050 },
            },
            in: {
                data: {
                    type_id: routerListeningTypeLinkId,
                    from: {
                        data: {
                            type_id: routerTypeLinkId,
                            in: {
                                data: {
                                    type_id: routerStringUseTypeLinkId,
                                    string: {
                                        data: {
                                            value:
                                                '/messages',
                                        },
                                    },
                                    from: {
                                        data: {
                                            type_id: routeTypeLinkId,
                                            out: {
                                                data: {
                                                    type_id: handleRouteTypeLinkId,
                                                    to: {
                                                        data: {
                                                            type_id: handlerTypeLinkId,
                                                            from_id: supportsId,
                                                            in: {
                                                                data: {
                                                                    type_id: containTypeLinkId,
                                                                    from_id: deep.linkId,
                                                                    string: {
                                                                        data: {
                                                                            value: "messagesHandler",
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                            to: {
                                                                data: {
                                                                    type_id: fileTypeLinkId,
                                                                    string: {
                                                                        data: {
                                                                            value: codeIndexRoute,
                                                                        },
                                                                    },
                                                                    in: {
                                                                        data: {
                                                                            type_id: containTypeLinkId,
                                                                            from_id: deep.linkId,
                                                                            string: {
                                                                                data: {
                                                                                    value: "codeFile",
                                                                                },
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        {
            name: 'INSERT_HANDLE_ROUTE_HIERARCHICAL',
        }
    )
}

export const createTestMessage = async (deep: DeepClient, message: string = 'test') => {
    await deep.insert({
        type_id: await deep.id("@deep-foundation/telegram", 'message'),
        string: { data: { value: message } },
        in: {
            data: {
                type_id: 3,
                from_id: deep.linkId,
            }
        }
    })
}

export const createTestChatId = async (deep: DeepClient, chat_id: number) => {
    await deep.insert({
        type_id: await deep.id("@deep-foundation/telegram", 'chatId'),
        number: { data: { value: chat_id } },
        in: {
            data: {
                type_id: 3,
                from_id: deep.linkId,
            }
        }
    })
}

export const createTestToken = async (deep: DeepClient, token: string) => {
    await deep.insert({
        type_id: await deep.id("@deep-foundation/telegram", 'tokenBot'),
        string: { data: { value: token } },
        in: {
            data: {
                type_id: 3,
                from_id: deep.linkId,
            }
        }
    })
}

export const createTestHost = async (deep: DeepClient, host: string) => {
    await deep.insert({
        type_id: await deep.id("@deep-foundation/telegram", 'host'),
        string: { data: { value: host } },
        in: {
            data: {
                type_id: 3,
                from_id: deep.linkId,
            }
        }
    })
}