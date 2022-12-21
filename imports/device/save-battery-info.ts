import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";
import { Device } from "@capacitor/device";

export async function getBatteryInfo(deep: DeepClient, deviceLinkId: number) {
	
  if(!deviceLinkId) {
		throw new Error("deviceLinkId must not be 0")
	}

	const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const batteryLevelTypeLinkId = await deep.id(PACKAGE_NAME, 'BatteryLevel');
  const isChargingTypeLinkId = await deep.id(PACKAGE_NAME, 'IsCharging');
  const isNotChargingTypeLinkId = await deep.id(PACKAGE_NAME, 'IsNotCharging');

  const {batteryLevel, isCharging} = await Device.getBatteryInfo();

	const {
		data: [{ id: batteryLevelLinkId }],
	} = await deep.insert({
		type_id: batteryLevelTypeLinkId,
		number: { data: { value: Math.floor(batteryLevel*100) } },
		in: {
			data: {
				type_id: containTypeLinkId,
				from_id: deviceLinkId,
			},
		},
	});

  const {
    data: [{ id: chargingLinkId }],
  } = await deep.insert({
    type_id: isCharging ? isChargingTypeLinkId : isNotChargingTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: deviceLinkId,
      },
    },
  });
}