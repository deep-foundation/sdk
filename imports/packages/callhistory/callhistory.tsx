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


export async function createAllCallHistory({ deep, deviceLinkId }: { deep: DeepClient, deviceLinkId: number }) {
  await CallLog.getPermissions();

  const typeContainLinkId = await deep.id(
    "@deep-foundation/core",
    "Contain"
  );

  const typeCallInfoLinkId = await deep.id(
    "@l4legenda/capacitor-call-history",
    "callInfo"
  );
  const typePhoneNumberLinkId = await deep.id(
    "@l4legenda/capacitor-call-history",
    "phoneNumber"
  );
  const typeTypeLinkId = await deep.id(
    "@l4legenda/capacitor-call-history",
    "type"
  );
  const typeDateLinkId = await deep.id(
    "@l4legenda/capacitor-call-history",
    "date"
  );
  const typeDurationLinkId = await deep.id(
    "@l4legenda/capacitor-call-history",
    "duration"
  );


  const res = await CallLog.getCallHistory();
  const call_history_request = res.call_log.map(callLog => ({
    type_id: typeCallInfoLinkId,
    in: {
      data: {
        type_id: typeContainLinkId,
        from_id: deviceLinkId,
      }
    },
    out: {
      data: [
        {
          type_id: typeContainLinkId,
          to: {
            data: {
              type_id: typePhoneNumberLinkId,
              string: { data: { value: callLog.phoneNumber } }
            }
          }
        },
        {
          type_id: typeContainLinkId,
          to: {
            data: {
              type_id: typeTypeLinkId,
              string: { data: { value: callLog.type } }
            }
          }
        },
        {
          type_id: typeContainLinkId,
          to: {
            data: {
              type_id: typeDurationLinkId,
              string: { data: { value: callLog.duration } }
            }
          }
        },
        {
          type_id: typeContainLinkId,
          to: {
            data: {
              type_id: typeDateLinkId,
              string: { data: { value: callLog.date } }
            }
          }
        },
      ]
    }
  }))

  await deep.insert(call_history_request[0]);
}
