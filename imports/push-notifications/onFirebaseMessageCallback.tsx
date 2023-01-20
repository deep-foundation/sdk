import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { MessagePayload } from "firebase/messaging";
import { insertPushNotificationToDeep } from "./insertPushNotificationToDeep";

export async function onFirebaseMessageCallback({deep, deviceLinkId, payload}: {deep: DeepClient, deviceLinkId: number, payload: MessagePayload}) {
  await insertPushNotificationToDeep({deep, deviceLinkId, payload})
}