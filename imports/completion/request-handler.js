async ({data: {newLink:openAiRequestLink,triggeredByLinkId},deep,require}) => {
  const {Configuration, OpenAIApi} = require("openai")
  const apiKeyTypeLinkId = await deep.id('@flakeed/openai', "ApiKey")
  const usesApiKeyTypeLinkId = await deep.id('@flakeed/openai', "UsesApiKey")

  const {data: [linkWithStringValue]} = await deep.select({
      id: openAiRequestLink.to_id
  })
  if(!linkWithStringValue.value?.value){
      throw new Error(`##${linkWithStringValue.id} must have a value`)
  }
  const openAiPrompt = linkWithStringValue.value.value

  const { data: [apiKeyLink] } = await deep.select({
      type_id: apiKeyTypeLinkId,
      in: {
        type_id: usesApiKeyTypeLinkId,
        from_id: triggeredByLinkId
      }
    });

  if(!apiKeyLink){
      throw new Error(`A link with type ##${apiKeyTypeLinkId} is not found`)
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