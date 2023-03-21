import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { PACKAGE_NAME } from './package-name';
import { Device, DeviceInfo } from '@capacitor/device';

export async function insertGeneralInfoToDeep({deep, deviceLinkId, deviceGeneralInfo}: {deep: DeepClient, deviceLinkId: number, deviceGeneralInfo: DeviceInfo}) {
	if(!deviceLinkId) {
		throw new Error("deviceLinkId must not be 0")
	}

	const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
	const nameTypeLinkId = await deep.id(PACKAGE_NAME, 'Name');
	const modelTypeLinkId = await deep.id(PACKAGE_NAME, 'Model');
	const platformTypeLinkId = await deep.id(PACKAGE_NAME, 'Platform');
	const operatingSystemTypeLinkId = await deep.id(
		PACKAGE_NAME,
		'Operating System'
	);
	const osVersionTypeLinkId = await deep.id(PACKAGE_NAME, 'OS Version');
	const manufacturerTypeLinkId = await deep.id(PACKAGE_NAME, 'Manufacturer');
	const isVirtualTypeLinkId = await deep.id(PACKAGE_NAME, 'IsVirtual');
	const memUsedTypeLinkId = await deep.id(PACKAGE_NAME, 'MemUsed');
	const realDiskFreeTypeLinkId = await deep.id(PACKAGE_NAME, 'RealDiskFree');
	const webViewVersionTypeLinkId = await deep.id(
		PACKAGE_NAME,
		'WebViewVersion'
	);

		await deep.insert([
			deviceGeneralInfo.name && {
				type_id: nameTypeLinkId,
				string: { data: { value: deviceGeneralInfo.name } },
				in: {
					data: {
						type_id: containTypeLinkId,
						from_id: deviceLinkId,
					},
				},
			},
		
			{
				type_id: modelTypeLinkId,
				string: { data: { value: deviceGeneralInfo.model } },
				in: {
					data: {
						type_id: containTypeLinkId,
						from_id: deviceLinkId,
					},
				},
			},
		
			{
				type_id: platformTypeLinkId,
				string: { data: { value: deviceGeneralInfo.platform } },
				in: {
					data: {
						type_id: containTypeLinkId,
						from_id: deviceLinkId,
					},
				},
			},
		
			{
				type_id: operatingSystemTypeLinkId,
				string: { data: { value: deviceGeneralInfo.operatingSystem } },
				in: {
					data: {
						type_id: containTypeLinkId,
						from_id: deviceLinkId,
					},
				},
			},
		
			{
				type_id: osVersionTypeLinkId,
				string: { data: { value: deviceGeneralInfo.osVersion } },
				in: {
					data: {
						type_id: containTypeLinkId,
						from_id: deviceLinkId,
					},
				},
			},
		
			{
				type_id: manufacturerTypeLinkId,
				string: { data: { value: deviceGeneralInfo.manufacturer } },
				in: {
					data: {
						type_id: containTypeLinkId,
						from_id: deviceLinkId,
					},
				},
			},
		
			deviceGeneralInfo.isVirtual && {
				type_id: isVirtualTypeLinkId,
				in: {
					data: {
						type_id: containTypeLinkId,
						from_id: deviceLinkId,
					},
				},
			},
		
			deviceGeneralInfo.memUsed && {
				type_id: memUsedTypeLinkId,
				number: { data: { value: deviceGeneralInfo.memUsed } },
				in: {
					data: {
						type_id: containTypeLinkId,
						from_id: deviceLinkId,
					},
				},
			},
		
			deviceGeneralInfo.realDiskFree && {
				type_id: realDiskFreeTypeLinkId,
				number: { data: { value: deviceGeneralInfo.realDiskFree } },
				in: {
					data: {
						type_id: containTypeLinkId,
						from_id: deviceLinkId,
					},
				},
			},
		
			{
				type_id: webViewVersionTypeLinkId,
				string: { data: { value: deviceGeneralInfo.webViewVersion } },
				in: {
					data: {
						type_id: containTypeLinkId,
						from_id: deviceLinkId,
					},
				},
			},
		])
}
