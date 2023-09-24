import { ChakraProvider } from "@chakra-ui/react";
import { DeepProvider } from "@deep-foundation/deeplinks/imports/client";
import { TokenProvider } from "@deep-foundation/deeplinks/imports/react-token";
import { ApolloClientTokenizedProvider } from '@deep-foundation/react-hasura/apollo-client-tokenized-provider';
import { LocalStoreProvider } from "@deep-foundation/store/local";
import { CapacitorStoreProvider } from "@deep-foundation/store/capacitor";
import { CookiesStoreProvider } from "@deep-foundation/store/cookies";
import { QueryStoreProvider } from "@deep-foundation/store/query";
import { useGqlPath } from "../hooks/use-gql-path";
import { useToken } from "../hooks/use-token";

export function WithProviders({ children }: { children: JSX.Element }) {
  const [gqlPath, setGqlPath] = useGqlPath();
  const [token,setToken]=useToken();
  
  return (
    <ChakraProvider>
      <CapacitorStoreProvider>
        <QueryStoreProvider>
          <CookiesStoreProvider>
            <LocalStoreProvider>
              <TokenProvider>
                <ApolloClientTokenizedProvider
                  options={{
                    client: "@deep-foundation/sdk",
                    path: gqlPath,
                    ssl: true,
                    token: token,
                    ws: !!process?.browser,
                  }}
                >
                  <DeepProvider>{children}</DeepProvider>
                </ApolloClientTokenizedProvider>
              </TokenProvider>
            </LocalStoreProvider>
          </CookiesStoreProvider>
        </QueryStoreProvider>
      </CapacitorStoreProvider>
    </ChakraProvider>
  );
}