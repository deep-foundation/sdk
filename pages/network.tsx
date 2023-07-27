import React from 'react';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { Page } from '../components/page';
import { NetworkStatus } from '@deep-foundation/capacitor-network';

function Content({
  deep,
  deviceLinkId,
}: {
  deep: DeepClient;
  deviceLinkId: number;
}) {


  return (<NetworkStatus deep={deep} />);
}

export default function NetworkPage() {
  return (
    <Page
      renderChildren={({ deep, deviceLinkId }) => {
        return <Content deep={deep} deviceLinkId={deviceLinkId} />;
      }}
    />
  );
}
