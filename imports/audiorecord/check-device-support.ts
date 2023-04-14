import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"
import { PACKAGE_NAME } from "./install-package";

export default async function checkDeviceSupport(deep: DeepClient, deviceLinkId) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const deviceSupportTypelinkId = await deep.id(PACKAGE_NAME, "DeviceSupport");
  const audioRecordsLinkId = await deep.id(deviceLinkId, "AudioRecords");

  const { value: supported } = await VoiceRecorder.canDeviceVoiceRecord();

  await deep.delete({
    up: {
      tree_id: {
        _id: ['@deep-foundation/core', 'containTree'],
      },
      parent: {
        type_id: {
          _id: ['@deep-foundation/core', 'Contain'],
        },
        from_id: audioRecordsLinkId,
        to: {
          _or: [
            {
              type_id: {
                _id: [PACKAGE_NAME, 'DeviceSupport'],
              },
            },
          ],
        },
      },
    },
  });

  const { data } = await deep.insert({
    type_id: deviceSupportTypelinkId,
    string: { data: { value: supported ? "true" : "false" } },
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: audioRecordsLinkId,
      }]
    }
  })
}

