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
    isActionSheetSubscriptionEnabled,
    setIsActionSheetSubscriptionEnabled,
  ] = useLocalStore(CapacitorStoreKeys[CapacitorStoreKeys.IsActionSheetSubscriptionEnabled], undefined);

  return (
    <Card>
      <CardHeader>
        <Heading>Action Sheet</Heading>
      </CardHeader>
      <CardBody>
      <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="action-sheet-subscription-switch" mb="0">
            Action Sheet Subscription
          </FormLabel>
          <Switch
            id="action-sheet-subscription-switch"
            isChecked={isActionSheetSubscriptionEnabled}
            onChange={(event) => {
              setIsActionSheetSubscriptionEnabled(event.target.checked);
            }}
          />
        </FormControl>
      </CardBody>
    </Card>
  );
}

export default function ActionSheetSettingsPage() {
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
