import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
async function insertOpenAILinks(deep){
    export const PACKAGE_NAME=`@deep-foundation/deep-openai`
    const containTypeLinkId = await deep.id(PACKAGE_NAME, 'Contain');
    const anyTypeLinkId = await deep.id(PACKAGE_NAME, "Any");
    const userTypeLinkId=await deep.id(PACKAGE_NAME, "User")
    const typeTypeLinkId = await deep.id(PACKAGE_NAME, "Type");
    const packageTypeLinkId = await deep.id(PACKAGE_NAME, "Package");

    const { data: [{id:userInputLinkId}] } = await deep.insert({
        string: { data: { value: "user input" } }
    })

    const { data: [{id:openTypeLinkId}] } = await deep.insert({
        type_id: typeTypeLinkId,
        from_id: userTypeLinkId,
        to_id: anyTypeLinkId,
        in: {
            data: {
                type_id: containTypeLinkId,
                from_id: packageTypeLinkId,
                string: {data: { value: "openTypeLinkId"}}
                },
            }
    });
}