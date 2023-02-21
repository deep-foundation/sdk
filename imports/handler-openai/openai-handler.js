import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import * as fs from "fs";
import {PACKAGE_NAME} from "./openai-links";

async function insertOpenAiHandler(deep){
    export const PACKAGE_NAME = `@deep-foundation/deep-openai`
    const anyTypeLinkId = await deep.id(PACKAGE_NAME, "Any");
    const userTypeLinkId=await deep.id(PACKAGE_NAME, "User")
    const typeTypeLinkId = await deep.id(PACKAGE_NAME, "Type");
    const fileTypeLinkId = await deep.id(PACKAGE_NAME, "SyncTextFile")
    const containTypeLinkId = await deep.id(PACKAGE_NAME, "Contain")
    const fileWithCodeOfHandlerName = "FileWithCodeOfHandlerName";
    const supportsJsLinkId = await deep.id(PACKAGE_NAME, "dockerSupportsJs" /* | "plv8SupportsJs" */)
    const handlerTypeLinkId = await deep.id(PACKAGE_NAME, "Handler")
    const handlerName = "HandlerName";
    const handleOperationLinkId = await deep.id(PACKAGE_NAME, "HandleInsert" /* | HandleUpdate | HandleDelete */);
    const handleName = "HandleName";
    const triggerTypeLinkId=(PACKAGE_NAME, "openAiRequestLink")
    const packageLinkId = await deep.id(PACKAGE_NAME, "Package");

    const code = fs.readFileSync('packages/sdk/imports/handler-openai/value-handler.js', {encoding: 'utf-8'});

    const { data: [{id:userInputLinkId}] } = await deep.insert({
        type_id:fileTypeLinkId,
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: { data: { value: "user input" } }
            },
        }
    })

    const { data: [{id:openTypeLinkId}] } = await deep.insert({
        type_id: typeTypeLinkId,
        from_id: userTypeLinkId,
        to_id: anyTypeLinkId,
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: {data: { value: "OpenTypeLinkId"}}
            },
        }
    });

    const { data: [{ id: openAiApiKeyLinkId, }] } = await deep.insert({
        type_id: typeTypeLinkId,
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: {data: { value: "OpenAiApiKeyLinkId"}}
            },
        }
    });

    const { data: [{ id: openAiApiKeyTypeLinkId }] } = await deep.insert({
        type_id: openAiApiKeyLinkId,
        string: { data: { value: "api key" } },
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
            },
        }
    });

    await deep.insert({
        type_id: fileTypeLinkId,
        in: {
            data: [
                {
                    type_id: containTypeLinkId,
                    from_id: packageLinkId, // before created package
                    string: {data: {value: fileWithCodeOfHandlerName}},
                },
                {
                    from_id: supportsJsLinkId,
                    type_id: handlerTypeLinkId,
                    in: {
                        data: [
                            {
                                type_id: containTypeLinkId,
                                from_id: packageLinkId, // before created package
                                string: {data: {value: handlerName}},
                            },
                            {
                                type_id: handleOperationLinkId,
                                // The type of link which operation will trigger handler. Example: insert handle will be triggered if you insert a link with this type_id
                                from_id: triggerTypeLinkId,
                                in: {
                                    data: [
                                        {
                                            type_id: containTypeLinkId,
                                            from_id: packageLinkId, // before created package
                                            string: {data: {value: handleName}},
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
            ],
        },
        string: {
            data: {
                value: code,
            },
        },
    });
}