import { DeepProvider } from '@deep-foundation/deeplinks/imports/client';
import { TokenProvider, useTokenController } from '@deep-foundation/deeplinks/imports/react-token';
import { ApolloClientTokenizedProvider } from '@deep-foundation/react-hasura/apollo-client-tokenized-provider';
import { LocalStoreProvider } from '@deep-foundation/store/local';
import { QueryStoreProvider } from '@deep-foundation/store/query';

export function ProviderConnected({
  children,
}: {
  children: JSX.Element;
}) {
  const [token, setToken] = useTokenController();
  return <>{children}</>;
}

export const GRAPHQL_PATH = process.env.NEXT_PUBLIC_GQL_PATH;
export const GRAPHQL_SSL = !!+process.env.NEXT_PUBLIC_GQL_SSL;




export function Provider({
  children,
}: {
  children: JSX.Element;
}) {
  return (
		// <Analitics
		//   yandexMetrikaAccounts={[84726091]}
		//   googleAnalyticsAccounts={['G-DC5RRWLRNV']}
		// >

		<QueryStoreProvider>
			<LocalStoreProvider>
				<TokenProvider>
					<ApolloClientTokenizedProvider
						options={{
							client: 'deeplinks-app',
							path: GRAPHQL_PATH,
							ssl: GRAPHQL_SSL,
							ws: !!process?.browser,
						}}
					>
						<ProviderConnected>
							<DeepProvider>{children}</DeepProvider>
						</ProviderConnected>
					</ApolloClientTokenizedProvider>
				</TokenProvider>
			</LocalStoreProvider>
		</QueryStoreProvider>
		// </Analitics>
	);
};