import React, { useEffect } from 'react';
import {
  Text,
  Link,
  Stack,
  Card,
  CardBody,
  Heading,
  CardHeader,
} from '@chakra-ui/react';
import {
  DeepClient,
} from '@deep-foundation/deeplinks/imports/client';
import { NavBar } from '../imports/react/components/navbar';
import { Page } from '../imports/react/components/page';

interface ContentParam {
  deep: DeepClient;
}

function Content({ deep }: ContentParam) {
  return (
    <Stack alignItems={'center'}>
      <NavBar />
      <Heading as={'h1'}>Sdk</Heading>
      <Card>
      <CardHeader>
        <Heading as={'h2'}>General Info</Heading>
      </CardHeader>
      <CardBody>
        <Text suppressHydrationWarning>
          Authentication Link Id: {deep.linkId ?? ' '}
        </Text>
      </CardBody>
    </Card>
    </Stack>
  );
}

export default function IndexPage() {
  return (
    <Page
      renderChildren={({ deep }) => (
        <Content deep={deep} />
      )}
    />
  );
}

