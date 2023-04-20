import { ChakraProvider } from "@chakra-ui/react";
import { DeepProvider, useDeep } from "@deep-foundation/deeplinks/imports/client";
import { Provider } from "../imports/provider";
import { useEffect } from "react";
import { useIsPackageInstalled } from "../imports/use-is-package-installed";
import { DEEP_MEMO_PACKAGE_NAME } from "../imports/deep-memo/package-name";

function Content() {
  const deep = useDeep();
  useEffect(() => {
    new Promise(async () => {
      if (deep.linkId !== 0) {
        return;
      }
      await deep.guest();
    })
  }, [deep])

  useEffect(() => {
    new Promise(async () => {
      if(deep.linkId === 0) {
        return;
      }
      const adminLinkId = await deep.id('deep', 'admin');
      if(deep.linkId === adminLinkId) {
        return;
      }
      await deep.login({linkId: adminLinkId})
    })
  }, [deep])

  useEffect(() => {
    console.log(`deep.linkId: ${deep.linkId}`)
  }, [deep])

  useIsPackageInstalled({packageName: DEEP_MEMO_PACKAGE_NAME});
  return null;
}

export default function TestPage() {
  return (
    <>
      <ChakraProvider>
        <Provider>
          <DeepProvider>
            <Content />
          </DeepProvider>
        </Provider>
      </ChakraProvider>
    </>
  );
}