import React from 'react';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { Page } from '../components/page';
import { VoiceRecorder } from '@deep-foundation/capacitor-voice-recorder';

function Content({
  deep,
  deviceLinkId,
}: {
  deep: DeepClient;
  deviceLinkId: number;
}) {


  return (<VoiceRecorder deep={deep} />);
}

export default function VoiceRecorderPage() {
  return (
    <Page
      renderChildren={({ deep, deviceLinkId }) => {
        return <Content deep={deep} deviceLinkId={deviceLinkId} />;
      }}
    />
  );
}
