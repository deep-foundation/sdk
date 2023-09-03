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
import { NavBar } from '../components/navbar';
import { Page } from '../components/page';

interface ContentParam {
  deep: DeepClient;
}

function Content({ deep }: ContentParam) {
  useEffect(() => {
    new Promise(async () => {
      if (deep.linkId !== 0) {
        return;
      }
      await deep.guest();
    });
  }, [deep]);

  const generalInfoCard = (
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
  );

  return (
    <Stack alignItems={'center'}>
      <NavBar />
      <Heading as={'h1'}>Sdk</Heading>
      {generalInfoCard}
      <>
        
      </>
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

