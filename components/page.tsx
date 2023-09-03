import { WithPackagesInstalled } from '@deep-foundation/react-with-packages-installed';
import { ProvidersAndLoginOrContent } from './providers-and-login-or-content';
import { StoreProvider } from './store-provider';
import { ErrorAlert } from './error-alert';
import { Button, Stack, Text } from '@chakra-ui/react';
import { useLocalStore } from '@deep-foundation/store/local';
import { CapacitorStoreKeys } from '../imports/capacitor-store-keys';
import { WithDeviceInsertionIfDoesNotExistAndSavingData, insertDevice } from '@deep-foundation/capacitor-device';
import {
  DeepClient,
  DeepProvider,
  useDeep,
} from '@deep-foundation/deeplinks/imports/client';

export interface PageParam {
  renderChildren: (param: {
    deep: DeepClient;
  }) => JSX.Element;
}

export function Page({ renderChildren }: PageParam) {
  return (
    <StoreProvider>
      <ProvidersAndLoginOrContent>
        <WithDeep
          renderChildren={({ deep }) => {
            console.log({ deep });
            return (
              <WithPackagesInstalled
              deep={deep}
                packageNames={[]}
                renderIfError={(error) => <ErrorAlert error={error} />}
                renderIfNotInstalled={(packageNames) => (
                  <>
                    <ErrorAlert
                      error={
                        new Error(
                          `Install these deep packages to proceed: ${packageNames.join(
                            ', '
                          )}`
                        )
                      }
                    />
                  </>
                )}
                renderIfLoading={() => (
                  <Text>Checking if deep packages are installed...</Text>
                )}
              >
                {renderChildren({ deep })}
              </WithPackagesInstalled>
            );
          }}
        />
      </ProvidersAndLoginOrContent>
    </StoreProvider>
  );
}

interface WithDeepProps {
  renderChildren: (param: { deep: DeepClient }) => JSX.Element;
}

function WithDeep({ renderChildren }: WithDeepProps) {
  const deep = useDeep();
  return renderChildren({ deep });
}

interface WithDeviceLinkIdProps {
  deep: DeepClient;
  renderChildren: (param: { deviceLinkId: number }) => JSX.Element;
}

function WithDeviceLinkId({ deep, renderChildren }: WithDeviceLinkIdProps) {
  const [deviceLinkId, setDeviceLinkId] = useLocalStore<number|undefined>(
    CapacitorStoreKeys[CapacitorStoreKeys.DeviceLinkId],
    undefined
  );

  return (
    deep.linkId ? <WithDeviceInsertionIfDoesNotExistAndSavingData
      containerLinkId={deep.linkId}
      deep={deep}
      deviceLinkId={deviceLinkId}
      renderIfLoading={() => <Text>Initializing device...</Text>}
      renderIfNotInserted={() => <Text>Initializing device...</Text>}
      insertDeviceCallback={async () => {
        const {deviceLink} = await insertDevice({
          deep,
        });
        setDeviceLinkId(deviceLink.id)
      }}
    >
      {renderChildren({ deviceLinkId })}
    </WithDeviceInsertionIfDoesNotExistAndSavingData> : null
  );
}
