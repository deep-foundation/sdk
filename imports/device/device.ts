import { DeviceInfo } from "@capacitor/device";

export type Device = Pick<DeviceInfo, 'name' | 'model'>