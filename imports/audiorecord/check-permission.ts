import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"
import { PACKAGE_NAME } from "./initialize-package";

export default async function checkAudioRecPermission(deep: DeepClient, deviceLinkId) {
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const permissionsTypelinkId = await deep.id(PACKAGE_NAME, "Permissions");
    const audioRecordsTypeLinkId = await deep.id(deviceLinkId, "AudioRecords");

    const { value: permission } = await VoiceRecorder.hasAudioRecordingPermission();

    const { data: [{ id: permissionLinkId }] } = await deep.insert({
        type_id: permissionsTypelinkId,
        string: { data: { value: permission ? "true" : "false" } },
        in: {
            data: [{
                type_id: containTypeLinkId,
                from_id: audioRecordsTypeLinkId,
            }]
        }
    })
}

