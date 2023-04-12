import React from 'react';
import {
  useLocalStore,
} from '@deep-foundation/store/local';
import {
  DeepProvider,
  useDeep,
} from '@deep-foundation/deeplinks/imports/client';
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { Provider } from '../imports/provider';
import { Device } from '@capacitor/device';
import { saveDeviceData } from '../imports/device/save-device-data';
import { NavBar } from '../components/navbar';

function Content() {
  const deep = useDeep();
  const [deviceLinkId, setDeviceLinkId] = useLocalStore(
    'deviceLinkId',
    undefined
  );

  return (
    <Stack alignItems={"center"}>
      <NavBar/>
      <Button
        onClick={async () => {
          const deviceGeneralInfo = await Device.getInfo();
          await saveDeviceData({deep, deviceLinkId, data: deviceGeneralInfo});
        }}
      >
        Save general info
      </Button>
      <Button
        onClick={async () => {
          const deviceBatteryInfo = await Device.getBatteryInfo();
          await saveDeviceData({deep, deviceLinkId, data: deviceBatteryInfo});
        }}
      >
        Save battery info
      </Button>
      <Button
        onClick={async () => {
          const deviceLanguageCode = await Device.getLanguageCode();
          await saveDeviceData({deep, deviceLinkId, data: {languageCode: deviceLanguageCode.value}});
        }}
      >
        Save language id
      </Button>
      <Button
        onClick={async () => {
          const deviceLanguageTag = await Device.getLanguageTag();
          await saveDeviceData({deep, deviceLinkId, data: {languageTag: deviceLanguageTag.value}});
        }}
      >
        Save language tag
      </Button>
    </Stack>
  );
}

export default function DevicePage() {
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
