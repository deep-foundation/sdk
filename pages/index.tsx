import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text
} from '@chakra-ui/react';
import {
  DeepClient,
} from '@deep-foundation/deeplinks/imports/client';
import { i18nGetStaticProps } from '../src/i18n';
import { NavBar } from '../src/react/components/navbar';
import { Page } from '../src/react/components/page';

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

export async function getStaticProps(arg) {
  return await i18nGetStaticProps(arg);
}