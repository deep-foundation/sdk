async ({data: {newLink:openAiRequestLink,triggeredByLinkId},deep,require}) => {
    const {Configuration, OpenAIApi} = require("openai")
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain")
    const openAiApiKeyTypeLinkId = await deep.id(`@deep-foundation/openai`, "OpenAiApiKey")

    const {data: [linkWithStringValue]} = await deep.select({
        id: openAiRequestLink.to_id
    })
    if(!linkWithStringValue.value?.value){
        throw new Error(`##${linkWithStringValue.id} must have a value`)
    }
    const openAiPrompt = linkWithStringValue.value.value
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
    const apiKey = apiKeyLink.value.value
    const configuration = new Configuration({
        apiKey: apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: openAiPrompt,
        temperature: 0.9,
        max_tokens: 1500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: [" Human:", " AI:"],
    });
    return response.data;
}
