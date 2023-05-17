import { ChakraProvider, Link } from "@chakra-ui/react";
import { DeepProvider } from "@deep-foundation/deeplinks/imports/client";
import { Provider } from "../imports/provider";
import NextLink from 'next/link';


function Content () {
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
     <ChakraProvider>
       <Provider>
         <DeepProvider>
           <Content />
         </DeepProvider>
       </Provider>
     </ChakraProvider>
   );
 }