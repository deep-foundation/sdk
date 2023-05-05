import { ChakraProvider } from '@chakra-ui/react';
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

export function Provider({
	children,
	gqlPath,
	isSsl,
	token
}: {
	children: JSX.Element;
	gqlPath: string;
	isSsl: boolean;
	token: string;
}) {
	return (
		// <Analitics
		//   yandexMetrikaAccounts={[84726091]}
		//   googleAnalyticsAccounts={['G-DC5RRWLRNV']}
		// >
		<ChakraProvider>
			<QueryStoreProvider>
				<LocalStoreProvider>
					<TokenProvider>
						<ApolloClientTokenizedProvider
							options={{
								client: 'deeplinks-app',
								path: gqlPath,
								ssl: isSsl,
								ws: !!process?.browser,
								token
							}}
						>
							<ProviderConnected>
								<DeepProvider>{children}</DeepProvider>
							</ProviderConnected>
						</ApolloClientTokenizedProvider>
					</TokenProvider>
				</LocalStoreProvider>
			</QueryStoreProvider>
		</ChakraProvider>
		// </Analitics>
	);
};