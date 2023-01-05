import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { VoiceRecorder } from "capacitor-voice-recorder"
import { PACKAGE_NAME } from "./initialize-package";

export default async function checkDeviceSupport(deep: DeepClient) {
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const deviceSupportTypelinkId = await deep.id(PACKAGE_NAME, "DeviceSupport");
  const customContainerTypeLinkId = await deep.id(deep.linkId, "AudioRec");
  console.log(customContainerTypeLinkId);
  

  const { value: supported } = await VoiceRecorder.canDeviceVoiceRecord();
console.log({
  type_id: deviceSupportTypelinkId,
  string: { data: { value: supported ? "true" : "false" } },
  in: {
    data: [{
      type_id: containTypeLinkId,
      from_id: customContainerTypeLinkId,
    }]
  }
});
  const { data } = await deep.insert({
    type_id: deviceSupportTypelinkId,
    string: { data: { value: supported ? "true" : "false" } },
    in: {
      data: [{
        type_id: containTypeLinkId,
        from_id: customContainerTypeLinkId,
      }]
    }
  })
  console.log(JSON.stringify(data))
}

