import React from 'react';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Provider } from '../imports/provider';
import { ChakraProvider } from '@chakra-ui/react';
import { VoiceRecorder } from '../imports/capacitor-voice-recorder/main';

function Recorder() {
  const deep = useDeep();

  return <VoiceRecorder deep={deep} />
}

export default function CapacitorCamera() {
  return (
    <ChakraProvider>
      <Provider>
        <DeepProvider>
          <Recorder />
        </DeepProvider>
      </Provider>
    </ChakraProvider>
  );
}