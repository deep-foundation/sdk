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
import { PACKAGE_NAME } from '../imports/openai/package-name';
import { Provider } from '../imports/provider';

function Content() {
  const deep = useDeep();
  const [openAiLinkId, setOpenAiLinkId] = useLocalStore(
    'openAiLinkId',
    undefined
  );

  return (
    <Stack>
      <Text suppressHydrationWarning>OpenAi link id: {openAiLinkId ?? " "}</Text>
      <Button
        onClick={async () => {
          await deep.insert({
            type_id: await deep.id(PACKAGE_NAME, "OpenAiApiKey"),
            string: { data: { value: process.env.OPENAI_API_KEY } },
            in: {
                data: {
                    type_id: await deep.id('@deep-foundation/core', "Contain"),
                    from_id: deep.linkId,
                },
            }
        });
        }}
      >
        add openAiApiKeyLinkId link
      </Button>
      <Button
        onClick={async () => {
          await deep.insert({
            type_id: await deep.id('@deep-foundation/core', "SyncTextFile"),
            string: { data: { value: "user input" } },
            in: {
              data: {
                type_id: await deep.id('@deep-foundation/core', "Contain"),
                from_id: deep.linkId,
              },
            },
          });
        }}
      >
        add userInputLinkId link
      </Button>
      <Button
        onClick={async () => {
          let makeActive = true;
          if (makeActive) {
            await deep.delete({
              up: {
                tree_id: { _eq: await deep.id("@deep-foundation/core", "containTree") },
                parent: {
                  type_id: { _id: ["@deep-foundation/core", "Contain"] },
                  to: { type_id: await deep.id(PACKAGE_NAME, "UsesOpenAiApiKey"), },
                  from_id: deep.linkId
                }
              }
            })
          }
          
          await deep.insert({
            type_id:  await deep.id(PACKAGE_NAME, "OpenAiApiKey"),
            string: { data: { value: process.env.OPENAI_API_KEY }},
            in: {
              data: [
                {
                  type_id: await deep.id('@deep-foundation/core', "Contain"),
                  from_id: deep.linkId,
                },
                makeActive && {
                  type_id:  await deep.id(PACKAGE_NAME, "UsesOpenAiApiKey"),
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
        add OpenAiApiKey and UsesOpenAiApiKey links
      </Button>
    </Stack>
  );
}

export default function OpenaiPage() {
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
