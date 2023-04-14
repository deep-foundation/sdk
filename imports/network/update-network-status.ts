import { Network } from "@capacitor/network"
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import saveNetworkStatus from "./save-network-status";

export default async function updateNetworkStatus(deep, deviceLinkId, connections) {
    for (const connection of connections) {
        await saveNetworkStatus(deep, deviceLinkId, connection);
    }
}