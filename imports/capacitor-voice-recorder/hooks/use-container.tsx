import React, { useEffect } from 'react';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { createContainer } from '../create-container';

 // Custom React hook for managing the container link ID.
 // - deep: The DeepClient instance.
 // Returns container link ID.
 
export const useContainer = (deep: DeepClient) => {
  const [containerLinkId, setContainerLinkId] = useLocalStore<number | undefined>(
    'containerLinkId',
    undefined
  ); // custom LocalStore state to store the container link id.

  useEffect(() => {
    if (!containerLinkId) {
      const initializeContainerLink = async () => {
        setContainerLinkId(await createContainer(deep)); // Create the container link if it doesn't exist.
      };
      initializeContainerLink();
    }
  }, [deep]);

  return containerLinkId as number; // Return the container link ID.
};