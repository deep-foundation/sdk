async ({data: {newLink:openAiRequestLink,triggeredByLinkId},deep,require}) => {
  const {Configuration, OpenAIApi} = require("openai")
  const apiKeyTypeLinkId = await deep.id('@deep-foundation/openai', "ApiKey")
  const usesApiKeyTypeLinkId = await deep.id('@deep-foundation/openai', "UsesApiKey")
    const containTypeLinkId = await deep.id('@deep-foundation/core', "Contain")

  const {data: [linkWithStringValue]} = await deep.select({
      id: openAiRequestLink.to_id
  })
  if(!linkWithStringValue.value?.value){
      throw new Error(`##${linkWithStringValue.id} must have a value`)
  }
  const openAiPrompt = linkWithStringValue.value.value

  const apiKeyLink = await getTokenLink();
  const apiKey = apiKeyLink.value.value;
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

  async function getTokenLink() {
    let resultTokenLink;
    const { data } = await deep.select({
        _or: [
            {
                type_id: apiKeyTypeLinkId,
                in: {
                    type_id: containTypeLinkId,
                    from_id: triggeredByLinkId,
                },
            },
            {
                from_id: triggeredByLinkId,
                type_id: usesApiKeyTypeLinkId,
            },
        ],
    });
    if (data.length === 0) {
        throw new Error(`Link of type ##${apiKeyTypeLinkId} is not found`);
    }
    const usesLinks = data.filter(
        (link) => link.type_id === usesApiKeyTypeLinkId
    );
    if (usesLinks.length > 1) {
        throw new Error(
            `More than 1 links of type ##${usesApiKeyTypeLinkId} are found`
        );
    }
    const usesLink = data.find(
        (link) => link.type_id === usesApiKeyTypeLinkId
    );
    if (usesLink) {
        const tokenLink = data.find((link) => link.id === usesLink.to_id);
        if (!tokenLink) {
            throw new Error(`Link of type ##${apiKeyTypeLinkId} is not found`);
        } else {
            resultTokenLink = tokenLink;
        }
    } else {
        const tokenLink = data.filter(
            (link) => link.type_id === apiKeyTypeLinkId
        );
        if (tokenLink.length > 1) {
            throw new Error(
                `For 2 or more ##${apiKeyTypeLinkId} links you must activate it with usesOpenAiApiKey link`
            );
        } else {
            const tokenLink = data.find(
                (link) => link.type_id === apiKeyTypeLinkId
            );
            if (!tokenLink) {
                throw new Error(`Link of type ##${apiKeyTypeLinkId} is not found`);
            }
            resultTokenLink = tokenLink;
        }
    }
    if (!resultTokenLink.value?.value) {
        throw new Error(`Link of type ##${apiKeyTypeLinkId} has no value`);
    }
    return resultTokenLink;
}


  return response.data;
}
