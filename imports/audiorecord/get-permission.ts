import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"
import { PACKAGE_NAME } from "./initialize-package";

export default async function getAudioRecPermission(deep: DeepClient) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const permissionTypelinkId = await deep.id(PACKAGE_NAME, "Permissions");
  const audioRecordsTypeLinkId = await deep.id(deep.linkId, "AudioRecords");

  const { value: permission } = await VoiceRecorder.requestAudioRecordingPermission();

  const { data: [{ id: permissionLinkId }] } = await deep.insert({
    type_id: permissionTypelinkId,
    string: { data: { value: permission ? "true" : "false" } },
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: audioRecordsTypeLinkId,
      }]
    }
  })
}

