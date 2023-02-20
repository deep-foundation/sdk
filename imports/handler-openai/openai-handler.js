import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import * as fs from "fs";

async function insertOpenAiHandler(deep){
    export const PACKAGE_NAME = `@deep-foundation/deep-openai`
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

    const value = fs.readFileSync('packages/nextjs/imports/handler-openai/value-handler.js', {encoding: 'utf-8'});
    const code =
        async () => {
            const {Configuration, OpenAIApi} = require("openai");

            const configuration = new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);

            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: value,
                temperature: 0.9,
                max_tokens: 150,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0.6,
                stop: [" Human:", " AI:"],
            });
            return response;
        };

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