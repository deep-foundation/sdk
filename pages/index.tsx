import React, { useEffect } from 'react';
import {
  DeepClient,
} from '@deep-foundation/deeplinks/imports/client';

interface ContentParam {
  deep: DeepClient;
  deviceLinkId: number;
}

function Content() {
  return (
    <>
    </>
  );
}

export default function IndexPage() {
  return (
    <Content />
  );
}
