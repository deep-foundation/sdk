import { ChakraProvider, Link } from "@chakra-ui/react";
import { DeepClient, DeepProvider } from "@deep-foundation/deeplinks/imports/client";
import { Provider } from "../imports/provider";
import NextLink from 'next/link';
import { Page } from "../components/page";


function Content({deep, deviceLinkId}: {deep :DeepClient, deviceLinkId: number}) {
   return <>
             <div>
            <Link as={NextLink} href="/settings/action-sheet">
              Action Sheet
            </Link>
          </div>
   </>
}

export default function SettingsPage() {
   return (
    <Page renderChildren={({deep,deviceLinkId}) => <Content deep={deep} deviceLinkId={deviceLinkId} />} />
   );
 }