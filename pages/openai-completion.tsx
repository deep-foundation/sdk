import {
  LocalStoreProvider,
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
  useDeepSubscription,
} from '@deep-foundation/deeplinks/imports/client';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import { OPENAI_COMPLETION_PACKAGE_NAME } from '../imports/openai-completion/package-name';

function Content() {
  const deep = useDeep();

  return (
    <Stack>
      <Button
        onClick={async () => {
          const apiKey = "";
          let makeActive = true;
          if (makeActive) {
            await deep.delete({
              up: {
                tree_id: { _eq: await deep.id("@deep-foundation/core", "containTree") },
                parent: {
                  type_id: { _id: ["@deep-foundation/core", "Contain"] },
                  to: { type_id: await deep.id(OPENAI_COMPLETION_PACKAGE_NAME, "UsesApiKey"), },
                  from_id: deep.linkId
                }
              }
            })
          }
          
          await deep.insert({
            type_id:  await deep.id(OPENAI_COMPLETION_PACKAGE_NAME, "ApiKey"),
            string: { data: { value: apiKey }},
            in: {
              data: [
                {
                  type_id: await deep.id('@deep-foundation/core', "Contain"),
                  from_id: deep.linkId,
                },
                makeActive && {
                  type_id:  await deep.id(OPENAI_COMPLETION_PACKAGE_NAME, "UsesApiKey"),
                  from_id: deep.linkId,
                  in: {
                    data: [
                      {
                        type_id: await deep.id('@deep-foundation/core', "Contain"),
                        from_id: deep.linkId,
                      },
                    ],
                  },
                }
              ],
            },
          })
        }}
      >
        Add ApiKey
      </Button>
    </Stack>
  );
}

export default function OpenaiCompletionPage() {
  return (
    <ChakraProvider>
      <Provider>
        <DeepProvider>
          <Content />
        </DeepProvider>
      </Provider>
    </ChakraProvider>
  );
}
