import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";
import { Device } from "@capacitor/device";

export async function getBatteryInfo(deep: DeepClient, deviceLinkId: number) {
	const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
  const batteryLevelTypeLinkId = await deep.id(PACKAGE_NAME, 'BatteryLevel');
  const isChargingTypeLinkId = await deep.id(PACKAGE_NAME, 'BatteryLevel');

  const {batteryLevel, isCharging} = await Device.getBatteryInfo();

	const {
		data: [{ id: batteryLevelLinkId }],
	} = await deep.insert({
		type_id: batteryLevelTypeLinkId,
		number: { data: { value: batteryLevel } },
		in: {
			data: {
				type_id: containTypeLinkId,
				from_id: deviceLinkId,
			},
		},
	});

  if(isCharging) {
    const {
      data: [{ id: isChargingLinkId }],
    } = await deep.insert({
      type_id: isChargingTypeLinkId,
      number: { data: { value: batteryLevel } },
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: deviceLinkId,
        },
      },
    });
  }
}