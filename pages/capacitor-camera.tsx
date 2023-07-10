import React, { useState, useEffect } from 'react';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { ChakraProvider} from '@chakra-ui/react';
import { Camera } from "../imports/capacitor-camera/main";

function Page() {
  return <Camera deep={useDeep()} />
}

export default function CapacitorCamera() {
  return (
    <ChakraProvider>
      <Provider>
        <DeepProvider>
          <Page />
        </DeepProvider>
      </Provider>
    </ChakraProvider>
  );
}