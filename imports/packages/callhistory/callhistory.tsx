import { registerPlugin } from '@capacitor/core';
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
interface IPermissionStatus {
  granted: boolean;
}

export interface ICallHistory {
  phoneNumber: string;
  type: string;
  date: string;
  duration: string;
}

interface ICallHistoryPlugin {
  getPermissions(): Promise<IPermissionStatus>;
  getCallHistory(): Promise<{ call_log: ICallHistory[] }>;

}

export const CallLog = registerPlugin<ICallHistoryPlugin>('CallHistory');


export async function createAllCallHistory({ deep }: { deep: DeepClient }) {
  await CallLog.getPermissions();

  const callInfoType = await deep.id(
    "@deep-foundation/callhistory",
    "callInfo"
  );
  const phoneNumberType = await deep.id(
    "@deep-foundation/callhistory",
    "phoneNumber"
  );
  const typeType = await deep.id(
    "@deep-foundation/callhistory",
    "type"
  );
  const dateType = await deep.id(
    "@deep-foundation/callhistory",
    "date"
  );
  const durationType = await deep.id(
    "@deep-foundation/callhistory",
    "duration"
  );

  const ml = new ManagerLinks(deep);
  const res = await CallLog.getCallHistory();
  for (const call_log of res.call_log) {
    const callInfoLink = await ml.createLink({
      containName: "",
      contain_from_id: deep.linkId,
      type_id: callInfoType,
    });
    const phoneNumber = await ml.createLink({
      containName: "phoneNumber",
      value: call_log.phoneNumber,
      contain_from_id: callInfoLink,
      type_id: phoneNumberType,
    });
    const type = await ml.createLink({
      containName: "type",
      value: call_log.type,
      contain_from_id: callInfoLink,
      type_id: typeType,
    });
    const date = await ml.createLink({
      containName: "date",
      value: call_log.date,
      contain_from_id: callInfoLink,
      type_id: dateType,
    });
    const duration = await ml.createLink({
      containName: "duration",
      value: call_log.duration,
      contain_from_id: callInfoLink,
      type_id: durationType,
    });
    break;
  }
}

export async function createCallHistoryPackage({ deep }: { deep: DeepClient }) {
  const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type");
  const packageTypeLinkId = await deep.id("@deep-foundation/core", "Package");

  const ml = new ManagerLinks(deep);

  const callhistoryPackage = await ml.createLink({
    value: "@deep-foundation/callhistory",
    contain_from_id: deep.linkId,
    type_id: packageTypeLinkId,
  });
  const callInfo = await ml.createLink({
    containName: "callInfo",
    contain_from_id: callhistoryPackage,
    type_id: typeTypeLinkId,
  });
  const phoneNumber = await ml.createLink({
    containName: "phoneNumber",
    contain_from_id: callhistoryPackage,
    type_id: typeTypeLinkId,
  });
  const type = await ml.createLink({
    containName: "type",
    contain_from_id: callhistoryPackage,
    type_id: typeTypeLinkId,
  });
  const date = await ml.createLink({
    containName: "date",
    contain_from_id: callhistoryPackage,
    type_id: typeTypeLinkId,
  });
  const duration = await ml.createLink({
    containName: "duration",
    contain_from_id: callhistoryPackage,
    type_id: typeTypeLinkId,
  });
}

class ManagerLinks {
  constructor(private deep: DeepClient) { }

  async createLink({
    containName,
    value,
    contain_from_id,
    type_id,
  }: {
    containName?: string;
    value?: string;
    contain_from_id: number;
    type_id: number;
  }) {
    const {
      data: [{ id }],
    } = await this.deep.insert({
      type_id: type_id,
      ...(value && { string: { data: { value: value } } }),
      in: {
        data: {
          type_id: 3,
          from_id: contain_from_id,
          ...(containName && { string: { data: { value: containName } } }),
        },
      },
    });
    return id;
  }
}