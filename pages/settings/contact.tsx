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
  const [isContactsSyncEnabled, setIsContactsSyncEnabled] = useLocalStore(
    'isContactsSyncEnabled',
    undefined
  );

  return (
    <Card>
          <CardHeader>
            <Heading>Contacts</Heading>
          </CardHeader>
          <CardBody>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="sync-contacts-switch" mb="0">
                Sync Contacts
              </FormLabel>
              <Switch
                id="sync-contacts-switch"
                isChecked={isContactsSyncEnabled}
                onChange={(event) => {
                  setIsContactsSyncEnabled(event.target.checked);
                }}
              />
            </FormControl>
          </CardBody>
        </Card>
  );
}

export default function ContactsSettingsPage() {
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
