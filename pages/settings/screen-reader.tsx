import {
  Card,
  CardBody,
  CardHeader,
  ChakraProvider,
  FormControl,
  FormLabel,
  Heading,
  Switch,
} from '@chakra-ui/react';
import { DeepProvider } from '@deep-foundation/deeplinks/imports/client';
import { useLocalStore } from '@deep-foundation/store/local';
import { Provider } from '../../imports/provider';
import { CapacitorStoreKeys } from '../../imports/capacitor-store-keys';

function Content() {
  const [isScreenReaderSubscriptionEnabled, setIsScreenReaderSubscriptionEnabled] =
    useLocalStore(
      CapacitorStoreKeys[CapacitorStoreKeys.IsScreenReaderSubscriptionEnabled],
      undefined
    );

  return (
    <Card>
      <CardHeader>
        <Heading>Screen Reader</Heading>
      </CardHeader>
      <CardBody>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="screen-reader-subscription-switch" mb="0">
            Screen Reader Subscription
          </FormLabel>
          <Switch
            id="screenreader-subscription-switch"
            isChecked={isScreenReaderSubscriptionEnabled}
            onChange={(event) => {
              setIsScreenReaderSubscriptionEnabled(event.target.checked);
            }}
          />
        </FormControl>
      </CardBody>
    </Card>
  );
}

export default function ScreenReaderSettingsPage() {
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
