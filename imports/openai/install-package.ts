import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import fs from 'fs';
import {
    DeepProvider,
    useDeep,
    useDeepSubscription,
  } from '@deep-foundation/deeplinks/imports/client';
import {PACKAGE_NAME} from "./package-name";
require('dotenv').config();
export async function installPackage () {
    const deep = useDeep();

    const anyTypeLinkId = await deep.id('@deep-foundation/core', "Any");
    const userTypeLinkId = await deep.id('@deep-foundation/core', "User");
    const typeTypeLinkId = await deep.id('@deep-foundation/core', "Type");
    const syncTextFileTypeLinkId = await deep.id('@deep-foundation/core', "SyncTextFile");
    const containTypeLinkId = await deep.id('@deep-foundation/core', "Contain");
    const dockerSupportsJsLinkId = await deep.id('@deep-foundation/core', "dockerSupportsJs");
    const handlerTypeLinkId = await deep.id('@deep-foundation/core', "Handler");
    const handleInsertLinkId = await deep.id('@deep-foundation/core', "HandleInsert");
    const packageTypeLinkId = await deep.id('@deep-foundation/core', "Package");
    const joinTypeLinkId = await deep.id('@deep-foundation/core', "Join");

    const { data: [{ id: packageLinkId }] } = await deep.insert({
        type_id: packageTypeLinkId,
        string: { data: { value: PACKAGE_NAME } },
        in: { data: [
        {
            type_id: containTypeLinkId,
            from_id: deep.linkId
        },
        ] },
        out: { data: [
        {
            type_id: joinTypeLinkId,
            to_id: await deep.id('deep', 'users', 'packages'),
        },
        {
            type_id: joinTypeLinkId,
            to_id: await deep.id('deep', 'admin'),
        },
        ] },
    });
  
    const { data: [{ id: userInputLinkId }] } = await deep.insert({
      type_id: syncTextFileTypeLinkId,
      string: { data: { value: "user input" } },
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: deep.linkId,
        },
      },
    });

    const { data: [{id:openAiRequestTypeLinkId}] } = await deep.insert({
        type_id: typeTypeLinkId,
        from_id: userTypeLinkId,
        to_id: anyTypeLinkId,
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: {data: { value: "OpenAiRequest"}}
            },
        }
    });

    const { data: [{ id: openAiApiKeyTypeLinkId, }] } = await deep.insert({
        type_id: typeTypeLinkId,
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: packageLinkId,
                string: {data: { value: "OpenAiApiKey"}}
            },
        }
    });

    const { data: [{ id: openAiApiKeyLinkId }] } = await deep.insert({
        type_id: openAiApiKeyTypeLinkId,
        string: { data: { value: process.env.OPENAI_API_KEY } },
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: deep.linkId,
            },
        }
    });

    await deep.insert({
        type_id: syncTextFileTypeLinkId,
        in: {
            data: [
                {
                    type_id: containTypeLinkId,
                    from_id: packageLinkId, // before created package
                    string: {data: {value: "OpenAiRequestHandlerCode"}},
                },
                {
                    from_id: dockerSupportsJsLinkId,
                    type_id: handlerTypeLinkId,
                    in: {
                        data: [
                            {
                                type_id: containTypeLinkId,
                                from_id: packageLinkId, // before created package
                                string: {data: {value: "OpenAiRequestHandler"}},
                            },
                            {
                                type_id: handleInsertLinkId,
                                // The type of link which operation will trigger handler. Example: insert handle will be triggered if you insert a link with this type_id
                                from_id: openAiRequestTypeLinkId,
                                in: {
                                    data: [
                                        {
                                            type_id: containTypeLinkId,
                                            from_id: packageLinkId, // before created package
                                            string: {data: {value: "HandleOpenAiRequest"}},
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
                value: fs.readFileSync('/workspace/dev/packages/sdk/imports/openai/request-handler.js', {encoding: 'utf-8'}),
            },
        },
    });
}

installPackage();