import { ChakraProvider } from "@chakra-ui/react";
import { DeepProvider } from "@deep-foundation/deeplinks/imports/client";
import { TokenProvider } from "@deep-foundation/deeplinks/imports/react-token";
import { ApolloClientTokenizedProvider } from "@deep-foundation/react-hasura/apollo-client-tokenized-provider";
import { LocalStoreProvider } from "@deep-foundation/store/local";
import { CapacitorStoreProvider } from "@deep-foundation/store/capacitor";
import { CookiesStoreProvider } from "@deep-foundation/store/cookies";
import { QueryStoreProvider } from "@deep-foundation/store/query";
import { useGraphQlUrl } from "../hooks/use-gql-path";
import { useDeepToken } from "../hooks/use-token";
import { WithLogin } from "./with-login";
import { StoreProvider } from "./store-provider";
import { WithGraphQlUrl } from "./with-graphql-url";
import { WithDeepToken } from "./with-deep-token";
import { WithAddDebugFieldsToWindow } from "./with-add-debug-fields-to-window";

export function WithProviders({ children }: { children: JSX.Element }) {
  return (
    <ChakraProvider>
      <StoreProvider>
        <TokenProvider>
          <WithGraphQlUrl
            renderChildren={({ graphQlUrl }) => (
              <WithDeepToken
                renderChildren={({ deepToken }) => {
                  console.log({ graphQlUrl, deepToken });
                  return (
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
                        token: deepToken,
                        ws: !!process?.browser,
                      }}
                    >
                      <DeepProvider>
                        <WithAddDebugFieldsToWindow>
                          <WithLogin>{children}</WithLogin>
                        </WithAddDebugFieldsToWindow>
                      </DeepProvider>
                    </ApolloClientTokenizedProvider>
                  );
                }}
              />
            )}
          />
        </TokenProvider>
      </StoreProvider>
    </ChakraProvider>
  );
}
