import { ChakraProvider } from '@chakra-ui/react';
import { DeepProvider } from '@deep-foundation/deeplinks/imports/client';
import { TokenProvider, useTokenController } from '@deep-foundation/deeplinks/imports/react-token';
import { ApolloClientTokenizedProvider } from '@deep-foundation/react-hasura/apollo-client-tokenized-provider';
import { LocalStoreProvider } from '@deep-foundation/store/local';
import { QueryStoreProvider } from '@deep-foundation/store/query';

export function Provider({
	children,
	gqlPath,
	isSsl,
}: {
	children: JSX.Element;
	gqlPath: string;
	isSsl: boolean;
}) {
	console.log({gqlPath, isSsl})
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
							}}
						>
								<DeepProvider>{children}</DeepProvider>
						</ApolloClientTokenizedProvider>
					</TokenProvider>
				</LocalStoreProvider>
			</QueryStoreProvider>
		</ChakraProvider>
		// </Analitics>
	);
};