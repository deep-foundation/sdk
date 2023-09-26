import { HStack, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export function NavBar({ }) {
  return <>
    <HStack>
    <Link as={NextLink} href='/'>
      Home
    </Link>
    </HStack>
  </>
}