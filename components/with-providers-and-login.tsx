import { ChakraProvider } from "@chakra-ui/react";
import { DeepContext, DeepProvider } from "@deep-foundation/deeplinks/imports/client";
import { TokenProvider } from "@deep-foundation/deeplinks/imports/react-token";
import { useLocalStore } from "@deep-foundation/store/local";
import { CapacitorStoreKeys } from "../imports/capacitor-store-keys";
import { WithLogin } from "./with-login";
import { ApolloClientTokenizedProvider } from '@deep-foundation/react-hasura/apollo-client-tokenized-provider';
import { useContext } from "react";
import { processEnvs } from "../imports/process-envs";

export function WithProvidersAndLogin({ children }: { children: JSX.Element }) {
  const [gqlPath, setGqlPath] = useLocalStore(CapacitorStoreKeys[CapacitorStoreKeys.GraphQlPath], processEnvs.graphQlPath)
  return (
    <>
      <ChakraProvider>
        <TokenProvider>
          <ApolloClientTokenizedProvider
            options={{
              client: 'deeplinks-app',
              path: gqlPath,
              ssl: true,
              ws: !!process?.browser,
            }}
          >
            <DeepProvider>
              <WithLogin gqlPath={gqlPath} setGqlPath={(newGqlPath) => {
                setGqlPath(newGqlPath)
              }} >
                {children}
              </WithLogin>
            </DeepProvider>
          </ApolloClientTokenizedProvider>
        </TokenProvider>
      </ChakraProvider>
    </>
  );
}