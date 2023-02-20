import { DeepClient} from "@deep-foundation/deeplinks/imports/client";

async ({data: {newLink:openAiRequestLink},deep}) => {
    const {data: [{value: {value}}]} = await deep.select({
        id: openAiRequestLink.to_id
    })
}
