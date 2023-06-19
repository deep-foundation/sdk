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
import { DeepClient, DeepProvider } from '@deep-foundation/deeplinks/imports/client';
import { useLocalStore } from '@deep-foundation/store/local';
import { Provider } from '../../imports/provider';
import { CapacitorStoreKeys } from '../../imports/capacitor-store-keys';
import { Page } from '../../components/page';

function Content({deep, deviceLinkId}: {deep :DeepClient, deviceLinkId: number}) {
  const [
    isHapticsSubscriptionEnabled,
    setIsHapticsSubscriptionEnabled,
  ] = useLocalStore(CapacitorStoreKeys[CapacitorStoreKeys.IsHapticsSubscriptionEnabled], undefined);

  return (
    <Card>
    <CardHeader>
      <Heading>Haptics</Heading>
    </CardHeader>
    <CardBody>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="haptics-vibrate-subscription-switch" mb="0">
          Haptics Vibrate Subscription
        </FormLabel>
        <Switch
          id="haptics-vibrate-subscription-switch"
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
    <Page renderChildren={({deep,deviceLinkId}) => <Content deep={deep} deviceLinkId={deviceLinkId} />} />
  );
}
