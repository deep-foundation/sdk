
import React from 'react';
import { TokenProvider } from '@deep-foundation/deeplinks/imports/react-token';
import { LocalStoreProvider, useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep } from '@deep-foundation/deeplinks/imports/client';

import { Button, ChakraProvider, Stack } from '@chakra-ui/react';
import { saveGeneralInfo } from '../imports/device/save-general-info';
import { initializePackage } from '../imports/device/initialize-package';
import { PACKAGE_NAME } from '../imports/device/package-name';
import { getBatteryInfo as saveBatteryInfo } from '../imports/device/save-battery-info';
import { getLanguageId as saveLanguageId } from '../imports/device/save-language-id';
import { getLanguageTag as saveLanguageTag } from '../imports/device/save-language-tag';
import { Provider } from '../imports/provider';


function Page() {

  const deep = useDeep();
  const [deviceLinkId, setDeviceLinkId] = useLocalStore("deviceLinkId", undefined);

  return <Stack>
    <Button onClick={async () => {
      await deep.guest();
      await deep.login({
        linkId: await deep.id("deep", "admin")
      });
    }}>Login as admin</Button>
    <Button onClick={async () => {
      await initializePackage(deep);
      if(!deviceLinkId) {
        const deviceTypeLinkId = await deep.id(PACKAGE_NAME, "Device");
        const {data: [{id: newDeviceLinkId}]} = await deep.insert({
          type_id: deviceTypeLinkId
        })
        setDeviceLinkId(newDeviceLinkId);
      }
    }}>Initialize package</Button>
    
    <Button onClick={() => {saveGeneralInfo(deep, deviceLinkId)}}>Save general info</Button>
    <Button onClick={() => {saveBatteryInfo(deep, deviceLinkId)}}>Save battery info</Button>
    <Button onClick={() => {saveLanguageId(deep, deviceLinkId)}}>Save language id</Button>
    <Button onClick={() => {saveLanguageTag(deep, deviceLinkId)}}>Save language tag</Button>
  </Stack>;
}

export default function Device() {
  return (
		<ChakraProvider>
			<Provider>
				<DeepProvider>
					<Page />
				</DeepProvider>
			</Provider>
		</ChakraProvider>
	);
}