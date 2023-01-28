import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"
import { PACKAGE_NAME } from "./initialize-package";

export default async function checkAudioRecPermission(deep: DeepClient, deviceLinkId) {
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const permissionsTypelinkId = await deep.id(PACKAGE_NAME, "Permissions");
    const audioRecordsLinkId = await deep.id(deviceLinkId, "AudioRecords");

    const { value: permission } = await VoiceRecorder.hasAudioRecordingPermission();

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
                    _id: [PACKAGE_NAME, 'Permissions'],
                  },
                },
              ],
            },
          },
        },
      });

    const { data: [{ id: permissionLinkId }] } = await deep.insert({
        type_id: permissionsTypelinkId,
        string: { data: { value: permission ? "true" : "false" } },
        in: {
            data: [{
                type_id: containTypeLinkId,
                from_id: audioRecordsLinkId,
            }]
        }
    })
}

