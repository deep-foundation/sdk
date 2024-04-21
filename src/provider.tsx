import { ChakraProvider } from '@chakra-ui/react';
import { DeepProvider } from '@deep-foundation/deeplinks/imports/client';
import { TokenProvider, useTokenController } from '@deep-foundation/deeplinks/imports/react-token';
import { ApolloClientTokenizedProvider } from '@deep-foundation/react-hasura/apollo-client-tokenized-provider';
import { CapacitorStoreProvider } from '@deep-foundation/store/capacitor';
import { CookiesStoreProvider } from '@deep-foundation/store/cookies';
import { LocalStoreProvider, useLocalStore } from '@deep-foundation/store/local';
import { QueryStoreProvider } from '@deep-foundation/store/query';
import { CustomI18nProvider } from './i18n';

export function useDeepPath(defaultValue: string | undefined = process?.env?.NEXT_PUBLIC_GRAPHQL_URL) {
  return useLocalStore('dc-dg-path', defaultValue);
}
export function useDeepToken(defaultValue: string | undefined = process?.env?.NEXT_PUBLIC_DEEP_TOKEN) {
  return useTokenController(defaultValue);
}

export function ProviderCore({
  children,
}: {
  children: JSX.Element;
}) {
  const [connection, setConnection] = useDeepPath();
  return (
    <>
      {!!connection ? (
        <ApolloClientTokenizedProvider
          options={{
            client: "@deep-foundation/sdk",
            ...(connection && {
              path:
                new URL(connection).host +
                new URL(connection).pathname +
                new URL(connection).search +
                new URL(connection).hash,
              ssl: new URL(connection).protocol === "https:",
            }),
            ws: !!process?.browser,
          }}
        >
          <DeepProvider>
            {children}
          </DeepProvider>
        </ApolloClientTokenizedProvider>
      ) : <>{children}</>}
    </>
  );
}

export function Provider({
  children,
}: {
  children: JSX.Element;
}) {
  return (
    <ChakraProvider>
      <CapacitorStoreProvider>
        <QueryStoreProvider>
          <CookiesStoreProvider>
            <LocalStoreProvider>
              <TokenProvider>
                <ProviderCore>
                  <CustomI18nProvider>
                    {children}
                  </CustomI18nProvider>
                </ProviderCore>
              </TokenProvider>
            </LocalStoreProvider>
          </CookiesStoreProvider>
        </QueryStoreProvider>
      </CapacitorStoreProvider>
    </ChakraProvider>
  );
};