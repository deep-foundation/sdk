import React from 'react';
import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { CapacitorCamera } from '@deep-foundation/capacitor-camera';
import { Page } from '../components/page';

function Content({
  deep,
  deviceLinkId,
}: {
  deep: DeepClient;
  deviceLinkId: number;
}) {


  return (<CapacitorCamera deep={deep} />);
}

export default function CameraPage() {
  return (
    <Page renderChildren={({ deep, deviceLinkId }) => <Content deep={deep} deviceLinkId={deviceLinkId} />} />
  );
}