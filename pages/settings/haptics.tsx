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
  const [
    isHapticsSubscriptionEnabled,
    setIsHapticsSubscriptionEnabled,
  ] = useLocalStore(CapacitorStoreKeys[CapacitorStoreKeys.IsHapticsSubscriptionEnabled], false);

  return (
    <Card>
      <CardHeader>
        <Heading>Haptics</Heading>
      </CardHeader>
      <CardBody>
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="action-sheet-subscription-switch" mb="0">
            Haptics Subscription
          </FormLabel>
          <Switch
            id="action-sheet-subscription-switch"
            isChecked={isHapticsSubscriptionEnabled}
            onChange={(event) => {
              setIsHapticsSubscriptionEnabled(event.target.checked);
            }}
          />
        </FormControl>
      </CardBody>
    </Card>
  );
}

export default function HapticsSettingsPage() {
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
