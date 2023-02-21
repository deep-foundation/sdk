async ({data: {newLink:openAiRequestLink,triggeredByLinkId},deep}) => {
    const {Configuration, OpenAIApi} = require("openai")
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain")

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
      throw new Exception(`A link with type ##${openAiApiKeyTypeLinkId} is not found`)
    }
    if(!apiKeyLink.value?.value){
      throw new Exception(`##${apiKeyLink.id} must have a value`)
    }

    const configuration = new Configuration({
        apiKey: apiKey,
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
}
