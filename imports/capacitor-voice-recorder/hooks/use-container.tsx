import React, { useEffect } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { createContainer } from '../create-container';

export const useContainer = (deep: DeepClient) => {
	const [containerLinkId, setContainerLinkId] = useLocalStore<number | undefined>(
		'containerLinkId',
		undefined
	);

	useEffect(() => {
		if (!containerLinkId) {
			const initializeContainerLink = async () => {
				setContainerLinkId(await createContainer(deep));
			};
			initializeContainerLink();
		}
	}, [deep]);

	return containerLinkId as number;
};