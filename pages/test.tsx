import { ChakraProvider } from "@chakra-ui/react";
import { DeepProvider, useDeep, useDeepSubscription } from "@deep-foundation/deeplinks/imports/client";
import { Provider } from "../imports/provider";
import { useEffect, useState } from "react";
import { useIsPackageInstalled } from "../imports/use-is-package-installed";
import { DEEP_MEMO_PACKAGE_NAME } from "../imports/deep-memo/package-name";
import { useLocalStore } from "@deep-foundation/store/local";

function Content() {
  const [state, setState] = useLocalStore('state', undefined)
  useEffect(() => {
    self['state'] = state;
    self['setState'] = setState
  }, [state])
//   const deep = useDeep();
//   useEffect(() => {
//     new Promise(async () => {
//       if (deep.linkId !== 0) {
//         return;
//       }
//       await deep.guest();
//     })
//   }, [deep])

//   useEffect(() => {
//     new Promise(async () => {
//       if(deep.linkId === 0) {
//         return;
//       }
//       const adminLinkId = await deep.id('deep', 'admin');
//       if(deep.linkId === adminLinkId) {
//         return;
//       }
//       await deep.login({linkId: adminLinkId})
//     })
//   }, [deep])

//   useEffect(() => {
//   }, [deep])

//   // const [isPackageInstalled, setIsPackageInstalled] = useState<boolean | undefined>(undefined);
//   // const { data, loading, error } = useDeepSubscription({
//   //   type_id: {
//   //     _id: ['@deep-foundation/core', 'Package'],
//   //   },
//   //   string: {
//   //     value: DEEP_MEMO_PACKAGE_NAME,
//   //   },
//   // });
//   // useEffect(() => {
//   //   if(loading || error) {
//   //     return;
//   //   }
//   //   setIsPackageInstalled(data.length > 0);
//   // }, [data, loading, error]);

  
//   const { isPackageInstalled: isMemoPackageInstalled } = useIsPackageInstalled({packageName: DEEP_MEMO_PACKAGE_NAME, shouldIgnoreResultWhenLoading: true, onError: ({error}) => {console.error(error.message)}});

// useEffect(() => {
// }, [isMemoPackageInstalled])

  return null;
}

export default function TestPage() {
  return (
    <>
      <ChakraProvider>
        {/* <Provider> */}
            <Content />
        {/* </Provider> */}
      </ChakraProvider>
    </>
  );
}