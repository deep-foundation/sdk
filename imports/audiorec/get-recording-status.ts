import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"
import { PACKAGE_NAME } from "./initialize-package";

export default async function getRecordingStatus(deep: DeepClient) {
  // const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  // const recordingStatusTypelinkId = await deep.id(PACKAGE_NAME, "RecordingStatus");
  // const customContainerTypeLinkId = await deep.id(deep.linkId, "AudioRec");

  const { status } = await VoiceRecorder.getCurrentStatus();
  // if (status) {
  //   const { data: [{ id: statusLinkId }] } = await deep.insert({
  //     type_id: recordingStatusTypelinkId,
  //     string: { data: { value: `${status} ${new Date().toLocaleString()}` } },
  //     in: {
  //       data: [{
  //         type_id: containTypeLinkId,
  //         from_id: customContainerTypeLinkId,
  //       }]
  //     }
  //   })
  //   return { status, statusLinkId };
  // }
  return status;
}

