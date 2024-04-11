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
import { NavBar } from '../src/react/components/navbar';
import { Page } from '../src/react/components/page';
import { appWithTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'footer',
      ])),
    },
  }
}