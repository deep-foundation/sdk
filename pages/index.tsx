import {
  Box,
  Heading,
  VStack
} from '@chakra-ui/react';
import { useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Connection } from '../src/connection';
import { i18nGetStaticProps } from '../src/i18n';

export default function Page() {
  const deep = useDeep();

  // @ts-ignore
  if (typeof(window) === 'object') window.deep = deep;
  console.log('deep', deep);

  return (<VStack p={3} spacing={3}>
    <Box pt={3}>
      <Heading as={'h1'} size='xl'>Deep SDK</Heading>
      <Heading as={'h4'} size='md'>Minimalistic template/boilerplate for any project.</Heading>
    </Box>
    <Connection/>
  </VStack>);
}

export async function getStaticProps(arg) {
  return await i18nGetStaticProps(arg);
}