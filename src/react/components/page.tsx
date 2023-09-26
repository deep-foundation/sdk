import { WithPackagesInstalled } from "@deep-foundation/react-with-packages-installed";
import { WithProviders } from "./with-providers";
import { StoreProvider } from "./store-provider";
import { Button, CircularProgress, Stack, Text, VStack } from "@chakra-ui/react";
import { useLocalStore } from "@deep-foundation/store/local";
import { CapacitorStoreKeys } from "../../capacitor-store-keys";
import {
  DeepClient,
  DeepProvider,
  useDeep,
} from "@deep-foundation/deeplinks/imports/client";
import { ErrorAlert } from "./error-alert";
import { WithLogin } from "./with-login";

export interface PageParam {
  renderChildren: (param: { deep: DeepClient }) => JSX.Element;
}

export function Page({ renderChildren }: PageParam) {
  return (
    <WithProviders>
      <WithLogin>
        <WithDeep
          renderChildren={({ deep }) => {
            return (
              <WithPackagesInstalled
                deep={deep}
                packageNames={[]}
                renderIfError={(error) => <ErrorAlert title={error.message} />}
                renderIfNotInstalled={(packageNames) => (
                  <>
                    <ErrorAlert
                      title={`Install these deep packages to proceed: ${packageNames.join(
                        ", "
                      )}`}
                    />
                  </>
                )}
                renderIfLoading={() => (
                  <VStack height="100vh" justifyContent={"center"}>
                    <CircularProgress isIndeterminate />
                    <Text>Checking if deep packages are installed...</Text>
                  </VStack>
                )}
              >
                {renderChildren({ deep })}
              </WithPackagesInstalled>
            );
          }}
        />
      </WithLogin>
    </WithProviders>
  );
}

interface WithDeepProps {
  renderChildren: (param: { deep: DeepClient }) => JSX.Element;
}

function WithDeep({ renderChildren }: WithDeepProps) {
  const deep = useDeep();
  return deep.linkId ? renderChildren({ deep }) : null;
}
