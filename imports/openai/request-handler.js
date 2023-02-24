async ({data: {newLink:openAiRequestLink,triggeredByLinkId},deep,require}) => {
    const {Configuration, OpenAIApi} = require("openai")
    const CircularJSON = require('circular-json');
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain")
    const openAiApiKeyTypeLinkId = await deep.id(`@deep-foundation/openai`, "OpenAiApiKey")
   //add this for fix 
    // await deep.insert({
    //     type_id: await deep.id(`@deep-foundation/core`, "Value"),
    //     from_id: await deep.id(`@deep-foundation/openai`, "OpenAiApiKey"),
    //     to_id: await deep.id(`@deep-foundation/core`, "String"),
    //     in: {
    //         data: {
    //             type_id: await deep.id(`@deep-foundation/core`, "Contain"),
    //             from_id: await deep.id(`@deep-foundation/core`, "Package"),
    //         },
    //     }
    // });
    const {data: [{value: {value}}]} = await deep.select({
        id: openAiRequestLink.to_id
    })
    const {data: [apiKeyLink]} = await deep.select({
        type_id: openAiApiKeyTypeLinkId,
        in: {
            type_id: containTypeLinkId,
            from_id: triggeredByLinkId
        }
    })
    if(!apiKeyLink){
        throw new Error(`A link with type ##${openAiApiKeyTypeLinkId} is not found`)
    }
    if(!apiKeyLink.value?.value){
        throw new Error(`##${apiKeyLink.id} must have a value`)
    }
    if(!value){
        throw new Error(`A link with type ##${value} is not found`)
    }
    if(!value.value?.value){
        throw new Error(`##${value.id} must have a value`)
    }
    const apiKey = apiKeyLink.value.value
    const configuration = new Configuration({
        apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const response = CircularJSON.stringify(await openai.createCompletion({
        model: "text-davinci-003",
        prompt: value,
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: [" Human:", " AI:"],
    }));
   
    return response;
}
