import {
  DeepClient,
  useDeepSubscription,
} from '@deep-foundation/deeplinks/imports/client';
import { saveAllCallHistory } from '../../imports/callhistory/callhistory';
import { saveAllContacts } from '../../imports/contact/contact';
import { insertDevice } from '../../imports/device/insert-device';
import { saveDeviceData } from '../../imports/device/save-device-data';
import { useState, useEffect } from 'react';
import { DEEP_MEMO_PACKAGE_NAME } from '../../imports/deep-memo/package-name';
import { CapacitorStoreKeys } from '../../imports/capacitor-store-keys';
import { useLocalStore } from '@deep-foundation/store/local';

export function WithAllSubscriptions({ deep }: { deep: DeepClient }) {
  const [adminLinkId, setAdminLinkId] = useLocalStore<number|undefined>(
    CapacitorStoreKeys[CapacitorStoreKeys.AdminLinkId],
    undefined
  );
  const [deviceLinkId, setDeviceLinkId] = useLocalStore<number|undefined>(
    CapacitorStoreKeys[CapacitorStoreKeys.DeviceLinkId],
    undefined
  );
  const [
    isActionSheetSubscriptionEnabled,
    setIsActionSheetSubscriptionEnabled,
  ] = useLocalStore<boolean|undefined>(
    CapacitorStoreKeys[CapacitorStoreKeys.IsActionSheetSubscriptionEnabled],
    undefined
  );
  const [isDialogSubscriptionEnabled, setIsDialogSubscriptionEnabled] =
    useLocalStore<boolean|undefined>(
      CapacitorStoreKeys[CapacitorStoreKeys.IsDialogSubscriptionEnabled],
      undefined
    );
  const [
    isScreenReaderSubscriptionEnabled,
    setIsScreenReaderSubscriptionEnabled,
  ] = useLocalStore<boolean|undefined>(
    CapacitorStoreKeys[CapacitorStoreKeys.IsScreenReaderSubscriptionEnabled],
    undefined
  );
  const [isHapticsSubscriptionEnabled, setIsHapticsSubscriptionEnabled] =
    useLocalStore<boolean|undefined>(
      CapacitorStoreKeys[CapacitorStoreKeys.IsHapticsSubscriptionEnabled],
      undefined
    );
  const [isContactsSyncEnabled, setIsContactsSyncEnabled] = useLocalStore<boolean|undefined>(
    CapacitorStoreKeys[CapacitorStoreKeys.IsContactsSyncEnabled],
    undefined
  );
  const [lastContactsSyncTime, setLastContactsSyncTime] = useLocalStore<number|undefined>(
    CapacitorStoreKeys[CapacitorStoreKeys.ContactsLastSyncTime],
    undefined
  );
  const [isCallHistorySyncEnabled, setIsCallHistorySyncEnabled] = useLocalStore<boolean|undefined>(
    CapacitorStoreKeys[CapacitorStoreKeys.IsCallHistorySyncEnabled],
    undefined
  );
  const [lastCallHistorySyncTime, setLastCallHistorySyncTime] = useLocalStore<number | undefined>(
    CapacitorStoreKeys[CapacitorStoreKeys.CallHistoryLastSyncTime],
    undefined
  );
  const [isNetworkSubscriptionEnabled, setIsNetworkSubscriptionEnabled] =
    useLocalStore<boolean|undefined>(
      CapacitorStoreKeys[CapacitorStoreKeys.IsNetworkSubscriptionEnabled],
      false
    );
  const [isVoiceRecorderEnabled, setIsVoiceRecorderEnabled] = useLocalStore<boolean|undefined>(
    CapacitorStoreKeys[CapacitorStoreKeys.IsVoiceRecorderEnabled],
    undefined
  );

  const [isMemoPackageInstalled, setIsMemoPackageInstalled] = useState<boolean | undefined>(undefined);
  {
    const { data, loading, error } = useDeepSubscription({
      type_id: {
        _id: ['@deep-foundation/core', 'Package'],
      },
      string: {
        value: DEEP_MEMO_PACKAGE_NAME,
      },
    });
    useEffect(() => {
      if (error) {
        console.error(error.message);
      }
      if (loading) {
        return;
      }
      console.log({ data });
      setIsMemoPackageInstalled(data.length !== 0);
    }, [data, loading, error]);
  }

  useEffect(() => {
    new Promise(async () => {
      if(!isMemoPackageInstalled) {
        return
      }
      if (!deviceLinkId) {
        const { deviceLink } = await insertDevice({ deep });
        setDeviceLinkId(deviceLink.id);
      } else {
        const { data: deviceLinks } = await deep.select(deviceLinkId);
        if (deviceLinks.length === 0) {
          setDeviceLinkId(undefined);
        } else {
          const {data: [deviceLink]} = await deep.select(deviceLinkId)
          await saveDeviceData({
            deep,
            deviceLink: deviceLink,
          });
          const currentTime = new Date().getTime();
          if (isContactsSyncEnabled) {
            if (currentTime - lastContactsSyncTime) {
              await saveAllContacts({ deep, deviceLinkId });
              setLastContactsSyncTime(currentTime);
            }
          }
          if (isCallHistorySyncEnabled) {
            if (currentTime - lastCallHistorySyncTime) {
              await saveAllCallHistory({ deep, deviceLinkId });
              setLastCallHistorySyncTime(currentTime);
            }
          }
          if (isNetworkSubscriptionEnabled) {
            // TODO
          }
        }
      }
    });
  }, [deviceLinkId, isMemoPackageInstalled]);

  return null
}
