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
  const [isDialogSubscriptionEnabled, setIsDialogSubscriptionEnabled] =
    useLocalStore(
      CapacitorStoreKeys[CapacitorStoreKeys.IsDialogSubscriptionEnabled],
      undefined
    );

  return (
    <Card>
      <CardHeader>
        <Heading>Dialog</Heading>
      </CardHeader>
      <CardBody>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="dialog-subscription-switch" mb="0">
            Dialog Subscription
          </FormLabel>
          <Switch
            id="dialog-subscription-switch"
            isChecked={isDialogSubscriptionEnabled}
            onChange={(event) => {
              setIsDialogSubscriptionEnabled(event.target.checked);
            }}
          />
        </FormControl>
      </CardBody>
    </Card>
  );
}

export default function DialogSettingsPage() {
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
