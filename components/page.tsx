import { WithPackagesInstalled } from '@deep-foundation/react-with-packages-installed';
import { DEEP_MEMO_PACKAGE_NAME } from '../imports/deep-memo/package-name';
import { ProvidersAndLoginOrContent } from './providers-and-login-or-content';
import { StoreProvider } from './store-provider';
import { ErrorAlert } from './error-alert';
import { Text } from '@chakra-ui/react';
import { useLocalStore } from '@deep-foundation/store/local';
import { CapacitorStoreKeys } from '../imports/capacitor-store-keys';
import { WithDeviceInsertionIfDoesNotExistAndSavingdata } from '@deep-foundation/capacitor-device-react-integration';
import {
  DeepClient,
  DeepProvider,
  useDeep,
} from '@deep-foundation/deeplinks/imports/client';

export interface PageParam {
  renderChildren: (param: {
    deep: DeepClient;
    deviceLinkId: number;
  }) => JSX.Element;
}

export function Page({ renderChildren }: PageParam) {
  return (
    <StoreProvider>
      <ProvidersAndLoginOrContent>
        <WithDeep
          renderChildren={({ deep }) => {
            console.log({deep});
            return <WithPackagesInstalled
            packageNames={[DEEP_MEMO_PACKAGE_NAME]}
            renderIfError={(error) => <ErrorAlert error={error} />}
            renderIfNotInstalled={(packageNames) => (
              <ErrorAlert
                error={
                  new Error(
                    `Install these deep packages to proceed: ${packageNames.join(
                      ', '
                    )}`
                  )
                }
              />
            )}
            renderIfLoading={() => (
              <Text>Checking if deep packages are installed...</Text>
            )}
            shouldIgnoreResultWhenLoading={true}
          >
            <WithDeviceLinkId
              deep={deep}
              renderChildren={({ deviceLinkId }) =>
                renderChildren({ deep, deviceLinkId })
              }
            />
          </WithPackagesInstalled>
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
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    CapacitorStoreKeys[CapacitorStoreKeys.DeviceLinkId],
    undefined
  );

  return (
    <WithDeviceInsertionIfDoesNotExistAndSavingdata
      containerLinkId={deep.linkId}
      deep={deep}
      deviceLinkId={deviceLinkId}
      setDeviceLinkId={setDeviceLinkId}
      renderIfLoading={() => <Text>Initializing device...</Text>}
      renderIfNotInserted={() => <Text>Initializing device...</Text>}
    >
      {renderChildren({ deviceLinkId })}
    </WithDeviceInsertionIfDoesNotExistAndSavingdata>
  );
}
