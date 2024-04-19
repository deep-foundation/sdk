import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  VStack
} from '@chakra-ui/react';
import { useDeep } from '@deep-foundation/deeplinks/imports/client';
import { Connection } from '../src/connection';
import { i18nGetStaticProps } from '../src/i18n';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export default function Page() {
  const deep = useDeep();
  const { t } = useTranslation();
  const router = useRouter();

  // @ts-ignore
  if (typeof(window) === 'object') window.deep = deep;
  console.log('deep', deep);

  return (<Center p={'1em'}>
    <VStack p={3} spacing={3} width={'100vw'} maxWidth={500}>
      <Box pt={3}>
        <Heading as={'h1'} size='xl'>
          {t('sdk')}
          <HStack spacing={3} float='right'>
            <Button isDisabled={router.locale === 'ru'} onClick={() => router.push(router.asPath, router.asPath, { locale: 'ru' })}>ru</Button>
            <Button isDisabled={router.locale === 'en'} onClick={() => router.push(router.asPath, router.asPath, { locale: 'en' })}>en</Button>
          </HStack>
        </Heading>
        <Heading as={'h4'} size='md'>{t('sdk-description')}</Heading>
      </Box>
      <Connection/>
    </VStack>
  </Center>);
}

export async function getStaticProps(arg) {
  return await i18nGetStaticProps(arg);
}