
import React, { useCallback } from 'react';
import { TokenProvider } from '@deep-foundation/deeplinks/imports/react-token';
import { LocalStoreProvider, useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep, useDeepSubscription } from '@deep-foundation/deeplinks/imports/client';

import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
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
        <Text>{deviceLinkId}</Text>
    <Button onClick={async () => {
      console.log({deviceLinkId});
      await initializePackage(deep);
      if(!deviceLinkId) {
        const deviceTypeLinkId = await deep.id(PACKAGE_NAME, "Device");
        const {data: [{id: newDeviceLinkId}]} = await deep.insert({
          type_id: deviceTypeLinkId
        })
        console.log({newDeviceLinkId});
        setDeviceLinkId(newDeviceLinkId);
      }
      console.log({deviceLinkId});
      
    }}>Initialize package</Button>
    
    <Button onClick={useCallback(() => {
      saveGeneralInfo(deep, deviceLinkId)
    }, [deep, deviceLinkId])}>Save general info</Button>
    <Button onClick={useCallback(() => {
      saveBatteryInfo(deep, deviceLinkId)
    }, [deep, deviceLinkId])}>Save battery info</Button>
    <Button onClick={useCallback(() => {
      saveLanguageId(deep, deviceLinkId)
    }, [deep, deviceLinkId])}>Save language id</Button>
    <Button onClick={useCallback(() => {
      saveLanguageTag(deep, deviceLinkId)
    }, [deep, deviceLinkId])}>Save language tag</Button>
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