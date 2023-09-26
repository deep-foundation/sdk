import { ChakraProvider } from "@chakra-ui/react";
import { DeepProvider } from "@deep-foundation/deeplinks/imports/client";
import { TokenProvider } from "@deep-foundation/deeplinks/imports/react-token";
import { ApolloClientTokenizedProvider } from "@deep-foundation/react-hasura/apollo-client-tokenized-provider";
import { StoreProvider } from "./store-provider";
import { WithGraphQlUrl } from "./with-graphql-url";
import { WithAddDebugFieldsToWindow } from "./with-add-debug-fields-to-window";

export function WithProviders({ children }: { children: JSX.Element }) {
  return (
    <ChakraProvider>
      <StoreProvider>
        <TokenProvider>
          <WithGraphQlUrl
            renderChildren={({ graphQlUrl }) => (
              <ApolloClientTokenizedProvider
              options={{
                client: "@deep-foundation/sdk",
                ...(graphQlUrl && {
                  path:
                    new URL(graphQlUrl).host +
                    new URL(graphQlUrl).pathname +
                    new URL(graphQlUrl).search +
                    new URL(graphQlUrl).hash,
                  ssl: new URL(graphQlUrl).protocol === "https:",
                }),
                ws: !!process?.browser,
              }}
            >
              <DeepProvider>
                <WithAddDebugFieldsToWindow>
                  {children}
                </WithAddDebugFieldsToWindow>
              </DeepProvider>
            </ApolloClientTokenizedProvider>
            )}
          />
        </TokenProvider>
      </StoreProvider>
    </ChakraProvider>
  );
}
